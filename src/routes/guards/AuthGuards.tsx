import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

/**
 * Guards private routes and redirects unauthenticated users to Keycloak.
 *
 * @returns Protected route outlet when authenticated.
 */
export function ProtectedRoute() {
  const { isReady, isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      void login();
    }
  }, [isAuthenticated, isReady, login]);

  if (!isReady || !isAuthenticated) {
    return null;
  }

  return <Outlet />;
}
