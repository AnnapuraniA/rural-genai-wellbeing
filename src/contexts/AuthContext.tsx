import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, getUserByCredentials, saveAuthToLocalStorage, getAuthFromLocalStorage, clearAuthFromLocalStorage } from '@/lib/database';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const user = getAuthFromLocalStorage();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const user = getUserByCredentials(username, password);
    if (user) {
      setCurrentUser(user);
      saveAuthToLocalStorage(user);
      return true;
    }
    return false;
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
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
