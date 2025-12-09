import { PATHS } from "@/config/paths";
import useAuthStore from "@/stores/auth.store";
import type React from "react";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
