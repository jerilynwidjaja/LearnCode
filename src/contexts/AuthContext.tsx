import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AuthService } from '../services/authService';

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: 'mentor' | 'mentee' | 'both' | 'none';  // ← ADD THIS
  hasPreferences?: boolean;
  careerStage?: string;
  skills?: string[];
  learningGoals?: string[];
  timeAvailability?: string;
  level?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role: 'mentor' | 'mentee') => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = AuthService.getStoredToken();
    if (token) {
      AuthService.setAuthToken(token);
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await AuthService.getUserProfile();
      console.log('🔍 User profile fetched:', userData); // ← Add this log
      
      // Ensure hasPreferences is properly set based on user data
      const hasPreferences = !!(userData.careerStage && userData.level && 
        userData.skills?.length > 0 && userData.learningGoals?.length > 0);
      
      setUser({
        ...userData,  // ← This should include role from backend
        hasPreferences
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      AuthService.removeAuthToken();
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password });
      const { token, user: userData } = response;
      
      AuthService.setAuthToken(token);
      
      // Properly check for preferences
      const hasPreferences = !!(userData.careerStage && userData.level && 
        userData.skills?.length > 0 && userData.learningGoals?.length > 0);
      
      setUser({
        ...userData,  // ← This should already include role from backend
        hasPreferences
      });
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: 'mentor' | 'mentee') => {
    try {
      const response = await AuthService.register({ email, password, firstName, lastName, role });
      const { token, user: userData } = response;
      
      AuthService.setAuthToken(token);
      setUser({
        ...userData,
        role, // Include the role in user state
        hasPreferences: false // New users don't have preferences
      });
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    AuthService.removeAuthToken();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      
      const updatedUser = { ...prev, ...userData };
      
      // Recalculate hasPreferences when user data is updated
      if (userData.careerStage || userData.level || userData.skills || userData.learningGoals) {
        updatedUser.hasPreferences = !!(
          updatedUser.careerStage && 
          updatedUser.level && 
          (updatedUser.skills?.length ?? 0) > 0 && 
          (updatedUser.learningGoals?.length ?? 0) > 0
        );
      }
      
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser,
      refreshUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};