import { useState } from "react";
import { Bell, PanelLeft, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HomeSidebar } from "@/components/common/HomeSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DashboardActivitySection,
  DashboardContinuePlayingSection,
  DashboardKpiGrid,
  DashboardRankCard,
  DashboardRecentlyPlayedSection,
  DashboardRecommendationsSection,
} from "@/components/home/DashboardSections";
import {
  continuePlayingGames,
  dashboardActivities,
  dashboardKpis,
  dashboardRecommendations,
  recentlyPlayedGames,
} from "@/components/home/dashboard-data";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { GameSidebarMenuItem } from "@/types/game-sidebar";

export function HomeDashboardPage() {
  const [activeSidebarItem, setActiveSidebarItem] =
    useState<GameSidebarMenuItem>("collection");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
          userName="Operator_01"
          userStatus="Vault Sync Stable"
        />

        <section className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
          <header className="rounded-xl border border-[rgb(153_247_255/0.14)] bg-[rgb(19_19_19/0.75)] px-4 py-3 backdrop-blur-xl lg:px-6 lg:py-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <p className="font-['Inter'] text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  Home
                </p>
                <h1 className="font-['Space_Grotesk'] text-xl font-semibold text-foreground lg:text-2xl">
                  Main Dashboard
                </h1>
              </div>
              <div className="ml-auto flex w-full items-center gap-2 md:w-auto">
                <Sheet
                  open={isMobileSidebarOpen}
                  onOpenChange={setIsMobileSidebarOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-10 w-10 border-[rgb(72_72_71/0.45)] bg-[rgb(38_38_38/0.5)] lg:hidden"
                      aria-label="Open navigation"
                    >
                      <PanelLeft size={16} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    showCloseButton={false}
                    className="w-84 border-[rgb(72_72_71/0.45)] bg-background p-2 sm:max-w-84"
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
                      userName="Operator_01"
                      userStatus="Vault Sync Stable"
                    />
                  </SheetContent>
                </Sheet>
                <div className="relative min-w-0 flex-1 md:w-80 md:flex-none">
                  <Search
                    size={16}
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Search games, genres, friends..."
                    className="h-10 border-[rgb(72_72_71/0.45)] bg-[rgb(38_38_38/0.5)] pl-9"
                  />
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 border-[rgb(72_72_71/0.45)] bg-[rgb(38_38_38/0.5)]"
                >
                  <Bell size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 border-[rgb(72_72_71/0.45)] bg-[rgb(38_38_38/0.5)]"
                  aria-label="Open profile menu"
                >
                  <Avatar size="sm" className="bg-[rgb(19_19_19/0.95)]">
                    <AvatarFallback className="bg-transparent font-['Inter'] text-[10px] text-primary">
                      OP
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </div>
            </div>
          </header>

          <Card className="relative overflow-hidden border-[rgb(153_247_255/0.18)] bg-[linear-gradient(135deg,rgb(26_25_25/0.9)_0%,rgb(19_19_19/0.92)_60%,rgb(0_241_254/0.12)_100%)]">
            <div
              className="pointer-events-none absolute -top-8 -right-8 h-44 w-44 rounded-full bg-primary/18 blur-3xl"
              aria-hidden="true"
            />
            <CardHeader className="gap-2">
              <p className="font-['Inter'] text-[11px] tracking-[0.14em] text-primary uppercase">
                Welcome back
              </p>
              <CardTitle className="font-['Space_Grotesk'] text-2xl lg:text-3xl">
                Operator_01
              </CardTitle>
              <p className="max-w-2xl font-['Manrope'] text-sm text-muted-foreground lg:text-base">
                128 titles synchronized. Your next milestone is close: complete
                one mission in Chrono Drift to hit a 7-day streak.
              </p>
            </CardHeader>
            <CardContent>
              <Button className="h-11 cursor-pointer px-5 font-['Space_Grotesk'] tracking-[0.04em]">
                Resume Last Session
              </Button>
            </CardContent>
          </Card>

          <DashboardKpiGrid kpis={dashboardKpis} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <DashboardRecentlyPlayedSection games={recentlyPlayedGames} />
              <DashboardContinuePlayingSection games={continuePlayingGames} />
            </div>

            <div className="space-y-4">
              <DashboardActivitySection activities={dashboardActivities} />
              <DashboardRecommendationsSection
                recommendations={dashboardRecommendations}
              />
              <DashboardRankCard />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
