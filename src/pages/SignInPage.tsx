import { CircleUserRound, Lock } from "lucide-react";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { AuthInputField } from "@/components/auth/AuthInputField";
import { Button } from "@/components/ui/button";

export function SignInPage() {
  return (
    <AuthPageLayout activeTab="sign-in">
      <form className="grid gap-5" onSubmit={(event) => event.preventDefault()}>
        <AuthInputField
          label="IDENTIFICATION TAG"
          icon={CircleUserRound}
          inputProps={{
            type: "text",
            placeholder: "PLAYER_ONE",
            required: true,
          }}
        />

        <AuthInputField
          label="ACCESS CIPHER"
          icon={Lock}
          inputProps={{
            type: "password",
            placeholder: "************",
            required: true,
          }}
        />

        <Button type="submit" size="lg" className="mt-1 w-full">
          INITIATE AUTHENTICATION
        </Button>
      </form>
    </AuthPageLayout>
  );
}
