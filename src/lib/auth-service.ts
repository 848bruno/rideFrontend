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
    const storedToken = localStorage.getItem("rideflow_token");
    const storedUser = localStorage.getItem("rideflow_user");

    if (storedToken && storedUser) {
      this.token = storedToken;
      this.currentUser = JSON.parse(storedUser);
      this.updateApiToken(storedToken);
    }
  }

  private updateApiToken(token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  private normalizeUser(raw: any): User {
    return {
      id: raw.id,
      email: raw.email,
      role: raw.role,
      name: raw.name || raw.email?.split("@")[0] || "User",
      phone: raw.phone || "",
      createdAt: new Date(raw.createdAt || new Date()),
      updatedAt: new Date(raw.updatedAt || new Date()),
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>("/auth/signin", credentials);

      const token = response.data.accessToken || response.data.token;
      const userRaw = response.data.user || response.data.data?.user;

      if (!token || !userRaw) {
        console.error("Unexpected login response:", response.data);
        throw new Error("User data or token not found in response");
      }

      const user = this.normalizeUser(userRaw);
      this.setToken(token);
      this.setCurrentUser(user);

      return { user, token };
    } catch (error: any) {
      const fallback = this.handleError(error);
      if (fallback) return this.demoLogin(credentials);
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", data);

      const token = response.data.token || response.data.data?.token;
      const userRaw = response.data.user || response.data.data?.user;

      if (!token || !userRaw) {
        throw new Error("User or token not found in registration response");
      }

      const user = this.normalizeUser(userRaw);
      this.setToken(token);
      this.setCurrentUser(user);

      return { user, token };
    } catch (error: any) {
      const fallback = this.handleError(error);
      if (fallback) return this.demoRegister(data);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>("/auth/profile");

      if (response.data.success && response.data.data) {
        const user = this.normalizeUser(response.data.data);
        this.setCurrentUser(user);
        return user;
      }

      throw new Error("Failed to fetch profile");
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error("Failed to load profile");
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>("/auth/profile", userData);

      if (response.data.success && response.data.data) {
        const user = this.normalizeUser(response.data.data);
        this.setCurrentUser(user);
        return user;
      }

      throw new Error("Failed to update profile");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update profile");
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await api.post<ApiResponse<void>>("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to change password");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to change password");
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await api.post<ApiResponse<void>>("/auth/forgot-password", { email });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send reset email");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to send reset email");
    }
  }

  private handleError(error: any): boolean {
    console.error("AuthService error:", error);

    const isNetworkError =
      error.message?.includes("Network error") ||
      error.message?.includes("Failed to fetch") ||
      error.response?.status >= 500 ||
      !error.response;

    return isNetworkError;
  }

  private async demoLogin(credentials: LoginRequest): Promise<AuthResponse> {
    await new Promise((res) => setTimeout(res, 1000));

    const demoUser: User = {
      id: "demo-user",
      name: "Demo User",
      email: credentials.email,
      role: credentials.email.includes("admin")
        ? "admin"
        : credentials.email.includes("driver")
        ? "driver"
        : "customer",
      phone: "+123456789",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const demoToken = "demo-token-" + Date.now();
    this.setToken(demoToken);
    this.setCurrentUser(demoUser);

    return { user: demoUser, token: demoToken };
  }

  private async demoRegister(data: RegisterRequest): Promise<AuthResponse> {
    await new Promise((res) => setTimeout(res, 1000));

    const demoUser: User = {
      id: "demo-user-" + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const demoToken = "demo-token-" + Date.now();
    this.setToken(demoToken);
    this.setCurrentUser(demoUser);

    return { user: demoUser, token: demoToken };
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem("rideflow_token", token);
    this.updateApiToken(token);
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem("rideflow_user", JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
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
    return allowedRoles.includes(this.currentUser?.role ?? "");
  }

  getRedirectPath(role: string): string {
    const stored = sessionStorage.getItem("redirectAfterLogin");
    if (stored) {
      sessionStorage.removeItem("redirectAfterLogin");
      return stored;
    }

    switch (role) {
      case "admin":
        return "/dashboard/Admin";
      case "driver":
        return "/dashboard/Driver";

       
      case "customer":
        return "/dashboard/customer";
      default:
        return "/pages/index";
    }
  }
}

export const authService = new AuthService();
export type { User };
