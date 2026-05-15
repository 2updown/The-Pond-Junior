"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { HqNavbar } from "@/components/pond/hq-navbar";
import { HqSidebar } from "@/components/pond/hq-sidebar";

const LOGIN_PATH = "/hq/login";

export default function HqLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const isLoginPage = pathname === LOGIN_PATH || pathname.startsWith(LOGIN_PATH + "/");

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [authChecked, setAuthChecked] = React.useState(false);

  // Auth guard — runs only for protected /hq/* routes (not /hq/login itself)
  React.useEffect(() => {
    if (isLoginPage) {
      setAuthChecked(true);
      return;
    }
    const ok = typeof window !== "undefined" && localStorage.getItem("pond_hq_logged_in") === "1";
    if (!ok) {
      router.replace(LOGIN_PATH);
      return;
    }
    setAuthChecked(true);
  }, [isLoginPage, pathname, router]);

  // Login page renders without HQ chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // While checking auth, render nothing to avoid flashing the protected layout
  if (!authChecked) {
    return <div className="min-h-screen bg-[#F5F7FB]" />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <HqNavbar onToggleMobileSidebar={() => setMobileOpen(true)} />
      <HqSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* main content area — leaves 240px gutter on the left on desktop for the fixed sidebar */}
      <main className="px-4 py-6 md:ml-[240px] md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-[1200px]">{children}</div>
      </main>
    </div>
  );
}
