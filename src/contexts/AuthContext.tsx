
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, User, UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists and validate it
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data: AuthResponse = await response.json();

      // Store token and user details in localStorage
      localStorage.setItem('token', data.jwtToken);
      
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9), // Placeholder ID
        userName: data.userDetails.userName,
        userRole: data.userDetails.userRole,
        organizationId: '', // This would come from API in a real app
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(data.jwtToken);
      setUser(userData);
      
      // Navigate based on role
      if (data.userDetails.userRole === '1') {
        navigate('/admin/organizations');
      } else if (data.userDetails.userRole === '2') {
        navigate('/admin/users');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.userRole) : false;
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
