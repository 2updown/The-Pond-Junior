"use client";

import * as React from "react";
import { LandingHeader } from "./header";
import { Hero } from "./hero";
import { Features } from "./features";
import { Programs } from "./programs";
import { Gallery } from "./gallery";
import { NoticeBoard } from "./notice-board";
import { CtaBanner } from "./cta-banner";
import { Location } from "./location";
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

export function LandingShell() {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const open = React.useCallback(() => setLoginOpen(true), []);
  const close = React.useCallback(() => setLoginOpen(false), []);

  return (
    <LoginContext.Provider value={{ open }}>
      <div className="min-h-screen bg-white">
        <LandingHeader />
        <main>
          <Hero />
          <Features />
          <Programs />
          <Gallery />
          <NoticeBoard />
          <CtaBanner />
          <Location />
        </main>
        <LandingFooter />
      </div>
      <LoginModal open={loginOpen} onClose={close} />
    </LoginContext.Provider>
  );
}
