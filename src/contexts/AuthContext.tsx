import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, type User } from "@/lib/auth-service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Optionally refresh user data from server
          try {
            const freshUser = await authService.getProfile();
            setUser(freshUser);
            authService.setCurrentUser(freshUser);
          } catch (error) {
            // If token is invalid, clear it
            authService.logout();
            authService.clearCurrentUser();
          }
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      console.log("Login successful, setting user:", response.user);
      setUser(response.user);
      authService.setCurrentUser(response.user);
      return response;
    } catch (error: any) {
      console.error("Login failed in auth context:", error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    const response = await authService.register(userData);
    setUser(response.user);
    authService.setCurrentUser(response.user);
  };

  const logout = () => {
    authService.logout();
    authService.clearCurrentUser();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authService.getProfile();
      setUser(freshUser);
      authService.setCurrentUser(freshUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
      logout();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
