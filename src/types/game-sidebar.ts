import type { LucideIcon } from "lucide-react";

export type GameSidebarMenuItem =
  | "collection"
  | "wishlist"
  | "add-game"
  | "settings";

export type GameSidebarMenuEntry = {
  id: GameSidebarMenuItem;
  label: string;
  Icon: LucideIcon;
};

export type GameSidebarMenuProps = {
  activeItem?: GameSidebarMenuItem;
  onItemSelect?: (item: GameSidebarMenuItem) => void;
  userName?: string;
  userStatus?: string;
  className?: string;
};
