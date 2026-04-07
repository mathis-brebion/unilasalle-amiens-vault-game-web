import { CircleUserRound, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthInputField } from "@/components/auth/AuthInputField";
import { Button } from "@/components/ui/button";

export function SignInPage() {
  const navigate = useNavigate();

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        navigate("/dashboard");
      }}
    >
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

      <Button type="submit" size="lg" className="mt-1 w-full cursor-pointer">
        INITIATE AUTHENTICATION
      </Button>
    </form>
  );
}
