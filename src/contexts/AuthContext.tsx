import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User } from '@/types/dashboard';
import { authAPI } from '@/lib/api/auth';

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

  // Inactivity timer ref - stores the timeout ID
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Logout ref - will be set after logout function is defined
  const logoutRef = useRef<((preserveCurrentUrl?: boolean) => void) | null>(null);

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

  // Listen for unauthorized events from API client
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('AuthContext - unauthorized event received');
      // When user is unauthorized (e.g., token expired), preserve current URL for redirect
      clearAuthData();
      
      // Optional: Call logout endpoint to invalidate token on server
      if (tokenRef.current) {
        authAPI.logout(tokenRef.current).catch(console.error);
      }
      
      // Preserve current URL for redirect after login
      if (typeof window !== 'undefined') {
        const currentUrl = window.location.pathname + window.location.search;
        if (currentUrl !== '/login') {
          console.log('AuthContext - redirecting to login with next:', currentUrl);
          window.location.href = `/login?next=${encodeURIComponent(currentUrl)}`;
        } else {
          console.log('AuthContext - redirecting to login without next');
          window.location.href = '/login';
        }
      }
    };

    console.log('AuthContext - setting up unauthorized event listener');
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      console.log('AuthContext - cleaning up unauthorized event listener');
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []); // Remove token dependency to prevent re-renders

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

  // Inactivity detection - auto logout after 1 hour of inactivity
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear any existing timer if user is not authenticated
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }

    // Inactivity timeout: 1 hour (3600000 milliseconds)
    const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour

    // Function to reset the inactivity timer
    const resetInactivityTimer = () => {
      // Clear existing timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // Set new timer
      inactivityTimerRef.current = setTimeout(() => {
        console.log('AuthContext - Inactivity timeout reached, logging out user');
        if (logoutRef.current) {
          logoutRef.current(true); // Preserve current URL for redirect
        }
      }, INACTIVITY_TIMEOUT);
    };

    // Initial timer setup
    resetInactivityTimer();

    // Events that indicate user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown'
    ];

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    // Cleanup function
    return () => {
      // Clear timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }

      // Remove event listeners
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [isAuthenticated]); // Only run when authentication state changes

  const initializeAuth = async () => {
    console.log('AuthContext - initializeAuth called');
    const storedToken = localStorage.getItem(TOKEN_KEY);
    console.log('AuthContext - storedToken found:', !!storedToken);
    
    if (storedToken) {
      try {
        console.log('AuthContext - verifying token with backend');
        // Verify token with backend and get user profile
        const userProfile = await authAPI.getProfile(storedToken);
        console.log('AuthContext - token verified, setting user and token');
        setUser(userProfile);
        setToken(storedToken);
      } catch (error) {
        console.error('AuthContext - Token verification failed:', error);
        clearAuthData();
      }
    }
    
    console.log('AuthContext - setting loading to false');
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

  const logout = (preserveCurrentUrl = false) => {
    // Clear inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    clearAuthData();
    
    // Optional: Call logout endpoint to invalidate token on server
    if (token) {
      authAPI.logout(token).catch(console.error);
    }
    
    // If we want to preserve the current URL for redirect after login
    if (preserveCurrentUrl && typeof window !== 'undefined') {
      const currentUrl = window.location.pathname + window.location.search;
      if (currentUrl !== '/login') {
        window.location.href = `/login?next=${encodeURIComponent(currentUrl)}`;
        return;
      }
    }
    
    // Default behavior: redirect to login without next parameter
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  // Update logout ref after logout function is defined
  logoutRef.current = logout;

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
