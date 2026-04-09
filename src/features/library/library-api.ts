import axios from "axios";
import { authConfig } from "@/lib/auth-config";
import type { AuthUser } from "@/types/auth-types";

export type UserGameStatus = "WISHLIST" | "PLAYING" | "COMPLETED" | "DROPPED";

export const USER_GAME_STATUS_OPTIONS: { value: UserGameStatus; label: string }[] =
  [
    { value: "WISHLIST", label: "Wishlist" },
    { value: "PLAYING", label: "Playing" },
    { value: "COMPLETED", label: "Completed" },
    { value: "DROPPED", label: "Dropped" },
  ];

type PaginatedResponse<T> = {
  content: T[];
  totalPages: number;
};

type ApiUser = {
  id: number;
  keycloakSubject: string;
  email: string;
  username: string;
};

export type UserLibraryGame = {
  id: number;
  userId: number;
  gameId: number;
  gameName: string;
  status: UserGameStatus;
  addedAt: string;
};

export type GameDetails = {
  id: number;
  rawgId: number | null;
  name: string;
  slug: string | null;
  genre: string | null;
  releaseYear: number | null;
  releasedAt: string | null;
  backgroundImageUrl: string | null;
  platformIds: number[];
};

export type PlatformOption = {
  id: number;
  name: string;
};

const apiClient = axios.create({
  baseURL: authConfig.apiBaseUrl,
});

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; error?: string }
      | undefined;
    return (
      responseData?.message ??
      responseData?.error ??
      error.message ??
      "Unexpected API error."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected API error.";
};

const fetchAllPages = async <T,>(
  token: string,
  resourcePath: string,
  params?: Record<string, string | number>,
): Promise<T[]> => {
  const allItems: T[] = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const { data } = await apiClient.get<PaginatedResponse<T>>(resourcePath, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ...params,
        page,
        size: 50,
      },
    });

    allItems.push(...data.content);
    totalPages = data.totalPages;
    page += 1;
  }

  return allItems;
};

export const findCurrentUserId = async (token: string, user: AuthUser) => {
  const users = await fetchAllPages<ApiUser>(token, "/api/users");

  const currentUser = users.find(
    (candidate) =>
      candidate.keycloakSubject === user.subject ||
      candidate.email === user.email ||
      candidate.username === user.username,
  );

  if (!currentUser) {
    throw new Error("Utilisateur API introuvable pour la session connectée.");
  }

  return currentUser.id;
};

export const fetchPlatforms = async (token: string) =>
  fetchAllPages<PlatformOption>(token, "/api/platforms");

export const fetchUserLibrary = async (
  token: string,
  userId: number,
  search: string,
) =>
  fetchAllPages<UserLibraryGame>(token, `/api/users/${userId}/games`, {
    search,
  });

export const fetchGameDetails = async (token: string, gameId: number) => {
  const { data } = await apiClient.get<GameDetails>(`/api/games/${gameId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const updateGameDetails = async (
  token: string,
  gameId: number,
  payload: {
    rawgId: number | null;
    name: string;
    slug: string | null;
    genre: string | null;
    releaseYear: number | null;
    releasedAt: string | null;
    backgroundImageUrl: string | null;
    platformIds: number[];
  },
) => {
  const { data } = await apiClient.put<GameDetails>(`/api/games/${gameId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const updateUserGameStatus = async (
  token: string,
  userId: number,
  gameId: number,
  status: UserGameStatus,
) => {
  await apiClient.patch(
    `/api/users/${userId}/games/${gameId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const removeUserGame = async (
  token: string,
  userId: number,
  gameId: number,
) => {
  await apiClient.delete(`/api/users/${userId}/games/${gameId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
