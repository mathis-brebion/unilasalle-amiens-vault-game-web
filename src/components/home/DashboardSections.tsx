import { Clock3, Flame, Gamepad2, Sparkles, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type {
  DashboardActivityEntry,
  DashboardGameTile,
  DashboardKpi,
  DashboardRecommendation,
} from "@/components/home/dashboard-data";

export function DashboardKpiGrid({ kpis }: { kpis: DashboardKpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <Card
          key={kpi.label}
          size="sm"
          className="border-[rgb(153_247_255/0.14)] bg-[rgb(26_25_25/0.86)]"
        >
          <CardHeader className="gap-2">
            <p className="font-['Inter'] text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              {kpi.label}
            </p>
            <CardTitle className="font-['Space_Grotesk'] text-3xl leading-none">
              {kpi.value}
            </CardTitle>
            <p className="font-['Manrope'] text-xs text-primary">{kpi.delta}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export function DashboardRecentlyPlayedSection({
  games,
}: {
  games: DashboardGameTile[];
}) {
  return (
    <Card className="border-[rgb(153_247_255/0.14)] bg-[rgb(26_25_25/0.86)]">
      <CardHeader>
        <CardTitle className="font-['Space_Grotesk'] text-lg">
          Recently Played
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {games.map((game) => (
            <article
              key={game.title}
              className="group overflow-hidden rounded-lg border border-[rgb(153_247_255/0.12)] bg-[rgb(19_19_19/0.9)] transition hover:-translate-y-0.5 hover:border-[rgb(153_247_255/0.26)]"
            >
              <img
                src={game.image}
                alt={game.title}
                className="h-28 w-full object-cover"
                loading="lazy"
              />
              <div className="space-y-2 px-3 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-['Space_Grotesk'] text-sm font-medium">
                    {game.title}
                  </p>
                  <span className="font-['Inter'] text-[10px] tracking-widest text-muted-foreground uppercase">
                    {game.progress}%
                  </span>
                </div>
                <p className="font-['Manrope'] text-xs text-muted-foreground">
                  {game.subtitle}
                </p>
                <Progress value={game.progress} className="h-1.5" />
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardContinuePlayingSection({
  games,
}: {
  games: DashboardGameTile[];
}) {
  return (
    <Card className="border-[rgb(153_247_255/0.14)] bg-[rgb(26_25_25/0.86)]">
      <CardHeader>
        <CardTitle className="font-['Space_Grotesk'] text-lg">
          Continue Playing
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {games.map((game) => (
          <article
            key={game.title}
            className="overflow-hidden rounded-lg border border-[rgb(153_247_255/0.12)] bg-[rgb(19_19_19/0.92)]"
          >
            <img
              src={game.image}
              alt={game.title}
              className="h-36 w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-2 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-['Space_Grotesk'] text-base font-medium">
                  {game.title}
                </p>
                <span className="font-['Inter'] text-[10px] tracking-widest text-primary uppercase">
                  {game.subtitle}
                </span>
              </div>
              <Progress
                value={game.progress}
                className="h-2 **:data-[slot=progress-indicator]:bg-[linear-gradient(90deg,rgb(153_247_255)_0%,rgb(0_241_254)_100%)]"
              />
              <p className="font-['Manrope'] text-xs text-muted-foreground">
                {game.progress}% campaign completed
              </p>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function DashboardActivitySection({
  activities,
}: {
  activities: DashboardActivityEntry[];
}) {
  return (
    <Card className="border-[rgb(153_247_255/0.14)] bg-[rgb(26_25_25/0.86)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-['Space_Grotesk'] text-lg">
          <Flame size={16} className="text-primary" />
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <article
            key={`${activity.text}-${activity.when}`}
            className="rounded-lg border border-[rgb(153_247_255/0.1)] bg-[rgb(19_19_19/0.84)] px-3 py-2.5"
          >
            <p className="font-['Manrope'] text-xs text-foreground">
              {activity.text}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 font-['Inter'] text-[10px] tracking-widest text-muted-foreground uppercase">
              <Clock3 size={11} />
              {activity.when}
            </p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function DashboardRecommendationsSection({
  recommendations,
}: {
  recommendations: DashboardRecommendation[];
}) {
  return (
    <Card className="border-[rgb(153_247_255/0.14)] bg-[rgb(26_25_25/0.86)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-['Space_Grotesk'] text-lg">
          <Sparkles size={16} className="text-secondary" />
          Recommended For You
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2.5">
        {recommendations.map((item) => (
          <article
            key={item.title}
            className="group rounded-lg border border-[rgb(153_247_255/0.1)] bg-[rgb(19_19_19/0.85)] p-2.5 transition hover:border-[rgb(153_247_255/0.24)]"
          >
            <div className="mb-2 flex h-14 items-center justify-center rounded-md bg-[linear-gradient(135deg,rgb(153_247_255/0.16)_0%,rgb(191_129_255/0.2)_100%)]">
              <Gamepad2 size={18} className="text-primary" />
            </div>
            <p className="truncate font-['Space_Grotesk'] text-xs text-foreground">
              {item.title}
            </p>
            <Badge
              variant="outline"
              className="mt-1 border-[rgb(153_247_255/0.18)] font-['Inter'] text-[9px] tracking-widest text-muted-foreground uppercase"
            >
              {item.genre}
            </Badge>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function DashboardRankCard() {
  return (
    <Card className="border-[rgb(153_247_255/0.14)] bg-[rgb(26_25_25/0.86)]">
      <CardContent className="py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-['Space_Grotesk'] text-base">Vault Rank</p>
            <p className="font-['Manrope'] text-xs text-muted-foreground">
              Elite Curator Tier
            </p>
          </div>
          <Badge className="gap-1 rounded-full bg-[rgb(153_247_255/0.15)] font-['Inter'] text-[10px] tracking-widest text-primary uppercase hover:bg-[rgb(153_247_255/0.15)]">
            <Trophy size={12} />
            Rank 07
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
