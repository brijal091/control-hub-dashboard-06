
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, User, UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
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
        console.log('Token found in localStorage during initialization');
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        console.log('No token found in localStorage during initialization');
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Use environment variable for API URL
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/arduino';
      console.log(`Making login request to ${apiBaseUrl}/auth/login`);
      
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Login failed with status ${response.status}:`, errorText);
        throw new Error('Login failed: ' + (errorText || `Status code ${response.status}`));
      }

      const data: AuthResponse = await response.json();
      console.log('Login successful, received token');

      // Store token and user details in localStorage
      localStorage.setItem('token', data.jwtToken);
      console.log('Token saved to localStorage');
      
      // Get the organization ID that the user belongs to
      // In a real app, this would come from the API response
      const organizationId = '1'; // This should come from the API
      
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9), // Placeholder ID
        userName: data.userDetails.userName,
        userRole: data.userDetails.userRole,
        organizationId: organizationId,
        email: email, // Add email to the saved user data
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
    console.log('Logging out, clearing token and user data');
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
