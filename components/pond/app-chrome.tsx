"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

/**
 * Renders the persistent PC sidebar — but only on app routes (not landing or auth).
 * Mobile users see nothing here; they use the drawer instead.
 */
export function AppChrome() {
  const pathname = usePathname() || "";
  const isLanding = pathname === "/";
  const isAuth = pathname.startsWith("/login");

  if (isLanding || isAuth) return null;
  return <Sidebar />;
}
