import { CircleUserRound, KeyRound, LockKeyholeOpen, Mail } from "lucide-react";
import { AuthInputField } from "@/components/auth/AuthInputField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function SignUpPage() {
  return (
    <form className="grid gap-5" onSubmit={(event) => event.preventDefault()}>
      <AuthInputField
        label="IDENTIFICATION TAG"
        icon={CircleUserRound}
        inputProps={{
          type: "text",
          placeholder: "ENTER USERNAME",
          required: true,
          minLength: 3,
        }}
      />

      <AuthInputField
        label="NEURAL EMAIL"
        icon={Mail}
        inputProps={{
          type: "email",
          placeholder: "NODE@NETWORK.COM",
          required: true,
        }}
      />

      <AuthInputField
        label="ACCESS CIPHER"
        icon={LockKeyholeOpen}
        inputProps={{
          type: "password",
          placeholder: "********",
          required: true,
          minLength: 8,
        }}
      />

      <AuthInputField
        label="CONFIRM CIPHER"
        icon={KeyRound}
        inputProps={{
          type: "password",
          placeholder: "********",
          required: true,
          minLength: 8,
        }}
      />

      <div className="grid grid-cols-[auto_1fr] items-start gap-2 pt-1">
        <Checkbox id="terms" required className="mt-0.5" />
        <Label
          htmlFor="terms"
          className="font-['Manrope'] text-[11px] leading-relaxed text-muted-foreground"
        >
          I ACKNOWLEDGE THE TERMS OF THE <em className="not-italic text-primary">VAULT GAME PROTOCOL</em> AND CONSENT TO DATA SYNCHRONIZATION.
        </Label>
      </div>

      <Button type="submit" size="lg" className="mt-1 w-full cursor-pointer">
        INITIATE REGISTRATION
      </Button>
    </form>
  );
}
