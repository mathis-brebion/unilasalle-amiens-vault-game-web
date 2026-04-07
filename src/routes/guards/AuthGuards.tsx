import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

/**
 * Guards private routes and redirects unauthenticated users to sign-in.
 *
 * @returns Protected route outlet or redirect to sign-in.
 */
export function ProtectedRoute() {
  const { isReady, isAuthenticated } = useAuth();

  if (!isReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}

/**
 * Prevents authenticated users from accessing sign-in/sign-up routes.
 *
 * @returns Public route outlet or redirect to dashboard.
 */
export function PublicOnlyRoute() {
  const { isReady, isAuthenticated } = useAuth();

  if (!isReady) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
