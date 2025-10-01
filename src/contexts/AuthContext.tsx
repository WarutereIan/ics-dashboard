import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User } from '@/types/dashboard';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: (preserveCurrentUrl?: boolean) => void;
  refreshToken: () => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

interface LoginResult {
  success: boolean;
  error?: string;
  user?: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'ics-auth-token';
const REFRESH_TOKEN_KEY = 'ics-refresh-token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  );
  const [isLoading, setIsLoading] = useState(true);
  
  // Use ref to access current token in event listeners without causing re-renders
  const tokenRef = useRef<string | null>(token);
  tokenRef.current = token;

  const isAuthenticated = !!user && !!token;

  // Debug logging for state changes
  console.log('AuthContext render - state:', { 
    hasUser: !!user, 
    hasToken: !!token, 
    isLoading, 
    isAuthenticated 
  });

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Listen for unauthorized events from legacy API client (no-op now)
  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthData();
      if (typeof window !== 'undefined') {
        const currentUrl = window.location.pathname + window.location.search;
        window.location.href = currentUrl !== '/login' ? `/login?next=${encodeURIComponent(currentUrl)}` : '/login';
      }
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (token) {
      const tokenPayload = parseJWT(token);
      if (tokenPayload) {
        const expiryTime = tokenPayload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeToExpiry = expiryTime - currentTime;
        
        // Refresh token 5 minutes before expiry
        const refreshTime = Math.max(timeToExpiry - 5 * 60 * 1000, 0);
        
        if (refreshTime > 0) {
          const refreshTimer = setTimeout(() => {
            refreshToken();
          }, refreshTime);
          
          return () => clearTimeout(refreshTimer);
        }
      }
    }
  }, [token]);

  const initializeAuth = async () => {
    console.log('AuthContext - initializeAuth with Supabase');
    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session || null;
      const accessToken = session?.access_token || null;
      if (accessToken) {
        // Persist token for compatibility with existing code paths
        localStorage.setItem(TOKEN_KEY, accessToken);
        setToken(accessToken);

        const authUser = session!.user;
        // Map to legacy User shape and stamp global-admin
        const mappedUser: User = {
          id: authUser.id,
          email: authUser.email || '',
          firstName: authUser.user_metadata?.firstName || 'Admin',
          lastName: authUser.user_metadata?.lastName || 'User',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          roles: [
            {
              id: 'global-admin',
              roleName: 'global-admin',
              level: 100,
              isActive: true,
            },
          ],
          projectAccess: [],
          permissions: ['*'],
        } as User;
        setUser(mappedUser);
      } else {
        clearAuthData();
      }
    } catch (e) {
      console.error('AuthContext - Supabase getSession failed:', e);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      const session = data.session;
      const accessToken = session?.access_token || null;
      if (!session || !accessToken) {
        return { success: false, error: 'No session returned' };
      }
      localStorage.setItem(TOKEN_KEY, accessToken);
      setToken(accessToken);

      const authUser = session.user;
      const mappedUser: User = {
        id: authUser.id,
        email: authUser.email || '',
        firstName: authUser.user_metadata?.firstName || 'Admin',
        lastName: authUser.user_metadata?.lastName || 'User',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        roles: [
          {
            id: 'global-admin',
            roleName: 'global-admin',
            level: 100,
            isActive: true,
          },
        ],
        projectAccess: [],
        permissions: ['*'],
      } as User;
      setUser(mappedUser);
      return { success: true, user: mappedUser };
    } catch (err: any) {
      console.error('Supabase login failed:', err);
      return { success: false, error: err?.message || 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (preserveCurrentUrl = false) => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase signOut failed:', e);
    } finally {
      clearAuthData();
      if (preserveCurrentUrl && typeof window !== 'undefined') {
        const currentUrl = window.location.pathname + window.location.search;
        if (currentUrl !== '/login') {
          window.location.href = `/login?next=${encodeURIComponent(currentUrl)}`;
          return;
        }
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    // Supabase JS refreshes tokens automatically; just re-read session
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token || null;
      if (accessToken) {
        localStorage.setItem(TOKEN_KEY, accessToken);
        setToken(accessToken);
        return true;
      }
      await logout();
      return false;
    } catch (e) {
      console.error('Supabase refresh check failed:', e);
      await logout();
      return false;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!user) {
      throw new Error('No authenticated user');
    }
    try {
      const metadata: Record<string, any> = {};
      if (updates.firstName !== undefined) metadata.firstName = updates.firstName;
      if (updates.lastName !== undefined) metadata.lastName = updates.lastName;
      if (Object.keys(metadata).length > 0) {
        await supabase.auth.updateUser({ data: metadata });
      }
      const merged: User = { ...user, ...updates, updatedAt: new Date().toISOString() } as User;
      setUser(merged);
      return merged;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const changePassword = async (_currentPassword: string, newPassword: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };

  const clearAuthData = () => {
    console.log('AuthContext - clearAuthData called');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const parseJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to parse JWT:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated,
      login,
      logout,
      refreshToken,
      updateProfile,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
