import {
  authEmailVerification,
  authForgotPassword,
  authLogin,
  authLogout,
  authMe,
  authRegister,
  authResendVerificationEmail,
  authResetPassword,
} from "@/api/auth.api";
import type { LoginCredentials, RegisterCredentials, User } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  register: (
    credentials: RegisterCredentials
  ) => Promise<{ success: boolean; email?: string }>;
  emailVerification: (token: string) => Promise<{ success: boolean }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; email?: string }>;
  resetPassword: (
    token: string,
    newPassword: string
  ) => Promise<{ success: boolean }>;
  resendVerificationEmail: (
    email: string
  ) => Promise<{ success: boolean; email?: string }>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  login: async (credentials) => {
    try {
      set({ isLoading: true });
      const response = await authLogin(credentials);
      set({ isAuthenticated: true, user: response.user });
      toast.success(response.message);
      return { success: true };
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      set({ isLoading: true });
      await authLogout();
      set({ isAuthenticated: false, user: null });
      toast.success("Logged out successfully.");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Logout failed.");
    } finally {
      set({ isLoading: false });
    }
  },
  fetchCurrentUser: async () => {
    try {
      set({ isLoading: true });
      const data = await authMe();
      set({ isAuthenticated: true, user: data.user });
    } catch (error: any) {
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
  register: async (credentials) => {
    try {
      set({ isLoading: true });
      const response = await authRegister(credentials);
      toast.success(
        response.message || "Registration successful! Please verify your email."
      );
      return { success: true, email: credentials.email };
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed.");
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },
  emailVerification: async (token) => {
    try {
      set({ isLoading: true });
      const response = await authEmailVerification(token);
      toast.success(response.message || "Email verified successfully!");
      return { success: true };
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Email verification failed.");
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },
  forgotPassword: async (email) => {
    try {
      set({ isLoading: true });
      const response = await authForgotPassword(email);
      toast.success(
        response.message || "Password reset link sent to your email."
      );
      return { success: true, email };
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Request failed.");
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },
  resetPassword: async (token, newPassword) => {
    try {
      set({ isLoading: true });
      const response = await authResetPassword(token, newPassword);
      toast.success(response.message || "Password reset successfully!");
      return { success: true };
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Password reset failed.");
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },
  resendVerificationEmail: async (email) => {
    try {
      set({ isLoading: true });
      const response = await authResendVerificationEmail(email);
      toast.success(
        response.message || "Verification email resent successfully!"
      );
      return { success: true, email };
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Resend verification email failed."
      );
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
