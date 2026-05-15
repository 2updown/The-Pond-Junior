"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { GlobalNavbar } from "./global-navbar";

const PUBLIC_EXACT = new Set(["/"]);
const PUBLIC_PREFIXES = ["/about", "/programs", "/gallery", "/notices", "/location"];

/**
 * Renders the persistent PC GNB + sidebar only for app routes (teacher / admin).
 * Public landing pages, login flow, and HQ (which has its own chrome) show nothing.
 */
export function AppChrome() {
  const pathname = usePathname() || "";
  const isPublic =
    PUBLIC_EXACT.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAuth = pathname.startsWith("/login");
  // HQ has its own dedicated layout (app/hq/layout.tsx)
  const isHq = pathname === "/hq" || pathname.startsWith("/hq/");

  if (isPublic || isAuth || isHq) return null;
  return (
    <>
      <GlobalNavbar />
      <Sidebar />
    </>
  );
}
