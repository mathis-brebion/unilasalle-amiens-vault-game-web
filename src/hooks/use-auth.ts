import { useContext } from "react";
import { AuthContext } from "@/features/auth/auth-context";

/**
 * Returns the authentication context value for the current React tree.
 *
 * @returns Authentication state and actions exposed by AuthProvider.
 * @throws Error when called outside an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
