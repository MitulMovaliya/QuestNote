import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "@/types";
import axiosInstance from "./axiosConfig";

export const authLogin = async (
  data: LoginCredentials
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const authRegister = async (
  data: RegisterCredentials
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/register",
    data
  );
  return response.data;
};

export const authMe = async (): Promise<AuthResponse> => {
  const response = await axiosInstance.get<AuthResponse>("/auth/me", {
    params: {
      _t: new Date().getTime(),
    },
  });
  return response.data;
};

export const authLogout = async (): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>(
    "/auth/logout"
  );
  return response.data;
};

export const authEmailVerification = async (
  token: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.get<{ message: string }>(
    `/auth/verify-email?token=${token}`
  );
  return response.data;
};

export const authResendVerificationEmail = async (
  email: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>(
    "/auth/resend-verification",
    { email }
  );
  return response.data;
};

export const authForgotPassword = async (
  email: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>(
    "/auth/forgot-password",
    { email }
  );
  return response.data;
};

export const authResetPassword = async (
  token: string,
  newPassword: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>(
    "/auth/reset-password",
    { token, newPassword }
  );
  return response.data;
};

export const authGoogleLogin = async () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  return null;
};
