import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthInputFieldProps = {
  label: string;
  icon: LucideIcon;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
};

export function AuthInputField({
  label,
  icon: Icon,
  inputProps,
}: AuthInputFieldProps) {
  const generatedId = useId();
  const inputId = inputProps.id ?? generatedId;

  return (
    <label className="grid gap-1">
      <Label htmlFor={inputId} className="text-ui-kicker text-muted-foreground">
        {label}
      </Label>

      <div className="group flex items-center gap-2 border-b border-border py-3 transition-colors focus-within:border-primary">
        <Icon
          size={18}
          className="text-muted-foreground transition-colors group-focus-within:text-primary"
        />
        <Input id={inputId} {...inputProps} />
      </div>
    </label>
  );
}
