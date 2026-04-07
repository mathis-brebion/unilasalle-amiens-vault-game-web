import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderProps = {
  eyebrow: string;
  title: string;
  centerContent?: ReactNode;
  profileInitials?: string;
  mobileNavigation?: ReactNode;
  className?: string;
};

export function Header({
  eyebrow,
  title,
  centerContent,
  profileInitials = "VG",
  mobileNavigation,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "rounded-xl border border-[rgb(153_247_255/0.14)] bg-[rgb(19_19_19/0.75)] px-4 py-3 backdrop-blur-xl lg:px-6 lg:py-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="font-['Inter'] text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <h1 className="font-['Space_Grotesk'] text-xl font-semibold text-foreground lg:text-2xl">
            {title}
          </h1>
        </div>
        <div className="ml-auto flex w-full items-center gap-2 md:w-auto">
          {mobileNavigation}
          {centerContent}
          <Button
            size="icon"
            variant="outline"
            className="cursor-pointer h-10 w-10 border-[rgb(72_72_71/0.45)] bg-[rgb(38_38_38/0.5)]"
            aria-label="Open notifications"
          >
            <Bell size={16} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="cursor-pointer h-10 w-10 border-[rgb(72_72_71/0.45)] bg-[rgb(38_38_38/0.5)]"
            aria-label="Open profile menu"
          >
            <Avatar size="sm" className="bg-[rgb(19_19_19/0.95)]">
              <AvatarFallback className="bg-transparent font-['Inter'] text-[10px] text-primary">
                {profileInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
}
