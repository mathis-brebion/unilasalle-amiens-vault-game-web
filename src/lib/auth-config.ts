const getRequiredEnv = (name: keyof ImportMetaEnv): string => {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(
      `Missing ${name}. Define it in .env.local or .env.development.local.`,
    );
  }

  return value;
};

const getOptionalEnv = (name: keyof ImportMetaEnv): string | undefined => {
  const value = import.meta.env[name];
  return value ? value : undefined;
};

export const authConfig = {
  keycloakUrl: getRequiredEnv("VITE_KEYCLOAK_URL"),
  keycloakRealm: getRequiredEnv("VITE_KEYCLOAK_REALM"),
  keycloakClientId: getRequiredEnv("VITE_KEYCLOAK_CLIENT_ID"),
  apiBaseUrl: getRequiredEnv("VITE_API_BASE_URL"),
  keycloakLogoutRedirectUri: getOptionalEnv("VITE_KEYCLOAK_LOGOUT_REDIRECT_URI"),
};
