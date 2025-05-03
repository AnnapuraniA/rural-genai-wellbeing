
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, getUserByCredentials, saveAuthToLocalStorage, getAuthFromLocalStorage, clearAuthFromLocalStorage } from '@/lib/database';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in
    const user = getAuthFromLocalStorage();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const user = getUserByCredentials(username, password);
      
      if (user) {
        setCurrentUser(user);
        saveAuthToLocalStorage(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    clearAuthFromLocalStorage();
  };

  const value = {
    currentUser,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
