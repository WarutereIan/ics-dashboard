import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/dashboard';
import { authAPI } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
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

  const isAuthenticated = !!user && !!token;

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Listen for unauthorized events from API client
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
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
    const storedToken = localStorage.getItem(TOKEN_KEY);
    
    if (storedToken) {
      try {
        // Verify token with backend and get user profile
        const userProfile = await authAPI.getProfile(storedToken);
        setUser(userProfile);
        setToken(storedToken);
      } catch (error) {
        console.error('Token verification failed:', error);
        clearAuthData();
      }
    }
    
    setIsLoading(false);
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        const { access_token, refresh_token } = response.data;
        
        // Store tokens
        localStorage.setItem(TOKEN_KEY, access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
        
        setToken(access_token);
        // Immediately fetch full profile (includes roles + permissions) so UI reflects access
        const profile = await authAPI.getProfile(access_token);
        setUser(profile);
        
        return { success: true, user: profile };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    // Optional: Call logout endpoint to invalidate token on server
    if (token) {
      authAPI.logout(token).catch(console.error);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!storedRefreshToken) {
      logout();
      return false;
    }
    
    try {
      const response = await authAPI.refreshToken(storedRefreshToken);
      
      if (response.success && response.data) {
        const { access_token, refresh_token } = response.data;
        
        localStorage.setItem(TOKEN_KEY, access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
        
        setToken(access_token);
        
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    try {
      const updatedUser = await authAPI.updateProfile(updates, token);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    try {
      await authAPI.changePassword(currentPassword, newPassword, token);
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };

  const clearAuthData = () => {
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
