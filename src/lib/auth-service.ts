import { api } from "./api";
import type { User, ApiResponse } from "./types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "customer" | "driver" | "admin";
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    // Load from localStorage on initialization
    const storedToken = localStorage.getItem("rideflow_token");
    const storedUser = localStorage.getItem("rideflow_user");

    if (storedToken && storedUser) {
      this.token = storedToken;
      this.currentUser = JSON.parse(storedUser);
      this.updateApiToken(storedToken);
    }
  }

  private updateApiToken(token: string) {
    // Update API instance with token
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  private extractUserFromToken(token: string): User {
    try {
      // Decode JWT payload (without verification - just for extraction)
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Extracted JWT payload:", payload);

      return {
        id: payload.sub || payload.id,
        email: payload.email,
        role: payload.role,
        name: payload.name || payload.email?.split("@")[0] || "User",
        phone: payload.phone || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Failed to extract user from token:", error);
      // Return minimal user as fallback
      return {
        id: "unknown",
        email: "unknown@example.com",
        role: "customer",
        name: "User",
        phone: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/signin",
        credentials,
      );

      // Handle your backend response format: { accessToken, refreshToken, user }
      let user, token;

      if (response.data.accessToken && response.data.user) {
        // Your current backend format: { accessToken, refreshToken, user: { id, email, role } }
        token = response.data.accessToken;
        user = response.data.user;

        // Ensure user has all required fields
        if (!user.name && user.email) {
          user.name = user.email.split("@")[0]; // Use email prefix as name if not provided
        }
        if (!user.phone) {
          user.phone = ""; // Default empty phone
        }
        if (!user.created_at) {
          user.created_at = new Date().toISOString();
        }
        if (!user.updated_at) {
          user.updated_at = new Date().toISOString();
        }

        console.log("Successfully parsed user data:", user);
      } else if (response.data.success && response.data.data) {
        // Fallback format: { success: true, data: { user, token } }
        ({ user, token } = response.data.data);
      } else if (response.data.user && response.data.token) {
        // Fallback format: { user, token }
        ({ user, token } = response.data);
      } else {
        // Log the actual response for debugging
        console.log("Unexpected response format:", response.data);
        throw new Error("Invalid response format from server");
      }

      if (!user || !token) {
        console.log("Missing user or token in response:", {
          user: !!user,
          token: !!token,
          responseKeys: Object.keys(response.data || {}),
        });
        throw new Error("User data not found in response");
      }

      this.setToken(token);
      this.setCurrentUser(user);
      return { user, token };
    } catch (error: any) {
      // Log error details for debugging (but not [object Object])
      if (import.meta.env.DEV) {
        console.error("Login error details:", {
          message: error?.message || "Unknown error",
          status: error?.response?.status || "No status",
          errorType: error?.name || typeof error,
        });
      }

      // If it's any kind of API/network error, fall back to demo mode immediately
      if (
        error.message?.includes("Network error") ||
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("Failed to parse") ||
        error.message?.includes("Failed to read") ||
        error.message?.includes("body stream") ||
        error.response?.status >= 500 ||
        !error.response // No response means network issue
      ) {
        console.warn("API unavailable or error, using demo mode");
        return this.demoLogin(credentials);
      }

      // Extract meaningful error message for real API errors (4xx)
      let errorMessage = "Login failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message && !error.message.includes("Failed to")) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  // Demo mode for when API is unavailable
  private async demoLogin(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create demo user based on email
    const demoUser: User = {
      id: "demo-user-123",
      name: "Demo User",
      email: credentials.email,
      role: credentials.email.includes("admin")
        ? "admin"
        : credentials.email.includes("driver")
          ? "driver"
          : "customer",
      phone: "+1234567890",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const demoToken = "demo-token-" + Date.now();

    this.setToken(demoToken);
    this.setCurrentUser(demoUser);

    return { user: demoUser, token: demoToken };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/register",
        userData,
      );

      if (response.data.success) {
        const { user, token } = response.data.data;
        this.setToken(token);
        this.setCurrentUser(user);
        return { user, token };
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // If it's a network error, provide demo mode
      if (
        error.message?.includes("Network error") ||
        error.message?.includes("Failed to fetch")
      ) {
        console.warn("API unavailable, using demo mode");
        return this.demoRegister(userData);
      }

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "Network error. Please try again.");
    }
  }

  // Demo mode for registration when API is unavailable
  private async demoRegister(userData: RegisterRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const demoUser: User = {
      id: "demo-user-" + Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const demoToken = "demo-token-" + Date.now();

    this.setToken(demoToken);
    this.setCurrentUser(demoUser);

    return { user: demoUser, token: demoToken };
  }

  async getProfile(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>("/auth/profile");

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to get profile");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error("Session expired. Please sign in again.");
      }
      throw new Error("Failed to load profile");
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>(
        "/auth/profile",
        userData,
      );

      if (response.data.success) {
        const updatedUser = response.data.data;
        this.setCurrentUser(updatedUser);
        return updatedUser;
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update profile");
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const response = await api.post<ApiResponse<void>>(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to change password");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to change password");
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await api.post<ApiResponse<void>>(
        "/auth/forgot-password",
        {
          email,
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send reset email");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to send reset email");
    }
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem("rideflow_token", token);
    this.updateApiToken(token);
  }

  getRedirectPath(userRole: string): string {
    // Check if there's a stored redirect path
    const storedPath = sessionStorage.getItem("redirectAfterLogin");
    if (storedPath) {
      sessionStorage.removeItem("redirectAfterLogin");
      return storedPath;
    }

    // Default redirect based on role
    switch (userRole) {
      case "driver":
        return "/driver-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/app";
    }
  }

  getToken(): string | null {
    return this.token;
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem("rideflow_user", JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!(this.token && this.currentUser);
  }

  logout(): void {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem("rideflow_token");
    localStorage.removeItem("rideflow_user");
    delete api.defaults.headers.common["Authorization"];
  }

  clearCurrentUser(): void {
    this.currentUser = null;
    localStorage.removeItem("rideflow_user");
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  canAccess(allowedRoles: string[]): boolean {
    return !!(
      this.currentUser?.role && allowedRoles.includes(this.currentUser.role)
    );
  }
}

export const authService = new AuthService();

// Re-export User type for backward compatibility
export type { User };
