export type DashboardKpi = {
  label: string;
  value: number;
  delta: string;
};

export type DashboardGameTile = {
  title: string;
  subtitle: string;
  progress: number;
  image: string;
};

export type DashboardActivityEntry = {
  text: string;
  when: string;
};

export type DashboardRecommendation = {
  title: string;
  genre: string;
};

export const dashboardKpis: DashboardKpi[] = [
  { label: "Total Games", value: 128, delta: "+6 this month" },
  { label: "Completed", value: 42, delta: "+2 this week" },
  { label: "In Progress", value: 15, delta: "3 active now" },
  { label: "Wishlist", value: 8, delta: "2 new drops" },
];

export const recentlyPlayedGames: DashboardGameTile[] = [
  {
    title: "Chrono Drift",
    subtitle: "12h played",
    progress: 68,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Nova Siege",
    subtitle: "6h played",
    progress: 41,
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Abyss Protocol",
    subtitle: "18h played",
    progress: 83,
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Vector Reign",
    subtitle: "3h played",
    progress: 24,
    image:
      "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?auto=format&fit=crop&w=900&q=80",
  },
];

export const continuePlayingGames: DashboardGameTile[] = [
  {
    title: "Void Archive",
    subtitle: "Main Story",
    progress: 74,
    image:
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Sylvan Echo",
    subtitle: "Chapter 4",
    progress: 39,
    image:
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1200&q=80",
  },
];

export const dashboardActivities: DashboardActivityEntry[] = [
  { text: "Unlocked Master of Time in Chrono Drift", when: "2h ago" },
  { text: "Wishlist alert: Nebula Runners now discounted", when: "5h ago" },
  { text: "Friend Orion reached level 40 in Void Archive", when: "Yesterday" },
  { text: "Synced 6 new titles from your launcher", when: "Yesterday" },
];

export const dashboardRecommendations: DashboardRecommendation[] = [
  { title: "Neon Rift", genre: "Action RPG" },
  { title: "Iron Warden", genre: "Strategy" },
  { title: "Moonline", genre: "Action RPG" },
  { title: "Hex Frontier", genre: "Strategy" },
  { title: "Project Atlas", genre: "Action RPG" },
  { title: "Last Outpost", genre: "Strategy" },
];
