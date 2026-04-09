import { useEffect, useMemo, useState, type FormEvent } from "react";
import axios from "axios";
import { Bolt, PanelLeft } from "lucide-react";
import { Header } from "@/components/common/Header";
import { HomeSidebar } from "@/components/home/HomeSidebar";
import { authConfig } from "@/lib/auth-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import type { AuthUser } from "@/types/auth-types";
import type { GameSidebarMenuItem } from "@/types/game-sidebar";

type PlatformOption = {
  id: number;
  name: string;
};

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

type RawgSearchResult = {
  rawgId: number;
  name: string;
  releasedAt: string | null;
  backgroundImageUrl: string | null;
};

type RawgGameDetails = {
  rawgId: number;
  name: string;
  genre: string | null;
  genres: string[];
  releaseYear: number | null;
  backgroundImageUrl: string | null;
  description: string | null;
  platformNames: string[];
};

type UserGameStatus = "WISHLIST" | "PLAYING" | "COMPLETED" | "DROPPED";

const USER_GAME_STATUS_OPTIONS: { value: UserGameStatus; label: string }[] = [
  { value: "WISHLIST", label: "Wishlist" },
  { value: "PLAYING", label: "Playing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DROPPED", label: "Dropped" },
];

const apiClient = axios.create({
  baseURL: authConfig.apiBaseUrl,
});

