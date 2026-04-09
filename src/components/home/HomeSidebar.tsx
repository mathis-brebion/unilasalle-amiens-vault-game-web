import { cn } from "@/lib/utils";
import { Grid2x2, PlusSquare, SlidersHorizontal, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type {
  GameSidebarMenuEntry,
  GameSidebarMenuProps,
} from "@/types/game-sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

export type {
  GameSidebarMenuItem,
  GameSidebarMenuProps,
} from "@/types/game-sidebar";

const MENU_ENTRIES: GameSidebarMenuEntry[] = [
  { id: "collection", label: "My Collection", Icon: Grid2x2 },
  { id: "wishlist", label: "Wishlist", Icon: Sparkles },
  { id: "add-game", label: "Add Game", Icon: PlusSquare },
  { id: "settings", label: "Settings", Icon: SlidersHorizontal },
];

const MENU_ROUTES: Partial<Record<GameSidebarMenuEntry["id"], string>> = {
  collection: "/dashboard",
  "add-game": "/dashboard/add-game",
};

export function HomeSidebar({
  activeItem = "add-game",
  onItemSelect,
  className,
}: GameSidebarMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item: GameSidebarMenuEntry["id"]) => {
    const targetRoute = MENU_ROUTES[item];

    if (targetRoute && targetRoute !== location.pathname) {
      navigate(targetRoute);
    }

    onItemSelect?.(item);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20rem",
        } as React.CSSProperties
      }
      className={cn("min-h-140 w-full max-w-[320px]", className)}
    >
      <Sidebar
        collapsible="none"
        className={cn(
          "rounded-xl border border-[rgb(153_247_255/0.14)]",
          "bg-[linear-gradient(180deg,rgb(19_19_19/0.88)_0%,rgb(14_14_14/0.94)_100%)] backdrop-blur-xl",
        )}
        aria-label="Primary navigation"
      >
        <SidebarHeader className="mb-2 space-y-2 border-b border-[rgb(72_72_71/0.35)] px-4 pt-4 pb-5">
          <p className="font-heading text-xs tracking-[0.22em] text-primary/90 uppercase">
            The Curator
          </p>
          <div className="space-y-0.5">
            <h2 className="font-heading text-xl font-semibold tracking-[0.02em] text-foreground">
              Elite Library
            </h2>
            <p className="text-ui-meta tracking-[0.18em] text-muted-foreground">
              Neon Sanctum
            </p>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2" aria-label="Additional links">
          <SidebarGroup className="px-2">
            <SidebarMenu className="gap-2">
              {MENU_ENTRIES.map(({ id, label, Icon }) => {
                const isActive = id === activeItem;

                return (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton
                      type="button"
                      isActive={isActive}
                      onClick={() => handleItemClick(id)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "h-auto cursor-pointer gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-normal",
                        "text-muted-foreground hover:bg-[rgb(153_247_255/0.08)] hover:text-foreground",
                        isActive &&
                          "bg-[linear-gradient(135deg,rgb(153_247_255/0.2)_0%,rgb(0_241_254/0.12)_100%)] text-primary",
                        isActive &&
                          "shadow-[inset_0_0_0_1px_rgb(153_247_255/0.22),0_0_20px_rgb(153_247_255/0.16)]",
                      )}
                    >
                      <Icon
                        size={17}
                        className={cn(
                          "text-muted-foreground transition-colors group-hover/menu-button:text-primary",
                          isActive && "text-primary",
                        )}
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

      </Sidebar>
    </SidebarProvider>
  );
}
