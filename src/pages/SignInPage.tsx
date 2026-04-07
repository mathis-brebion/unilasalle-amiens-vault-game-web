import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function SignInPage() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="grid gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
          await login();
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <p className="font-sans text-sm leading-relaxed text-muted-foreground">
        Authenticate with the secure Keycloak identity gateway to access your
        synchronized vault.
      </p>

      <Button type="submit" size="lg" className="mt-1 w-full cursor-pointer">
        {isSubmitting ? "REDIRECTING..." : "CONTINUE WITH KEYCLOAK"}
      </Button>
    </form>
  );
}