const getApiErrorMessage = (error: unknown) => {
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

const findCurrentUserId = async (token: string, user: AuthUser) => {
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

const normalizeName = (value: string) => value.trim().toLowerCase();

const resolveKnownPlatformId = (
  rawPlatformName: string,
  knownPlatforms: Map<string, number>,
) => {
  const normalizedName = normalizeName(rawPlatformName);
  const directMatch = knownPlatforms.get(normalizedName);
  if (directMatch !== undefined) {
    return directMatch;
  }

  if (normalizedName.includes("steam deck")) {
    return knownPlatforms.get("steam deck");
  }
  if (
    normalizedName.includes("pc") ||
    normalizedName.includes("windows") ||
    normalizedName.includes("mac") ||
    normalizedName.includes("linux") ||
    normalizedName.includes("steam")
  ) {
    return knownPlatforms.get("steam");
  }
  if (normalizedName.includes("playstation")) {
    return knownPlatforms.get("playstation");
  }
  if (normalizedName.includes("xbox")) {
    return knownPlatforms.get("xbox");
  }
  if (normalizedName.includes("epic")) {
    return knownPlatforms.get("epic games");
  }
  if (normalizedName.includes("gog")) {
    return knownPlatforms.get("gog");
  }
  if (normalizedName.includes("android")) {
    return knownPlatforms.get("android");
  }
  if (normalizedName.includes("ios")) {
    return knownPlatforms.get("ios");
  }

  return undefined;
};

const mapRawgPlatformsToKnownIds = (
  rawgPlatformNames: string[],
  platformOptions: PlatformOption[],
) => {
  if (rawgPlatformNames.length === 0) {
    return [];
  }

  const knownPlatforms = new Map(
    platformOptions.map((platform) => [normalizeName(platform.name), platform.id]),
  );

  return Array.from(
    new Set(
      rawgPlatformNames
        .map((name) => resolveKnownPlatformId(name, knownPlatforms))
        .filter((value): value is number => value !== undefined),
    ),
  );
};

export function AddGamePage() {
  const {
    user,
    logout,
    getToken,
    apiAvailability,
    apiStatusMessage,
    revalidateApiSession,
  } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [platformOptions, setPlatformOptions] = useState<PlatformOption[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [selectedPlatformNames, setSelectedPlatformNames] = useState<string[]>(
    [],
  );
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<UserGameStatus>("WISHLIST");
  const [selectedRawgId, setSelectedRawgId] = useState<number | null>(null);
  const [selectedRawgName, setSelectedRawgName] = useState("");
  const [searchResults, setSearchResults] = useState<RawgSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(
    null,
  );
  const [platformLoadError, setPlatformLoadError] = useState("");

  const selectedPlatformLabels = useMemo(
    () =>
      selectedPlatforms.map((platformId) => {
        const platform = platformOptions.find(
          (currentPlatform) => currentPlatform.id === platformId,
        );
        return platform?.name ?? String(platformId);
      }),
    [platformOptions, selectedPlatforms],
  );

  const handleSidebarItemSelect = (item: GameSidebarMenuItem) => {
    void item;
    setIsMobileSidebarOpen(false);
  };

  const resetAutofilledFields = () => {
    setGenre("");
    setReleaseYear("");
    setCoverUrl("");
    setSummary("");
    setSelectedPlatformNames([]);
    setSelectedPlatforms([]);
  };

  const resetForm = () => {
    setTitle("");
    setSelectedRawgId(null);
    setSelectedRawgName("");
    setSearchResults([]);
    setShowSuggestions(false);
    setStatus("WISHLIST");
    resetAutofilledFields();
  };

  useEffect(() => {
    let isMounted = true;

    const loadPlatforms = async () => {
      if (apiAvailability !== "available") {
        return;
      }

      const token = await getToken();
      if (!token) {
        return;
      }

      try {
        setPlatformLoadError("");
        const platforms = await fetchAllPages<PlatformOption>(
          token,
          "/api/platforms",
        );
        if (!isMounted) {
          return;
        }
        setPlatformOptions(platforms);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setPlatformLoadError(getApiErrorMessage(error));
      }
    };

    void loadPlatforms();

    return () => {
      isMounted = false;
    };
  }, [apiAvailability, getToken]);

  useEffect(() => {
    setSelectedPlatforms(
      mapRawgPlatformsToKnownIds(selectedPlatformNames, platformOptions),
    );
  }, [platformOptions, selectedPlatformNames]);

  useEffect(() => {
    if (
      apiAvailability !== "available" ||
      title.trim().length < 2 ||
      title.trim() === selectedRawgName
    ) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => {
      const runSearch = async () => {
        const token = await getToken();
        if (!token) {
          return;
        }

        try {
          setIsSearching(true);
          const { data } = await apiClient.get<RawgSearchResult[]>(
            "/api/rawg/games/search",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                query: title.trim(),
                size: 8,
              },
              signal: abortController.signal,
            },
          );

          setSearchResults(data);
          setShowSuggestions(data.length > 0);
        } catch (error) {
          if (!axios.isCancel(error)) {
            setSearchResults([]);
            setShowSuggestions(false);
          }
        } finally {
          setIsSearching(false);
        }
      };

      void runSearch();
    }, 300);

    return () => {
      abortController.abort();
      window.clearTimeout(timeoutId);
    };
  }, [apiAvailability, getToken, selectedRawgName, title]);

  const loadRawgDetails = async (rawgId: number) => {
    const token = await getToken();
    if (!token) {
      throw new Error("Session expirée. Reconnectez-vous.");
    }

    const { data } = await apiClient.get<RawgGameDetails>(
      `/api/rawg/games/${rawgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setSelectedRawgId(data.rawgId);
    setSelectedRawgName(data.name);
    setTitle(data.name);
    setGenre(data.genre ?? data.genres[0] ?? "");
    setReleaseYear(data.releaseYear ? String(data.releaseYear) : "");
    setCoverUrl(data.backgroundImageUrl ?? "");
    setSummary(data.description ?? "");
    setSelectedPlatformNames(data.platformNames ?? []);
  };

  const handleSuggestionSelect = async (suggestion: RawgSearchResult) => {
    setFeedbackType(null);
    setFeedbackMessage("");
    setShowSuggestions(false);
    setSearchResults([]);

    try {
      setIsLoadingDetails(true);
      await loadRawgDetails(suggestion.rawgId);
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage(getApiErrorMessage(error));
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedRawgId) {
      setFeedbackType("error");
      setFeedbackMessage(
        "Sélectionnez un jeu depuis l'autocomplétion avant d'ajouter.",
      );
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage("");
    setFeedbackType(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Session expirée. Reconnectez-vous.");
      }

      const userId = await findCurrentUserId(token, user);

      await apiClient.post(
        `/api/users/${userId}/games`,
        {
          rawgId: selectedRawgId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      resetForm();
      setFeedbackType("success");
      setFeedbackMessage("Jeu ajouté à votre bibliothèque.");
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-400 gap-4 px-4 py-4 lg:px-6 lg:py-6">
        <HomeSidebar
          className="hidden shrink-0 lg:flex"
          activeItem="add-game"
          onItemSelect={handleSidebarItemSelect}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
          <Header
            eyebrow="Library Operations"
            title="Add New Protocol"
            onLogout={() => {
              void logout();
            }}
            mobileNavigation={
              <Sheet
                open={isMobileSidebarOpen}
                onOpenChange={setIsMobileSidebarOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="surface-control h-10 w-10 lg:hidden"
                    aria-label="Open navigation"
                  >
                    <PanelLeft size={16} />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  showCloseButton={false}
                  className="w-84 border-border/45 bg-background p-2 sm:max-w-84"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Dashboard navigation</SheetTitle>
                    <SheetDescription>
                      Access dashboard sections and account settings.
                    </SheetDescription>
                  </SheetHeader>
                  <HomeSidebar
                    className="min-h-full max-w-none"
                    activeItem="add-game"
                    onItemSelect={handleSidebarItemSelect}
                  />
                </SheetContent>
              </Sheet>
            }
          />

          {apiAvailability === "unavailable" ? (
            <Card className="border-destructive/40 bg-destructive/10">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <p className="text-sm text-destructive">
                  Authentification Keycloak active, mais connexion API
                  indisponible.
                  {apiStatusMessage ? ` ${apiStatusMessage}` : ""}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    void revalidateApiSession();
                  }}
                >
                  Retry API Check
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <Card className="surface-dashboard-card">
            <CardHeader className="gap-2">
              <p className="text-ui-label text-primary">Neon Sanctum</p>
              <CardTitle className="font-heading text-2xl lg:text-3xl">
                Register a new game in your vault
              </CardTitle>
              <p className="max-w-3xl text-sm text-muted-foreground lg:text-base">
                Tapez le nom d'un jeu, choisissez une suggestion, puis les
                métadonnées se remplissent automatiquement.
              </p>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Card className="surface-dashboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-xl">
                  Protocol Identity
                </CardTitle>
                <p className="text-ui-meta text-muted-foreground">
                  Sélection obligatoire via l'autocomplétion.
                </p>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    void handleSubmit(event);
                  }}
                >
                  {feedbackType ? (
                    <div
                      className={
                        feedbackType === "success"
                          ? "rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary"
                          : "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                      }
                    >
                      {feedbackMessage}
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="game-title">Game title (autocomplete)</Label>
                      <div className="relative">
                        <Input
                          id="game-title"
                          placeholder="Chrono Drift"
                          className="surface-control h-10"
                          value={title}
                          onChange={(event) => {
                            setTitle(event.target.value);
                            setSelectedRawgId(null);
                            setSelectedRawgName("");
                            resetAutofilledFields();
                          }}
                          onFocus={() => {
                            if (searchResults.length > 0) {
                              setShowSuggestions(true);
                            }
                          }}
                          onBlur={() => {
                            window.setTimeout(() => {
                              setShowSuggestions(false);
                            }, 150);
                          }}
                          disabled={isSubmitting}
                        />
                        {isSearching ? (
                          <p className="pt-2 text-xs text-muted-foreground">
                            Searching...
                          </p>
                        ) : null}
                        {showSuggestions ? (
                          <div className="surface-dashboard-item absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border/60 bg-background p-1">
                            {searchResults.map((result) => (
                              <button
                                key={result.rawgId}
                                type="button"
                                className="hover:bg-accent hover:text-accent-foreground w-full rounded-sm px-3 py-2 text-left text-sm"
                                onMouseDown={() => {
                                  void handleSuggestionSelect(result);
                                }}
                              >
                                <p className="font-medium">{result.name}</p>
                                {result.releasedAt ? (
                                  <p className="text-xs text-muted-foreground">
                                    {result.releasedAt}
                                  </p>
                                ) : null}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="game-genre">Genre</Label>
                      <Input
                        id="game-genre"
                        className="surface-control h-10"
                        value={genre}
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="release-year">Release year</Label>
                      <Input
                        id="release-year"
                        className="surface-control h-10"
                        value={releaseYear}
                        readOnly
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="cover-url">Cover URL</Label>
                      <Input
                        id="cover-url"
                        className="surface-control h-10"
                        value={coverUrl}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="game-summary">Summary</Label>
                    <Textarea
                      id="game-summary"
                      className="surface-control min-h-28"
                      value={summary}
                      readOnly
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="game-status">Library status</Label>
                    <Select
                      value={status}
                      onValueChange={(nextStatus) => {
                        setStatus(nextStatus as UserGameStatus);
                      }}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="game-status"
                        className="surface-control h-10 w-full"
                      >
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_GAME_STATUS_OPTIONS.map((statusOption) => (
                          <SelectItem
                            key={statusOption.value}
                            value={statusOption.value}
                          >
                            {statusOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Platforms (auto-filled)</Label>
                    {platformLoadError ? (
                      <p className="text-sm text-destructive">{platformLoadError}</p>
                    ) : null}
                    {selectedPlatformNames.length > 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Detected: {selectedPlatformNames.join(", ")}
                      </p>
                    ) : null}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {platformOptions.map((platform) => {
                        const isChecked = selectedPlatforms.includes(
                          platform.id,
                        );

                        return (
                          <label
                            key={platform.id}
                            htmlFor={`platform-${platform.id}`}
                            className="surface-dashboard-item flex items-center justify-between rounded-md px-3 py-2"
                          >
                            <span className="text-sm text-foreground">
                              {platform.name}
                            </span>
                            <Checkbox
                              id={`platform-${platform.id}`}
                              checked={isChecked}
                              className="surface-control"
                              disabled
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="submit"
                      className="h-10 px-4 font-heading tracking-[0.04em] cursor-pointer"
                      disabled={
                        isSubmitting ||
                        isLoadingDetails ||
                        apiAvailability !== "available"
                      }
                    >
                      <Bolt size={16} />
                      {isSubmitting ? "Adding..." : "Initiate Sequencing"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="surface-dashboard-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Selected Platforms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedPlatforms.length > 0 ? (
                      selectedPlatformLabels.map((label, index) => (
                        <Badge
                          key={`${label}-${index}`}
                          variant="outline"
                          className="surface-control"
                        >
                          {label}
                        </Badge>
                      ))
                    ) : selectedPlatformNames.length > 0 ? (
                      selectedPlatformNames.map((label, index) => (
                        <Badge
                          key={`${label}-${index}`}
                          variant="outline"
                          className="surface-control"
                        >
                          {label}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No platform selected.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
