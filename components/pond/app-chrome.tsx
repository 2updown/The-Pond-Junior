"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

const PUBLIC_PATHS = new Set([
  "/",
  "/about",
  "/programs",
  "/gallery",
  "/notices",
  "/location",
]);

/**
 * Renders the persistent PC sidebar only for app routes (teacher / admin).
 * Public landing pages and login flow show nothing here.
 */
export function AppChrome() {
  const pathname = usePathname() || "";
  const isPublic = PUBLIC_PATHS.has(pathname);
  const isAuth = pathname.startsWith("/login");

  if (isPublic || isAuth) return null;
  return <Sidebar />;
}
