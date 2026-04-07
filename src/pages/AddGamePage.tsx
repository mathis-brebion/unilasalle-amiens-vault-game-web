import { useState } from "react";
import { Bolt, PanelLeft } from "lucide-react";
import { Header } from "@/components/common/Header";
import { HomeSidebar } from "@/components/home/HomeSidebar";
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
import type { GameSidebarMenuItem } from "@/types/game-sidebar";

const PLATFORM_OPTIONS = [
  { id: "steam", label: "Steam" },
  { id: "epic-games", label: "Epic Games" },
  { id: "gog", label: "GOG" },
  { id: "steam-deck", label: "Steam Deck" },
  { id: "playstation", label: "PlayStation" },
  { id: "xbox", label: "XBOX" },
  { id: "android", label: "Android" },
  { id: "ios", label: "iOS" },
] as const;

export function AddGamePage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const handleSidebarItemSelect = (item: GameSidebarMenuItem) => {
    void item;
    setIsMobileSidebarOpen(false);
  };

  const handlePlatformToggle = (platformId: string, checked: boolean) => {
    setSelectedPlatforms((previous) => {
      if (checked) {
        return previous.includes(platformId)
          ? previous
          : [...previous, platformId];
      }

      return previous.filter((currentId) => currentId !== platformId);
    });
  };

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-400 gap-4 px-4 py-4 lg:px-6 lg:py-6">
        <HomeSidebar
          className="hidden shrink-0 lg:flex"
          activeItem="add-game"
          onItemSelect={handleSidebarItemSelect}
          userName="Operator_01"
          userStatus="Vault Sync Stable"
        />

        <section className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
          <Header
            eyebrow="Library Operations"
            title="Add New Protocol"
            profileInitials="OP"
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
                    userName="Operator_01"
                    userStatus="Vault Sync Stable"
                  />
                </SheetContent>
              </Sheet>
            }
          />

          <Card className="surface-dashboard-card">
            <CardHeader className="gap-2">
              <p className="text-ui-label text-primary">Neon Sanctum</p>
              <CardTitle className="font-heading text-2xl lg:text-3xl">
                Register a new game in your vault
              </CardTitle>
              <p className="max-w-3xl text-sm text-muted-foreground lg:text-base">
                Inspired by your Stitch screen "Add New Game - Final Clean": a
                focused form with high-priority metadata and platform targeting.
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
                  Core metadata required for synchronization.
                </p>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-5"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="game-title">Game title</Label>
                      <Input
                        id="game-title"
                        placeholder="Chrono Drift"
                        className="surface-control h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="game-genre">Genre sector</Label>
                      <Select>
                        <SelectTrigger
                          id="game-genre"
                          className="surface-control h-10 w-full"
                        >
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rpg">RPG</SelectItem>
                          <SelectItem value="strategy">Strategy</SelectItem>
                          <SelectItem value="fps">FPS</SelectItem>
                          <SelectItem value="simulation">Simulation</SelectItem>
                          <SelectItem value="adventure">Adventure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="release-year">Chrono data / year</Label>
                      <Input
                        id="release-year"
                        placeholder="2026"
                        className="surface-control h-10"
                        inputMode="numeric"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cover-url">
                        Cover art visual / URL link
                      </Label>
                      <Input
                        id="cover-url"
                        placeholder="https://cdn.example.com/covers/chrono-drift.jpg"
                        className="surface-control h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="game-summary">Mission brief</Label>
                    <Textarea
                      id="game-summary"
                      className="surface-control min-h-28"
                      placeholder="Add a short narrative synopsis to classify this title faster in future searches."
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Platforms</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {PLATFORM_OPTIONS.map((platform) => {
                        const isChecked = selectedPlatforms.includes(
                          platform.id,
                        );

                        return (
                          <label
                            key={platform.id}
                            htmlFor={platform.id}
                            className="surface-dashboard-item flex cursor-pointer items-center justify-between rounded-md px-3 py-2"
                          >
                            <span className="text-sm text-foreground">
                              {platform.label}
                            </span>
                            <Checkbox
                              id={platform.id}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handlePlatformToggle(
                                  platform.id,
                                  checked === true,
                                )
                              }
                              className="surface-control"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button className="h-10 px-4 font-heading tracking-[0.04em] cursor-pointer">
                      <Bolt size={16} />
                      Initiate Sequencing
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
                      selectedPlatforms.map((platformId) => {
                        const label =
                          PLATFORM_OPTIONS.find(
                            (platform) => platform.id === platformId,
                          )?.label ?? platformId;

                        return (
                          <Badge
                            key={platformId}
                            variant="outline"
                            className="surface-control"
                          >
                            {label}
                          </Badge>
                        );
                      })
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
