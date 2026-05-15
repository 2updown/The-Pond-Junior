"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, LogOut, Menu, User2 } from "lucide-react";

interface HqNavbarProps {
  onToggleMobileSidebar?: () => void;
}

export function HqNavbar({ onToggleMobileSidebar }: HqNavbarProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("pond_hq_email") || "");
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pond_hq_logged_in");
      localStorage.removeItem("pond_hq_email");
    }
    router.replace("/hq/login");
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-[#1E293B] bg-[#0F172A] px-4 text-white md:h-16 md:px-6">
      {/* Left — logo + mode badge */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10 md:hidden"
          aria-label="메뉴 열기"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/hq" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500">
            <Building2 className="h-4 w-4 text-white" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold tracking-wide">THE POND HQ</span>
            <span className="hidden text-[10.5px] font-medium text-white/60 md:block">
              본사 운영 콘솔
            </span>
          </div>
        </Link>

        <span className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10.5px] font-semibold text-white/85 md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          본사 모드
        </span>
      </div>

      {/* Right — current operator + logout */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {email && (
          <span className="hidden items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[12px] font-medium text-white/80 md:inline-flex">
            <User2 className="h-3.5 w-3.5 text-white/60" />
            {email}
          </span>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1.5 text-[12.5px] font-medium text-white hover:bg-white/15 md:px-3"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden md:inline">로그아웃</span>
        </button>
      </div>
    </header>
  );
}
