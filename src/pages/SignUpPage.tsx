import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function SignUpPage() {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="grid gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
          await register();
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <p className="font-sans text-sm leading-relaxed text-muted-foreground">
        Create your account in Keycloak and come back authenticated with a valid
        identity token.
      </p>

      <Button type="submit" size="lg" className="mt-1 w-full cursor-pointer">
        {isSubmitting ? "REDIRECTING..." : "REGISTER WITH KEYCLOAK"}
      </Button>
    </form>
  );
}
