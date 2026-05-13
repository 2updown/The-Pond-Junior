"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Menu, ChevronLeft } from "lucide-react";
import { useDrawer } from "./drawer";

interface TopbarProps {
  title: string;
  variant?: "menu" | "back";
  right?: React.ReactNode;
  onBack?: () => void;
  /** @deprecated kept for compat */
  hideWriteButton?: boolean;
  /** @deprecated kept for compat */
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

      {right && (
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 md:right-8 md:gap-2">
          {right}
        </div>
      )}
    </div>
  );
}
