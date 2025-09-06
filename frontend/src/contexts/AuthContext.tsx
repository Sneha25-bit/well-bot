import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  height?: string;
  weight?: string;
  bloodType?: string;
  allergies: string[];
  medications: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    periodTracker: boolean;
    medicineReminders: boolean;
    healthInsights: boolean;
    notifications: boolean;
  };
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const response = await apiService.getCurrentUser();
          if (response.success && response.user) {
            setUser(response.user);
          } else {
            apiService.clearToken();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          apiService.clearToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      if (response.success && (response.user || response.data?.user)) {
        const user = response.user || response.data?.user;
        setUser(user as User);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
  }) => {
    try {
      const response = await apiService.register(userData);
      if (response.success && (response.user || response.data?.user)) {
        const user = response.user || response.data?.user;
        setUser(user as User);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await apiService.updateProfile(userData);
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiService.updatePassword({
        currentPassword,
        newPassword,
      });
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Password update failed');
      }
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await apiService.forgotPassword(email);
      if (!response.success) {
        throw new Error(response.message || 'Password reset request failed');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await apiService.resetPassword(token, password);
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await apiService.verifyEmail(token);
      if (!response.success) {
        throw new Error(response.message || 'Email verification failed');
      }
      // Refresh user data after verification
      const userResponse = await apiService.getCurrentUser();
      if (userResponse.success && userResponse.user) {
        setUser(userResponse.user);
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
