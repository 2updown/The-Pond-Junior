"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Shield, UserCog } from "lucide-react";
import { LogoMark } from "./landing/header";

/**
 * 글로벌 상단 GNB — PC 전용.
 * 좌측: 로고 + 학원명 (랜딩으로 이동), 우측: 모드 전환 + 로그아웃.
 * 사이드바와 페이지 콘텐츠 위에 풀너비로 sticky 배치.
 */
export function GlobalNavbar() {
  const router = useRouter();
  const pathname = usePathname() || "";

  const isAdminMode = pathname.startsWith("/admin");
  const modeTargetHref = isAdminMode ? "/consultations" : "/admin/notices";
  const ModeIcon = isAdminMode ? UserCog : Shield;
  const modeLabel = isAdminMode ? "선생님 모드 전환" : "관리자 모드 전환";

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠어요?")) {
      localStorage.removeItem("pond_logged_in");
      router.push("/");
    }
  };

  return (
    <div className="sticky top-0 z-50 hidden h-16 w-full items-center justify-between border-b border-divider bg-white px-6 md:flex">
      {/* Left — logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <LogoMark />
        <span className="text-[15px] font-bold tracking-tight">레티튜초등학교</span>
      </Link>

      {/* Right — mode toggle + logout */}
      <div className="flex items-center gap-2">
        <Link
          href={modeTargetHref}
          className="flex items-center gap-1.5 rounded-md border border-divider bg-white px-3 py-2 text-sm font-medium text-ink-primary hover:bg-muted"
        >
          <ModeIcon className="h-4 w-4" />
          {modeLabel}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-ink-primary hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </div>
  );
}
