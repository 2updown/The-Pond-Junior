"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { GlobalNavbar } from "./global-navbar";

const PUBLIC_EXACT = new Set(["/"]);
const PUBLIC_PREFIXES = ["/about", "/programs", "/gallery", "/notices", "/location"];

/**
 * Renders the persistent PC GNB + sidebar only for app routes (teacher / admin).
 * Public landing pages and login flow show nothing.
 */
export function AppChrome() {
  const pathname = usePathname() || "";
  const isPublic =
    PUBLIC_EXACT.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAuth = pathname.startsWith("/login");

  if (isPublic || isAuth) return null;
  return (
    <>
      <GlobalNavbar />
      <Sidebar />
    </>
  );
}
