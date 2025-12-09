import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PATHS } from "./config/paths";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckEmail from "./pages/CheckEmail";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResendVerification from "./pages/ResendVerification";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./components/PublicRoute";
import useAuthStore from "./stores/auth.store";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Tags from "./pages/Tags";
import Archived from "./pages/Archived";

function App() {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "oklch(0.15 0.01 264.376)",
            color: "oklch(0.985 0.003 264.376)",
            border: "1px solid oklch(0.25 0.02 264.376)",
            borderRadius: "0.5rem",
            fontSize: "14px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
          },
          success: {
            iconTheme: {
              primary: "oklch(0.6 0.22 264.376)",
              secondary: "oklch(0.985 0.003 264.376)",
            },
            style: {
              border: "1px solid oklch(0.6 0.22 264.376)",
            },
          },
          error: {
            iconTheme: {
              primary: "oklch(0.6 0.24 25)",
              secondary: "oklch(0.985 0.003 264.376)",
            },
            style: {
              border: "1px solid oklch(0.6 0.24 25)",
            },
          },
          loading: {
            iconTheme: {
              primary: "oklch(0.6 0.22 264.376)",
              secondary: "oklch(0.985 0.003 264.376)",
            },
          },
        }}
      />
      <Routes>
        <Route
          path={PATHS.LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={PATHS.REGISTER}
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path={PATHS.CHECK_EMAIL} element={<CheckEmail />} />
        <Route path={PATHS.VERIFY_EMAIL} element={<VerifyEmail />} />
        <Route
          path={PATHS.FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />
        <Route
          path={PATHS.RESEND_VERIFICATION}
          element={
            <PublicRoute>
              <ResendVerification />
            </PublicRoute>
          }
        />
        <Route
          path={PATHS.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.NOTES}
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.ARCHIVED}
          element={
            <ProtectedRoute>
              <Archived />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATHS.TAGS}
          element={
            <ProtectedRoute>
              <Tags />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
