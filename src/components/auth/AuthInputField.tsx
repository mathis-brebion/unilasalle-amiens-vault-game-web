import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

type AuthInputFieldProps = {
  label: string;
  icon: LucideIcon;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
};

export const AuthInputField: React.FC<AuthInputFieldProps> = ({
  label,
  icon: Icon,
  inputProps,
}) => {
  return (
    <label className="grid gap-1">
      <span className="font-['Space_Grotesk'] text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
        {label}
      </span>
      <div className="group flex items-center gap-2 border-b border-border py-3 transition-colors focus-within:border-primary">
        <Icon
          size={18}
          className="text-muted-foreground transition-colors group-focus-within:text-primary"
        />
        <Input {...inputProps} />
      </div>
    </label>
  );
};
