import React, { createContext, useContext, useState, useEffect } from 'react';
import { restaurantAdminsAPI } from '@/services/api';

export interface User {
  _id: string;
  username: string;
  role: 'super_admin' | 'restaurant_admin';
  restaurantId?: string;
  restaurantName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // No localStorage usage - user must login each time
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Super Admin login
      if (username === 'admin' && password === '123') {
        const superAdmin: User = {
          _id: 'super_admin',
          username: 'admin',
          role: 'super_admin'
        };
        setUser(superAdmin);
        return true;
      }

      // Restaurant Admin login
      const restaurantAdmins = await restaurantAdminsAPI.getAll();
      const admin = restaurantAdmins.find((a: any) => a.username === username && a.password === password);
      
      if (admin) {
        const restaurantAdmin: User = {
          _id: admin._id,
          username: admin.username,
          role: 'restaurant_admin',
          restaurantId: admin.restaurantId,
          restaurantName: admin.restaurantName
        };
        setUser(restaurantAdmin);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};