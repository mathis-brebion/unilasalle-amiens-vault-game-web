import type { ReactNode } from "react";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderProps = {
  eyebrow: string;
  title: string;
  centerContent?: ReactNode;
  onLogout?: () => void;
  mobileNavigation?: ReactNode;
  className?: string;
};

export function Header({
  eyebrow,
  title,
  centerContent,
  onLogout,
  mobileNavigation,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "surface-glass rounded-xl px-4 py-3 lg:px-6 lg:py-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-ui-label text-muted-foreground">{eyebrow}</p>
          <h1 className="font-heading text-xl font-semibold text-foreground lg:text-2xl">
            {title}
          </h1>
        </div>
        <div className="ml-auto flex w-full items-center gap-2 md:w-auto">
          {mobileNavigation}
          {centerContent}
          <Button
            size="icon"
            variant="outline"
            className="surface-control h-10 w-10 cursor-pointer"
            aria-label="Open notifications"
          >
            <Bell size={16} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="surface-control h-10 w-10 cursor-pointer"
            aria-label="Logout"
            onClick={onLogout}
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
}
