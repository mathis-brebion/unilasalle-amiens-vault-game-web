import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export type OwnedGame = {
  id: string;
  title: string;
  hoursPlayed: number;
  achievementProgress: string;
  progress: number;
  image: string;
};

export function DashboardRecentlyPlayedSection({
  games,
}: {
  games: OwnedGame[];
}) {
  return (
    <Card className="surface-dashboard-card">
      <CardHeader>
        <CardTitle className="font-heading text-lg">My Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {games.length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              No games available yet. Your collection will appear here once the
              database is connected.
            </p>
          ) : null}

          {games.map((game) => (
            <article
              key={game.id}
              className="group overflow-hidden rounded-lg border border-[rgb(153_247_255/0.12)] bg-[rgb(19_19_19/0.9)] transition hover:-translate-y-0.5 hover:border-[rgb(153_247_255/0.26)]"
            >
              <img
                src={game.image}
                alt={game.title}
                className="h-32 w-full object-cover"
                loading="lazy"
              />
              <div className="space-y-2 px-3 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-heading text-sm font-medium">
                    {game.title}
                  </p>
                  <span className="text-ui-meta tracking-widest text-muted-foreground">
                    {game.progress}%
                  </span>
                </div>
                <p className="font-sans text-xs text-muted-foreground">
                  {game.hoursPlayed}h played · {game.achievementProgress}
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
