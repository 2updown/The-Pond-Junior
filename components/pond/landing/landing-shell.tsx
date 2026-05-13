"use client";

import * as React from "react";
import { LandingHeader } from "./header";
import { Hero } from "./hero";
import { HomeTeaser } from "./home-teaser";
import { CtaBanner } from "./cta-banner";
import { LandingFooter } from "./footer";
import { LoginModal } from "./login-modal";

interface LoginContextValue {
  open: () => void;
}

const LoginContext = React.createContext<LoginContextValue | null>(null);

export function useLogin() {
  const ctx = React.useContext(LoginContext);
  if (!ctx) throw new Error("useLogin must be used within LandingShell");
  return ctx;
}

interface LandingShellProps {
  /** Optional content to render between header and footer. Falls back to home sections. */
  children?: React.ReactNode;
}

export function LandingShell({ children }: LandingShellProps) {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const open = React.useCallback(() => setLoginOpen(true), []);
  const close = React.useCallback(() => setLoginOpen(false), []);

  return (
    <LoginContext.Provider value={{ open }}>
      <div className="min-h-screen bg-white">
        <LandingHeader />
        <main>
          {children ?? (
            <>
              <Hero />
              <HomeTeaser />
              <CtaBanner />
            </>
          )}
        </main>
        <LandingFooter />
      </div>
      <LoginModal open={loginOpen} onClose={close} />
    </LoginContext.Provider>
  );
}
