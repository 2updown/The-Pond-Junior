"use client";

import * as React from "react";
import { LandingHeader } from "./header";
import { Hero } from "./hero";
import { HomeTeaser } from "./home-teaser";
import { CtaBanner } from "./cta-banner";
import { LandingFooter } from "./footer";
import { LoginModal } from "./login-modal";
import { ContactModal } from "./contact-modal";

interface LoginContextValue {
  open: () => void;
}
interface ContactContextValue {
  open: () => void;
}

const LoginContext = React.createContext<LoginContextValue | null>(null);
const ContactContext = React.createContext<ContactContextValue | null>(null);

export function useLogin() {
  const ctx = React.useContext(LoginContext);
  if (!ctx) throw new Error("useLogin must be used within LandingShell");
  return ctx;
}

export function useContact() {
  const ctx = React.useContext(ContactContext);
  if (!ctx) throw new Error("useContact must be used within LandingShell");
  return ctx;
}

interface LandingShellProps {
  children?: React.ReactNode;
}

export function LandingShell({ children }: LandingShellProps) {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [contactOpen, setContactOpen] = React.useState(false);

  const openLogin = React.useCallback(() => setLoginOpen(true), []);
  const closeLogin = React.useCallback(() => setLoginOpen(false), []);
  const openContact = React.useCallback(() => setContactOpen(true), []);
  const closeContact = React.useCallback(() => setContactOpen(false), []);

  return (
    <LoginContext.Provider value={{ open: openLogin }}>
      <ContactContext.Provider value={{ open: openContact }}>
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
        <LoginModal open={loginOpen} onClose={closeLogin} />
        <ContactModal open={contactOpen} onClose={closeContact} />
      </ContactContext.Provider>
    </LoginContext.Provider>
  );
}
