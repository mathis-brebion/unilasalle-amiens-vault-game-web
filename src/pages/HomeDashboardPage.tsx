import { useState } from "react";
import { PanelLeft, Search } from "lucide-react";
import { HomeSidebar } from "@/components/home/HomeSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/common/Header";
import { Input } from "@/components/ui/input";
import {
  type OwnedGame,
  DashboardRecentlyPlayedSection,
} from "@/components/home/DashboardSections";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import type { GameSidebarMenuItem } from "@/types/game-sidebar";

export function HomeDashboardPage() {
  const {
    user,
    logout,
    apiAvailability,
    apiStatusMessage,
    revalidateApiSession,
  } = useAuth();
  const [activeSidebarItem, setActiveSidebarItem] =
    useState<GameSidebarMenuItem>("collection");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const displayName = user.username || "Operator_01";
  const ownedGames: OwnedGame[] = [];

  const handleSidebarItemSelect = (item: GameSidebarMenuItem) => {
    setActiveSidebarItem(item);
    setIsMobileSidebarOpen(false);
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
                  placeholder="Search games, genres, friends..."
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

          <DashboardRecentlyPlayedSection games={ownedGames} />
        </section>
      </div>
    </main>
  );
}
