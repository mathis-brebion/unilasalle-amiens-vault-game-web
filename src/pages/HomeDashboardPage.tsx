import { useCallback, useEffect, useMemo, useState } from "react";
import { PanelLeft, Save, Search, Trash2 } from "lucide-react";
import { HomeSidebar } from "@/components/home/HomeSidebar";
import { Header } from "@/components/common/Header";
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
import { cn } from "@/lib/utils";
import {
  fetchGameDetails,
  fetchPlatforms,
  fetchUserLibrary,
  findCurrentUserId,
  getApiErrorMessage,
  removeUserGame,
  type GameDetails,
  type PlatformOption,
  type UserGameStatus,
  type UserLibraryGame,
  USER_GAME_STATUS_OPTIONS,
  updateGameDetails,
  updateUserGameStatus,
} from "@/features/library/library-api";
import { useAuth } from "@/hooks/use-auth";
import type { GameSidebarMenuItem } from "@/types/game-sidebar";

type CollectionFilter = "ALL" | UserGameStatus;

type GameEditorForm = {
  rawgId: number | null;
  name: string;
  slug: string;
  genre: string;
  releaseYear: string;
  releasedAt: string;
  backgroundImageUrl: string;
  platformIds: number[];
  status: UserGameStatus;
};

const trimToNullable = (value: string) => {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

export function HomeDashboardPage() {
  const {
    user,
    logout,
    getToken,
    apiAvailability,
    apiStatusMessage,
    revalidateApiSession,
  } = useAuth();
  const [activeSidebarItem, setActiveSidebarItem] =
    useState<GameSidebarMenuItem>("collection");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CollectionFilter>("ALL");
  const [apiUserId, setApiUserId] = useState<number | null>(null);
  const [collectionGames, setCollectionGames] = useState<UserLibraryGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedGameDetails, setSelectedGameDetails] =
    useState<GameDetails | null>(null);
  const [editorForm, setEditorForm] = useState<GameEditorForm | null>(null);
  const [platformOptions, setPlatformOptions] = useState<PlatformOption[]>([]);
  const [isLoadingCollection, setIsLoadingCollection] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(
    null,
  );
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const displayName = user.username || "Operator_01";
  const selectedLibraryEntry = useMemo(
    () => collectionGames.find((game) => game.gameId === selectedGameId) ?? null,
    [collectionGames, selectedGameId],
  );
  const statusLabelByValue = useMemo(
    () =>
      new Map(
        USER_GAME_STATUS_OPTIONS.map((statusOption) => [
          statusOption.value,
          statusOption.label,
        ]),
      ),
    [],
  );
  const statusCountByValue = useMemo(() => {
    return USER_GAME_STATUS_OPTIONS.reduce(
      (accumulator, currentStatus) => {
        accumulator[currentStatus.value] = collectionGames.filter(
          (game) => game.status === currentStatus.value,
        ).length;
        return accumulator;
      },
      {
        WISHLIST: 0,
        PLAYING: 0,
        COMPLETED: 0,
        DROPPED: 0,
      } as Record<UserGameStatus, number>,
    );
  }, [collectionGames]);
  const filteredGames = useMemo(() => {
    if (activeFilter === "ALL") {
      return collectionGames;
    }

    return collectionGames.filter((game) => game.status === activeFilter);
  }, [activeFilter, collectionGames]);

  const handleSidebarItemSelect = (item: GameSidebarMenuItem) => {
    setActiveSidebarItem(item);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const resolveApiSession = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      throw new Error("Session expirée. Reconnectez-vous.");
    }

    let resolvedUserId = apiUserId;
    if (resolvedUserId === null) {
      resolvedUserId = await findCurrentUserId(token, user);
      setApiUserId(resolvedUserId);
    }

    return { token, userId: resolvedUserId };
  }, [apiUserId, getToken, user]);

  const loadCollection = useCallback(
    async (searchValue: string) => {
      if (apiAvailability !== "available") {
        return;
      }

      setIsLoadingCollection(true);

      try {
        const { token, userId } = await resolveApiSession();
        const libraryGames = await fetchUserLibrary(token, userId, searchValue);
        setCollectionGames(libraryGames);
        setSelectedGameId((currentGameId) => {
          if (libraryGames.length === 0) {
            return null;
          }

          if (
            currentGameId !== null &&
            libraryGames.some((game) => game.gameId === currentGameId)
          ) {
            return currentGameId;
          }

          return libraryGames[0].gameId;
        });
      } catch (error) {
        setFeedbackType("error");
        setFeedbackMessage(getApiErrorMessage(error));
      } finally {
        setIsLoadingCollection(false);
      }
    },
    [apiAvailability, resolveApiSession],
  );

  useEffect(() => {
    if (apiAvailability !== "available") {
      setApiUserId(null);
      setCollectionGames([]);
      setSelectedGameId(null);
      setSelectedGameDetails(null);
      setEditorForm(null);
      return;
    }

    void loadCollection(debouncedSearchQuery);
  }, [apiAvailability, debouncedSearchQuery, loadCollection]);

  useEffect(() => {
    if (apiAvailability !== "available") {
      return;
    }

    let isMounted = true;

    const loadPlatforms = async () => {
      try {
        const { token } = await resolveApiSession();
        const loadedPlatforms = await fetchPlatforms(token);
        if (!isMounted) {
          return;
        }
        setPlatformOptions(loadedPlatforms);
      } catch {
        if (!isMounted) {
          return;
        }
        setPlatformOptions([]);
      }
    };

    void loadPlatforms();

    return () => {
      isMounted = false;
    };
  }, [apiAvailability, resolveApiSession]);

  useEffect(() => {
    if (filteredGames.length === 0) {
      setSelectedGameId(null);
      return;
    }

    if (
      selectedGameId !== null &&
      filteredGames.some((game) => game.gameId === selectedGameId)
    ) {
      return;
    }

    setSelectedGameId(filteredGames[0].gameId);
  }, [filteredGames, selectedGameId]);

  useEffect(() => {
    if (
      selectedGameId === null ||
      selectedLibraryEntry === null ||
      apiAvailability !== "available"
    ) {
      setSelectedGameDetails(null);
      setEditorForm(null);
      return;
    }

    let isMounted = true;
    setIsLoadingDetails(true);

    const loadDetails = async () => {
      try {
        const { token } = await resolveApiSession();
        const details = await fetchGameDetails(token, selectedGameId);
        if (!isMounted) {
          return;
        }
        setSelectedGameDetails(details);
        setEditorForm({
          rawgId: details.rawgId,
          name: details.name,
          slug: details.slug ?? "",
          genre: details.genre ?? "",
          releaseYear: details.releaseYear ? String(details.releaseYear) : "",
          releasedAt: details.releasedAt ?? "",
          backgroundImageUrl: details.backgroundImageUrl ?? "",
          platformIds: details.platformIds ?? [],
          status: selectedLibraryEntry.status,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setFeedbackType("error");
        setFeedbackMessage(getApiErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoadingDetails(false);
        }
      }
    };

    void loadDetails();

    return () => {
      isMounted = false;
    };
  }, [apiAvailability, resolveApiSession, selectedGameId, selectedLibraryEntry]);

  const handlePlatformToggle = (platformId: number, checked: boolean) => {
    setEditorForm((currentForm) => {
      if (!currentForm) {
        return currentForm;
      }

      if (checked) {
        if (currentForm.platformIds.includes(platformId)) {
          return currentForm;
        }

        return {
          ...currentForm,
          platformIds: [...currentForm.platformIds, platformId],
        };
      }

      return {
        ...currentForm,
        platformIds: currentForm.platformIds.filter((id) => id !== platformId),
      };
    });
  };

  const handleSaveGameChanges = async () => {
    if (!editorForm || !selectedLibraryEntry) {
      return;
    }

    if (editorForm.name.trim().length === 0) {
      setFeedbackType("error");
      setFeedbackMessage("Le nom du jeu est requis.");
      return;
    }

    setIsSaving(true);
    setFeedbackType(null);
    setFeedbackMessage("");

    try {
      const { token, userId } = await resolveApiSession();
      const releaseYear = editorForm.releaseYear.trim();
      await updateGameDetails(token, selectedLibraryEntry.gameId, {
        rawgId: editorForm.rawgId,
        name: editorForm.name.trim(),
        slug: trimToNullable(editorForm.slug),
        genre: trimToNullable(editorForm.genre),
        releaseYear: releaseYear.length > 0 ? Number(releaseYear) : null,
        releasedAt:
          editorForm.releasedAt.trim().length > 0 ? editorForm.releasedAt : null,
        backgroundImageUrl: trimToNullable(editorForm.backgroundImageUrl),
        platformIds: editorForm.platformIds,
      });

      if (editorForm.status !== selectedLibraryEntry.status) {
        await updateUserGameStatus(
          token,
          userId,
          selectedLibraryEntry.gameId,
          editorForm.status,
        );
      }

      await loadCollection(debouncedSearchQuery);
      const refreshedDetails = await fetchGameDetails(
        token,
        selectedLibraryEntry.gameId,
      );
      setSelectedGameDetails(refreshedDetails);
      setEditorForm((currentForm) =>
        currentForm
          ? {
              ...currentForm,
              status: editorForm.status,
            }
          : null,
      );
      setFeedbackType("success");
      setFeedbackMessage("Jeu mis à jour dans votre collection.");
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGame = async () => {
    if (!selectedLibraryEntry) {
      return;
    }

    const shouldDelete = window.confirm(
      `Supprimer "${selectedLibraryEntry.gameName}" de votre collection ?`,
    );
    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);
    setFeedbackType(null);
    setFeedbackMessage("");

    try {
      const { token, userId } = await resolveApiSession();
      await removeUserGame(token, userId, selectedLibraryEntry.gameId);
      await loadCollection(debouncedSearchQuery);
      setSelectedGameDetails(null);
      setEditorForm(null);
      setFeedbackType("success");
      setFeedbackMessage("Jeu supprimé de votre collection.");
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-400 gap-4 px-4 py-4 lg:px-6 lg:py-6">
        <HomeSidebar
          className="hidden shrink-0 lg:flex"
          activeItem={activeSidebarItem}
          onItemSelect={handleSidebarItemSelect}
        />

        <section className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
          <Header
            eyebrow="Home"
            title="Main Dashboard"
            onLogout={() => {
              void logout();
            }}
            centerContent={
              <div className="relative min-w-0 flex-1 md:w-80 md:flex-none">
                <Search
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                  }}
                  placeholder="Search in my collection..."
                  className="surface-control h-10 pl-9"
                />
              </div>
            }
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
                    activeItem={activeSidebarItem}
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

          <Card className="relative overflow-hidden border-primary/20 bg-[linear-gradient(135deg,rgb(26_25_25/0.9)_0%,rgb(19_19_19/0.92)_60%,rgb(0_241_254/0.12)_100%)]">
            <div
              className="pointer-events-none absolute -top-8 -right-8 h-44 w-44 rounded-full bg-primary/18 blur-3xl"
              aria-hidden="true"
            />
            <CardHeader className="gap-2">
              <p className="text-ui-label text-primary">Welcome back</p>
              <CardTitle className="font-heading text-2xl lg:text-3xl">
                {displayName}
              </CardTitle>
            </CardHeader>
            <CardContent />
          </Card>

          <Card className="surface-dashboard-card">
            <CardHeader className="gap-3">
              <CardTitle className="font-heading text-lg">My Collection</CardTitle>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFilter("ALL")}
                  className="cursor-pointer"
                >
                  <Badge
                    variant={activeFilter === "ALL" ? "default" : "outline"}
                    className={cn(
                      "h-6 px-2.5",
                      activeFilter !== "ALL" && "surface-control",
                    )}
                  >
                    All ({collectionGames.length})
                  </Badge>
                </button>
                {USER_GAME_STATUS_OPTIONS.map((statusOption) => (
                  <button
                    key={statusOption.value}
                    type="button"
                    onClick={() => setActiveFilter(statusOption.value)}
                    className="cursor-pointer"
                  >
                    <Badge
                      variant={
                        activeFilter === statusOption.value ? "default" : "outline"
                      }
                      className={cn(
                        "h-6 px-2.5",
                        activeFilter !== statusOption.value && "surface-control",
                      )}
                    >
                      {statusOption.label} ({statusCountByValue[statusOption.value]})
                    </Badge>
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbackType ? (
                <div
                  className={
                    feedbackType === "success"
                      ? "rounded-md border border-primary/35 bg-primary/10 px-3 py-2 text-sm text-primary"
                      : "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  }
                >
                  {feedbackMessage}
                </div>
              ) : null}

              {isLoadingCollection ? (
                <p className="text-sm text-muted-foreground">
                  Loading your collection...
                </p>
              ) : null}

              {!isLoadingCollection && filteredGames.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No game matches this filter.
                </p>
              ) : null}

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {filteredGames.map((game) => (
                    <article
                      key={game.gameId}
                      className={cn(
                        "surface-dashboard-item cursor-pointer rounded-lg p-3 transition",
                        selectedGameId === game.gameId &&
                          "border-primary/40 bg-[rgb(153_247_255/0.08)]",
                      )}
                      onClick={() => {
                        setSelectedGameId(game.gameId);
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-heading text-sm leading-tight">
                          {game.gameName}
                        </p>
                        <Badge variant="outline" className="surface-control">
                          {statusLabelByValue.get(game.status) ?? game.status}
                        </Badge>
                      </div>
                      <p className="pt-2 text-xs text-muted-foreground">
                        Added on {new Date(game.addedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </article>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="surface-dashboard-card">
            <CardHeader className="gap-2">
              <CardTitle className="font-heading text-lg">
                {selectedLibraryEntry
                  ? `Game Details · ${selectedLibraryEntry.gameName}`
                  : "Game Details"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Consultez les détails, modifiez les infos, mettez à jour le statut
                ou supprimez ce jeu de votre collection.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingDetails ? (
                <p className="text-sm text-muted-foreground">
                  Loading selected game details...
                </p>
              ) : null}

              {!isLoadingDetails && !editorForm ? (
                <p className="text-sm text-muted-foreground">
                  Select a game in your collection to view and edit it.
                </p>
              ) : null}

              {editorForm ? (
                <>
                  {selectedGameDetails?.backgroundImageUrl ? (
                    <div className="surface-dashboard-item flex h-72 w-full items-center justify-center overflow-hidden rounded-lg p-2">
                      <img
                        src={selectedGameDetails.backgroundImageUrl}
                        alt={editorForm.name}
                        className="h-full w-full rounded-md object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="dashboard-game-name">Name</Label>
                      <Input
                        id="dashboard-game-name"
                        className="surface-control h-10"
                        value={editorForm.name}
                        onChange={(event) => {
                          setEditorForm((currentForm) =>
                            currentForm
                              ? { ...currentForm, name: event.target.value }
                              : null,
                          );
                        }}
                        disabled={isSaving || isDeleting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dashboard-game-slug">Slug</Label>
                      <Input
                        id="dashboard-game-slug"
                        className="surface-control h-10"
                        value={editorForm.slug}
                        onChange={(event) => {
                          setEditorForm((currentForm) =>
                            currentForm
                              ? { ...currentForm, slug: event.target.value }
                              : null,
                          );
                        }}
                        disabled={isSaving || isDeleting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dashboard-game-genre">Genre</Label>
                      <Input
                        id="dashboard-game-genre"
                        className="surface-control h-10"
                        value={editorForm.genre}
                        onChange={(event) => {
                          setEditorForm((currentForm) =>
                            currentForm
                              ? { ...currentForm, genre: event.target.value }
                              : null,
                          );
                        }}
                        disabled={isSaving || isDeleting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dashboard-game-release-year">
                        Release year
                      </Label>
                      <Input
                        id="dashboard-game-release-year"
                        type="number"
                        className="surface-control h-10"
                        value={editorForm.releaseYear}
                        onChange={(event) => {
                          setEditorForm((currentForm) =>
                            currentForm
                              ? { ...currentForm, releaseYear: event.target.value }
                              : null,
                          );
                        }}
                        disabled={isSaving || isDeleting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dashboard-game-release-date">
                        Release date
                      </Label>
                      <Input
                        id="dashboard-game-release-date"
                        type="date"
                        className="surface-control h-10"
                        value={editorForm.releasedAt}
                        onChange={(event) => {
                          setEditorForm((currentForm) =>
                            currentForm
                              ? { ...currentForm, releasedAt: event.target.value }
                              : null,
                          );
                        }}
                        disabled={isSaving || isDeleting}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="dashboard-game-cover">Cover URL</Label>
                      <Input
                        id="dashboard-game-cover"
                        className="surface-control h-10"
                        value={editorForm.backgroundImageUrl}
                        onChange={(event) => {
                          setEditorForm((currentForm) =>
                            currentForm
                              ? {
                                  ...currentForm,
                                  backgroundImageUrl: event.target.value,
                                }
                              : null,
                          );
                        }}
                        disabled={isSaving || isDeleting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dashboard-game-status">Library status</Label>
                    <Select
                      value={editorForm.status}
                      onValueChange={(nextStatus) => {
                        setEditorForm((currentForm) =>
                          currentForm
                            ? {
                                ...currentForm,
                                status: nextStatus as UserGameStatus,
                              }
                            : null,
                        );
                      }}
                      disabled={isSaving || isDeleting}
                    >
                      <SelectTrigger
                        id="dashboard-game-status"
                        className="surface-control h-10 w-full"
                      >
                        <SelectValue placeholder="Select status" />
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
                    <Label>Platforms</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {platformOptions.map((platform) => (
                        <label
                          key={platform.id}
                          htmlFor={`dashboard-platform-${platform.id}`}
                          className="surface-dashboard-item flex items-center justify-between rounded-md px-3 py-2"
                        >
                          <span className="text-sm text-foreground">
                            {platform.name}
                          </span>
                          <Checkbox
                            id={`dashboard-platform-${platform.id}`}
                            checked={editorForm.platformIds.includes(platform.id)}
                            className="surface-control"
                            disabled={isSaving || isDeleting}
                            onCheckedChange={(checked) => {
                              handlePlatformToggle(platform.id, checked === true);
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => {
                        void handleSaveGameChanges();
                      }}
                      disabled={isSaving || isDeleting}
                      className="cursor-pointer"
                    >
                      <Save size={16} />
                      {isSaving ? "Saving..." : "Save changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        void handleDeleteGame();
                      }}
                      disabled={isSaving || isDeleting}
                      className="cursor-pointer"
                    >
                      <Trash2 size={16} />
                      {isDeleting ? "Deleting..." : "Delete from collection"}
                    </Button>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
