import { PATHS } from "@/config/paths";
import useAuthStore from "@/stores/auth.store";
import type React from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, fetchCurrentUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    const from = (location.state as any)?.from || PATHS.DASHBOARD;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
