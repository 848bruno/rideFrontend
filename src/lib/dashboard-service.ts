import { api } from "./api";
import type {
  User,
  Driver,
  Vehicle,
  Ride,
  Booking,
  Delivery,
  Payment,
  Review,
  Notification,
  ApiResponse,
  PaginatedResponse,
} from "./types";

export interface DashboardStats {
  totalUsers: number;
  activeDrivers: number;
  totalVehicles: number;
  monthlyRevenue: number;
  totalRides: number;
  totalBookings: number;
  completionRate: number;
  averageRating: number;
  supportTickets: number;
}

export interface DriverDashboardStats {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalRides: number;
  rating: number;
  completionRate: number;
  hoursOnline: number;
  activeRides: number;
}

class DashboardService {
  // Admin Dashboard Data
  async getAdminStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<ApiResponse<DashboardStats>>(
        "/dashboard/admin/stats",
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get admin stats");
    } catch (error: any) {
      console.error("Error fetching admin stats:", error);
      // Return demo data if API fails
      return this.getDemoAdminStats();
    }
  }

  private getDemoAdminStats(): DashboardStats {
    return {
      totalUsers: 15420,
      activeDrivers: 892,
      totalVehicles: 1247,
      monthlyRevenue: 284750,
      totalRides: 12389,
      totalBookings: 13567,
      completionRate: 97.5,
      averageRating: 4.7,
      supportTickets: 23,
    };
  }

  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
  }): Promise<PaginatedResponse<User>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<User>>>(
        "/admin/users",
        { params },
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get users");
    } catch (error: any) {
      console.error("Error fetching users:", error);
      return this.getDemoUsers();
    }
  }

  async getAllDrivers(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Driver>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Driver>>>(
        "/admin/drivers",
        { params },
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get drivers");
    } catch (error: any) {
      console.error("Error fetching drivers:", error);
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  }

  async getAllVehicles(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Vehicle>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Vehicle>>>(
        "/admin/vehicles",
        { params },
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get vehicles");
    } catch (error: any) {
      console.error("Error fetching vehicles:", error);
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  }

  async getAllRides(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Ride>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Ride>>>(
        "/admin/rides",
        { params },
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get rides");
    } catch (error: any) {
      console.error("Error fetching rides:", error);
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  }

  async getAllBookings(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Booking>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
        "/admin/bookings",
        { params },
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get bookings");
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  }

  // Driver Dashboard Data
  async getDriverStats(driverId?: string): Promise<DriverDashboardStats> {
    try {
      const endpoint = driverId
        ? `/admin/drivers/${driverId}/stats`
        : "/drivers/dashboard/stats";
      const response =
        await api.get<ApiResponse<DriverDashboardStats>>(endpoint);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get driver stats");
    } catch (error: any) {
      console.error("Error fetching driver stats:", error);
      return this.getDemoDriverStats();
    }
  }

  private getDemoDriverStats(): DriverDashboardStats {
    return {
      todayEarnings: 245.8,
      weeklyEarnings: 892.5,
      monthlyEarnings: 3245.75,
      totalRides: 156,
      rating: 4.85,
      completionRate: 98.2,
      hoursOnline: 8.5,
      activeRides: 1,
    };
  }

  async getDriverRides(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Ride>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Ride>>>(
        "/drivers/rides",
        { params },
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get driver rides");
    } catch (error: any) {
      console.error("Error fetching driver rides:", error);
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  }

  async getDriverVehicle(): Promise<Vehicle | null> {
    try {
      const response = await api.get<ApiResponse<Vehicle>>("/drivers/vehicle");
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      console.error("Error fetching driver vehicle:", error);
      return null;
    }
  }

  // Customer Dashboard Data
  async getCustomerBookings(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Booking>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
        "/bookings/my-bookings",
        { params },
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get bookings");
    } catch (error: any) {
      console.error("Error fetching customer bookings:", error);
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  }

  async getCustomerPayments(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Payment>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Payment>>>(
        "/payments/my-payments",
        { params },
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get payments");
    } catch (error: any) {
      console.error("Error fetching customer payments:", error);
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  }

  // Shared Services
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
  }): Promise<PaginatedResponse<Notification>> {
    try {
      const response = await api.get<
        ApiResponse<PaginatedResponse<Notification>>
      >("/notifications", { params });
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get notifications");
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const response = await api.patch<ApiResponse<void>>(
        `/notifications/${notificationId}/read`,
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to mark as read");
      }
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async getReviews(params?: {
    page?: number;
    limit?: number;
    driverId?: string;
  }): Promise<PaginatedResponse<Review>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(
        "/reviews",
        { params },
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get reviews");
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  }

  // Real-time updates
  async getRecentActivity(): Promise<{
    recentRides: Ride[];
    recentBookings: Booking[];
    recentPayments: Payment[];
  }> {
    try {
      const [ridesResponse, bookingsResponse, paymentsResponse] =
        await Promise.all([
          api.get<ApiResponse<PaginatedResponse<Ride>>>("/rides", {
            params: { limit: 5, page: 1 },
          }),
          api.get<ApiResponse<PaginatedResponse<Booking>>>("/bookings", {
            params: { limit: 5, page: 1 },
          }),
          api.get<ApiResponse<PaginatedResponse<Payment>>>("/payments", {
            params: { limit: 5, page: 1 },
          }),
        ]);

      return {
        recentRides: ridesResponse.data.success
          ? ridesResponse.data.data.data
          : [],
        recentBookings: bookingsResponse.data.success
          ? bookingsResponse.data.data.data
          : [],
        recentPayments: paymentsResponse.data.success
          ? paymentsResponse.data.data.data
          : [],
      };
    } catch (error: any) {
      console.error("Error fetching recent activity:", error);
      return {
        recentRides: [],
        recentBookings: [],
        recentPayments: [],
      };
    }
  }

  // Demo data methods
  private getDemoUsers(): PaginatedResponse<User> {
    const demoUsers: User[] = [
      {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        role: "customer",
        phone: "+1234567890",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "user-2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "driver",
        phone: "+1234567891",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return {
      data: demoUsers,
      total: demoUsers.length,
      page: 1,
      limit: 10,
      totalPages: 1,
    };
  }
}

export const dashboardService = new DashboardService();
