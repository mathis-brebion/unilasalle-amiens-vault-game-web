import { CircleUserRound, KeyRound, LockKeyholeOpen, Mail } from "lucide-react";
import { AuthInputField } from "@/components/auth/AuthInputField";
import { Button } from "@/components/ui/button";

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

      <label className="grid grid-cols-[auto_1fr] items-start gap-2 pt-1">
        <input
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span className="font-['Manrope'] text-[11px] leading-relaxed text-muted-foreground">
          I ACKNOWLEDGE THE TERMS OF THE{" "}
          <em className="not-italic text-primary">VAULT GAME PROTOCOL</em> AND
          CONSENT TO DATA SYNCHRONIZATION.
        </span>
      </label>

      <Button type="submit" size="lg" className="mt-1 w-full">
        INITIATE REGISTRATION
      </Button>
    </form>
  );
}
