import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { KeycloakTokenParsed } from "keycloak-js";
import { AuthContext } from "@/features/auth/auth-context";
import {
  mapTokenToUser,
  syncUserInApi,
  verifyApiToken,
} from "@/features/auth/auth-api";
import {
  initializeKeycloakSession,
  keycloakClient,
} from "@/features/auth/keycloak-client";
import { authConfig } from "@/lib/auth-config";
import type { ApiAvailabilityStatus, AuthUser } from "@/types/auth-types";

const emptyUser: AuthUser = {
  username: "",
  email: "",
  subject: "",
};

/**
 * Provides authentication state and actions to the entire React tree.
 *
 * @param children - Application subtree consuming authentication context.
 * @returns Context provider wrapping the provided React subtree.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isApiVerified, setIsApiVerified] = useState(false);
  const [apiAvailability, setApiAvailability] =
    useState<ApiAvailabilityStatus>("unknown");
  const [apiStatusMessage, setApiStatusMessage] = useState("");
  const [user, setUser] = useState<AuthUser>(emptyUser);

  /**
   * Validates API access with the current token and syncs user identity.
   *
   * This check is intentionally non-blocking for route access: UI auth is driven
   * by Keycloak session state, while API availability is surfaced as diagnostics.
   *
   * @returns True when API verification and sync succeed, otherwise false.
   */
  const revalidateApiSession = useCallback(async (): Promise<boolean> => {
    if (!keycloakClient.authenticated || !keycloakClient.token) {
      setIsApiVerified(false);
      setApiAvailability("unknown");
      setApiStatusMessage("");
      return false;
    }

    try {
      const apiVerified = await verifyApiToken(keycloakClient.token);
      setIsApiVerified(apiVerified);

      if (!apiVerified) {
        setApiAvailability("unavailable");
        setApiStatusMessage(
          "Le token Keycloak est valide côté UI, mais refusé par l'API.",
        );
        return false;
      }

      await syncUserInApi(
        keycloakClient.token,
        keycloakClient.tokenParsed as KeycloakTokenParsed,
      );

      setApiAvailability("available");
      setApiStatusMessage("");
      return true;
    } catch {
      setIsApiVerified(false);
      setApiAvailability("unavailable");
      setApiStatusMessage(
        "API indisponible ou erreur de synchronisation utilisateur.",
      );
      return false;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    /**
     * Initializes Keycloak session state and then tries backend verification.
     * Backend failures are non-blocking for UI auth state.
     */
    const initialize = async () => {
      try {
        const authenticated = await initializeKeycloakSession();

        if (!isMounted) {
          return;
        }

        setIsAuthenticated(authenticated);

        if (!authenticated || !keycloakClient.token) {
          setIsApiVerified(false);
          setApiAvailability("unknown");
          setApiStatusMessage("");
          setUser(emptyUser);
          return;
        }

        setUser(
          mapTokenToUser(keycloakClient.tokenParsed as KeycloakTokenParsed),
        );

        await revalidateApiSession();
      } catch {
        if (!isMounted) {
          return;
        }

        setIsAuthenticated(false);
        setIsApiVerified(false);
        setApiAvailability("unknown");
        setApiStatusMessage("");
        setUser(emptyUser);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    void initialize();

    return () => {
      isMounted = false;
    };
  }, [revalidateApiSession]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    /**
     * Refreshes token regularly to keep sessions alive in long-lived tabs.
     */
    const intervalId = window.setInterval(() => {
      void keycloakClient
        .updateToken(60)
        .then(() => {
          setUser(
            mapTokenToUser(keycloakClient.tokenParsed as KeycloakTokenParsed),
          );
        })
        .catch(() => {
          setIsAuthenticated(false);
          setIsApiVerified(false);
          setApiAvailability("unknown");
          setApiStatusMessage("");
          setUser(emptyUser);
        });
    }, 30_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  /**
   * Starts interactive login via Keycloak hosted UI.
   *
   * @returns Resolves when Keycloak handles the redirect flow.
   */
  const login = useCallback(async () => {
    await keycloakClient.login({
      redirectUri: window.location.href,
    });
  }, []);

  /**
   * Starts registration flow via Keycloak hosted UI.
   *
   * @returns Resolves when Keycloak handles the redirect flow.
   */
  const register = useCallback(async () => {
    await keycloakClient.register({
      redirectUri: window.location.href,
    });
  }, []);

  /**
   * Ends SSO session and redirects user back to sign-in route.
   *
   * @returns Resolves when logout redirect is delegated to Keycloak.
   */
  const logout = useCallback(async () => {
    await keycloakClient.logout({
      redirectUri:
        authConfig.keycloakLogoutRedirectUri ?? window.location.origin,
    });
  }, []);

  /**
   * Returns a fresh access token for authenticated API calls.
   *
   * @returns Fresh access token when authenticated, otherwise undefined.
   */
  const getToken = useCallback(async () => {
    if (!keycloakClient.authenticated) {
      return undefined;
    }

    await keycloakClient.updateToken(30);
    return keycloakClient.token;
  }, []);

  const contextValue = useMemo(
    () => ({
      isReady,
      isAuthenticated,
      isApiVerified,
      apiAvailability,
      apiStatusMessage,
      user,
      login,
      register,
      logout,
      getToken,
      revalidateApiSession,
    }),
    [
      apiAvailability,
      apiStatusMessage,
      getToken,
      isApiVerified,
      isAuthenticated,
      isReady,
      login,
      logout,
      revalidateApiSession,
      register,
      user,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
