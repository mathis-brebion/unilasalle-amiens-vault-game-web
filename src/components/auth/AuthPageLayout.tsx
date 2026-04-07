import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import backgroundAuth from "@/assets/background-auth.png";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AuthPageLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.includes("sign-up")
    ? "sign-up"
    : "sign-in";
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    setIsContentVisible(false);

    const frameId = window.requestAnimationFrame(() => {
      setIsContentVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.pathname]);

  return (
    <main className="relative h-svh overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <img
          src={backgroundAuth}
          alt=""
          className="absolute top-[58%] left-1/2 w-4xl max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-44 sm:top-[60%] sm:w-136"
        />
        <div className="bg-linear-to-b absolute inset-0 from-transparent via-background/80 to-background" />
      </div>

      <div className="bg-linear-to-r pointer-events-none fixed top-0 left-0 z-30 h-px w-full from-transparent via-primary/50 to-transparent" />

      <section className="relative z-10 mx-auto flex h-full w-full max-w-lg flex-col justify-center px-6 py-6 sm:px-4">
        <header className="mb-6 text-center sm:mb-5">
          <h1 className="font-heading text-3xl font-bold tracking-[0.18em] text-primary uppercase [text-shadow:0_0_10px_var(--color-primary)] sm:text-2xl">
            Vault Game
          </h1>
        </header>

        <Card>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              navigate(`/${value}`);
            }}
            className="w-full gap-0"
          >
            <TabsList
              variant="line"
              className="h-auto w-full rounded-none border-b border-border/20 bg-transparent p-0"
            >
              <TabsTrigger
                value="sign-in"
                className="relative flex-1 cursor-pointer rounded-none border-none py-5 font-heading text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground data-active:text-primary data-active:after:absolute data-active:after:right-0 data-active:after:-bottom-px data-active:after:left-0 data-active:after:h-0.5 data-active:after:bg-primary data-active:after:shadow-[0_0_8px_var(--color-primary)]"
              >
                LOGIN
              </TabsTrigger>
              <TabsTrigger
                value="sign-up"
                className="relative flex-1 cursor-pointer rounded-none border-none py-5 font-heading text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground data-active:text-primary data-active:after:absolute data-active:after:right-0 data-active:after:-bottom-px data-active:after:left-0 data-active:after:h-0.5 data-active:after:bg-primary data-active:after:shadow-[0_0_8px_var(--color-primary)]"
              >
                SIGN UP
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div
            className={`space-y-5 p-6 transition-all duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none sm:p-5 ${isContentVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
          >
            <Outlet />
          </div>
        </Card>

        <footer className="mt-6 grid gap-2 text-center sm:mt-5">
          <p className="text-ui-meta inline-flex items-center justify-center gap-1 text-muted-foreground/70">
            <ShieldCheck size={12} /> ENCRYPTED END-TO-END VIA VAULT-SECURE
            LAYER 7
          </p>
          <div className="text-ui-meta inline-flex items-center justify-center gap-2 text-muted-foreground/70">
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <Separator
              orientation="vertical"
              className="h-3 bg-muted-foreground/45"
            />
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
          </div>
          <small className="text-ui-meta-compact text-muted-foreground/45">
            Copyright 2026 Vault Game
          </small>
        </footer>
      </section>
    </main>
  );
};
