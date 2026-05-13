"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Menu, ChevronLeft, LogOut } from "lucide-react";
import { useDrawer } from "./drawer";

interface TopbarProps {
  title: string;
  variant?: "menu" | "back";
  right?: React.ReactNode;
  onBack?: () => void;
  /** @deprecated 글쓰기 버튼은 더 이상 Topbar에 렌더되지 않습니다 (랜딩 섹션으로 이동). */
  hideWriteButton?: boolean;
  /** @deprecated Topbar 글쓰기 버튼은 제거됨. */
  writeKind?: string;
}

export function Topbar({ title, variant = "menu", right, onBack }: TopbarProps) {
  const router = useRouter();
  const { open } = useDrawer();

  const handleLeft = () => {
    if (variant === "menu") open();
    else if (onBack) onBack();
    else router.back();
  };

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠어요?")) {
      localStorage.removeItem("pond_logged_in");
      router.push("/");
    }
  };

  return (
    <div className="topbar relative">
      {/* Left button — mobile only */}
      <button
        onClick={handleLeft}
        aria-label={variant === "menu" ? "전체 메뉴" : "뒤로"}
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-ink-primary md:hidden"
      >
        {variant === "menu" ? (
          <Menu className="h-[22px] w-[22px]" />
        ) : (
          <ChevronLeft className="h-6 w-6" />
        )}
      </button>

      <span className="text-[17px] font-semibold tracking-tight md:text-2xl md:font-bold">
        {title}
      </span>

      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 md:right-8 md:gap-2">
        {right}
        {/* PC-only logout */}
        <button
          onClick={handleLogout}
          className="ml-1 hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-ink-primary hover:bg-muted md:flex"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </div>
  );
}
