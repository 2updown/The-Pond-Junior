"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { listAcademies } from "@/lib/hq-academies-store";

// Public routes that should be gated by the HQ-controlled landing toggle.
const PUBLIC_EXACT = new Set(["/"]);
const PUBLIC_PREFIXES = ["/about", "/programs", "/gallery", "/notices", "/location"];

// For the demo deployment, treat the first academy (강남점) as "this site".
// In production this would be derived from the request domain / academy ID.
const SITE_ACADEMY_ID = "ac1";

function isPublicLanding(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

/**
 * Watches the HQ landing-enabled flag for this site's academy and redirects
 * landing-page visitors to /login when the flag is off. The flag is owned by
 * the HQ console (/hq/landing) and stored in localStorage via hq-academies-store.
 *
 * Demo behavior:
 * - localStorage state is browser-local — toggling in one browser only affects
 *   that browser's public pages. In production this would be a server lookup.
 */
export function LandingGuard() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  React.useEffect(() => {
    if (!isPublicLanding(pathname)) return;

    const check = () => {
      const academies = listAcademies();
      const site = academies.find((a) => a.id === SITE_ACADEMY_ID);
      // Default to true if record missing (don't accidentally lock people out).
      const enabled = site ? site.landingEnabled : true;
      if (!enabled) {
        router.replace("/login");
      }
    };

    check();

    // Re-check whenever HQ toggles the flag (same-tab + other tabs).
    const onChange = () => check();
    window.addEventListener("pond:hq-academies-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("pond:hq-academies-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [pathname, router]);

  return null;
}
