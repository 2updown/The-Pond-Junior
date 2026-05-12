"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLogin } from "./landing-shell";

export function LandingHeader() {
  const login = useLoginSafe();
  const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setLoggedIn(typeof window !== "undefined" && localStorage.getItem("pond_logged_in") === "true");
  }, [pathname]);

  const navLinks = [
    { href: "#about", label: "학원소개" },
    { href: "#programs", label: "프로그램" },
    { href: "#gallery", label: "갤러리" },
    { href: "#notices", label: "공지사항" },
    { href: "#location", label: "오시는 길" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <div className="leading-tight">
            <div className="text-[15px] font-bold tracking-tight">레티튜초등학교</div>
            <div className="text-[10px] text-ink-tertiary">프리미엄 교육 파트너</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[13px] font-medium text-ink-primary hover:text-brand-500"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {loggedIn ? (
            <Link
              href="/consultations"
              className="rounded-md bg-brand-500 px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-600"
            >
              관리페이지
            </Link>
          ) : (
            <button
              onClick={login?.open}
              className="rounded-md border border-brand-500 px-4 py-2 text-[13px] font-semibold text-brand-500 hover:bg-brand-50"
            >
              로그인
            </button>
          )}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="메뉴"
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink-primary hover:bg-muted md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-divider bg-white md:hidden">
          <ul className="mx-auto max-w-6xl px-5 py-3">
            {navLinks.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-sm font-medium text-ink-primary"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

/** Header is also used in footer where LoginContext might not be present. */
function useLoginSafe() {
  try {
    return useLogin();
  } catch {
    return null;
  }
}

export function LogoMark() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-[#7BB1FF] shadow-elev3">
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M2 14c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
          stroke="#fff"
          strokeOpacity="0.65"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
