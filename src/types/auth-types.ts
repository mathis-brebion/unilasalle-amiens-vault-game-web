export type AuthUser = {
  username: string;
  email: string;
  subject: string;
};

export type ApiAvailabilityStatus = "unknown" | "available" | "unavailable";

export type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  isApiVerified: boolean;
  apiAvailability: ApiAvailabilityStatus;
  apiStatusMessage: string;
  user: AuthUser;
  login: () => Promise<void>;
  register: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
  revalidateApiSession: () => Promise<boolean>;
};
