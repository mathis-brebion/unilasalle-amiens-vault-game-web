import type { KeycloakTokenParsed } from "keycloak-js";
import { authConfig } from "@/lib/auth-config";

/**
 * Safely reads a string claim from Keycloak decoded token payload.
 *
 * @param tokenParsed - Decoded Keycloak access token payload.
 * @param key - Claim name to extract from the token payload.
 * @returns Claim value when present and a string, otherwise an empty string.
 */
const getClaim = (
  tokenParsed: KeycloakTokenParsed | undefined,
  key: string,
) => {
  const value = tokenParsed?.[key as keyof KeycloakTokenParsed];
  return typeof value === "string" ? value : "";
};

/**
 * Maps a raw Keycloak token to the app-level user model.
 *
 * @param tokenParsed - Decoded Keycloak access token payload.
 * @returns Minimal user model consumed by UI and auth state.
 */
export const mapTokenToUser = (
  tokenParsed: KeycloakTokenParsed | undefined,
) => ({
  username: getClaim(tokenParsed, "preferred_username"),
  email: getClaim(tokenParsed, "email"),
  subject: getClaim(tokenParsed, "sub"),
});

/**
 * Verifies that the bearer token is accepted by the backend security layer.
 *
 * @param token - Access token provided by Keycloak.
 * @returns True when backend accepts the token, otherwise false.
 */
export const verifyApiToken = async (token: string): Promise<boolean> => {
  const response = await fetch(`${authConfig.apiBaseUrl}/api/auth/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.ok;
};

/**
 * Synchronizes authenticated identity into the API user store.
 *
 * Behavior is idempotent: HTTP 409 is treated as a non-failure when user exists.
 *
 * @param token - Access token provided by Keycloak.
 * @param tokenParsed - Decoded Keycloak access token payload.
 * @returns Resolves when sync is completed or skipped.
 * @throws Error when API user synchronization fails with unexpected status.
 */
export const syncUserInApi = async (
  token: string,
  tokenParsed: KeycloakTokenParsed | undefined,
) => {
  const user = mapTokenToUser(tokenParsed);

  if (!user.subject || !user.username || !user.email) {
    return;
  }

  const response = await fetch(`${authConfig.apiBaseUrl}/api/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keycloakSubject: user.subject,
      username: user.username,
      email: user.email,
    }),
  });

  if (response.ok || response.status === 409) {
    return;
  }

  throw new Error("Unable to synchronize authenticated user in API.");
};
