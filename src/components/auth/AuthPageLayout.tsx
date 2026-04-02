import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import backgroundAuth from "@/assets/background-auth.png";
import { Card } from "@/components/ui/card";

const tabClassName =
  "flex-1 py-5 text-center font-['Space_Grotesk'] text-xs tracking-[0.2em] uppercase transition-colors hover:text-foreground";

const activeTabClassName =
  "relative text-primary after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:shadow-[0_0_8px_rgb(153_247_255)]";

const inactiveTabClassName = "text-muted-foreground";

export const AuthPageLayout = () => {
  const location = useLocation();
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
        <div className="bg-linear-to-b absolute inset-0 from-transparent via-[rgb(14_14_14/0.78)] to-background" />
      </div>

      <div className="bg-linear-to-r pointer-events-none fixed top-0 left-0 z-30 h-px w-full from-transparent via-[rgb(153_247_255/0.5)] to-transparent" />

      <section className="relative z-10 mx-auto flex h-full w-full max-w-lg flex-col justify-center px-6 py-6 sm:px-4">
        <header className="mb-6 text-center sm:mb-5">
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[0.18em] text-primary uppercase [text-shadow:0_0_10px_rgb(0_242_255/0.6)] sm:text-2xl">
            Vault Game
          </h1>
        </header>

        <Card>
          <nav
            className="flex border-b border-[rgb(72_72_71/0.2)]"
            aria-label="Authentication tabs"
          >
            <Link
              to="/sign-in"
              className={`${tabClassName} ${activeTab === "sign-in" ? activeTabClassName : inactiveTabClassName}`}
            >
              LOGIN
            </Link>
            <Link
              to="/sign-up"
              className={`${tabClassName} ${activeTab === "sign-up" ? activeTabClassName : inactiveTabClassName}`}
            >
              SIGN UP
            </Link>
          </nav>

          <div
            className={`space-y-5 p-6 transition-all duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none sm:p-5 ${isContentVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
          >
            <Outlet />
          </div>
        </Card>

        <footer className="mt-6 grid gap-2 text-center sm:mt-5">
          <p className="inline-flex items-center justify-center gap-1 font-['Inter'] text-[10px] tracking-[0.12em] text-[rgb(173_170_170/0.68)] uppercase">
            <ShieldCheck size={12} /> ENCRYPTED END-TO-END VIA VAULT-SECURE
            LAYER 7
          </p>
          <div className="inline-flex items-center justify-center gap-2 font-['Inter'] text-[10px] tracking-[0.12em] text-[rgb(173_170_170/0.68)] uppercase">
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <span>|</span>
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
          </div>
          <small className="font-['Inter'] text-[9px] tracking-[0.16em] text-[rgb(173_170_170/0.46)] uppercase">
            Copyright 2026 Vault Game
          </small>
        </footer>
      </section>
    </main>
  );
};
