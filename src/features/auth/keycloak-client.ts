import Keycloak, { type KeycloakInitOptions } from "keycloak-js";
import { authConfig } from "@/lib/auth-config";

export const keycloakClient = new Keycloak({
  url: authConfig.keycloakUrl,
  realm: authConfig.keycloakRealm,
  clientId: authConfig.keycloakClientId,
});

const keycloakInitOptions: KeycloakInitOptions = {
  onLoad: "check-sso",
  pkceMethod: "S256",
  checkLoginIframe: false,
};

let keycloakInitPromise: Promise<boolean> | undefined;

/**
 * Initializes Keycloak exactly once for the app lifetime.
 *
 * This avoids duplicate init calls under React StrictMode remounts in dev.
 */
export const initializeKeycloakSession = () => {
  if (!keycloakInitPromise) {
    keycloakInitPromise = keycloakClient.init(keycloakInitOptions);
  }

  return keycloakInitPromise;
};
