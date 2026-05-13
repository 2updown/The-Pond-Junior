"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, ChevronLeft, LogOut } from "lucide-react";
import { useDrawer } from "./drawer";
import { WriteButton } from "./write-button";
import type { PostKind } from "@/lib/posts-store";

interface TopbarProps {
  title: string;
  variant?: "menu" | "back";
  right?: React.ReactNode;
  onBack?: () => void;
  /** Hide the global 글쓰기 button on this page (e.g. detail pages). */
  hideWriteButton?: boolean;
  /** Override the default post kind opened by the 글쓰기 modal. */
  writeKind?: PostKind;
}

// Pathname-based default kind so 글쓰기 modal opens with the right category preselected.
function defaultKindFor(pathname: string): PostKind {
  if (pathname.startsWith("/community")) return "notice";
  if (pathname.startsWith("/board")) return "notice";
  if (pathname.startsWith("/learning")) return "notice";
  return "notice";
}

export function Topbar({ title, variant = "menu", right, onBack, hideWriteButton, writeKind }: TopbarProps) {
  const router = useRouter();
  const { open } = useDrawer();
  const pathname = usePathname() || "";

  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname.startsWith("/login");
  const isDetail = /\/(consultation|student|todo)\/[^/]+/.test(pathname) || pathname.startsWith("/account/");
  // 글쓰기 button shows only in teacher mode top-level menus, not admin/auth/detail
  const showWrite = !hideWriteButton && !isAdmin && !isAuth && !isDetail;

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

      {/* Title */}
      <span className="text-[17px] font-semibold tracking-tight md:text-2xl md:font-bold">
        {title}
      </span>

      {/* Right area */}
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 md:right-8 md:gap-2">
        {right}
        {showWrite && (
          <>
            {/* Mobile icon-only */}
            <WriteButton
              iconOnly
              defaultKind={writeKind || defaultKindFor(pathname)}
              className="md:hidden"
            />
            {/* PC label */}
            <WriteButton
              defaultKind={writeKind || defaultKindFor(pathname)}
              className="hidden md:flex"
            />
          </>
        )}
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
