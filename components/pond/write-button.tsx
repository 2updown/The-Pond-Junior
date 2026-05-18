"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PenSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostKind } from "@/lib/posts-store";

interface WriteButtonProps {
  /** Pre-selected post kind. Navigates to /write?kind=... */
  defaultKind?: PostKind;
  className?: string;
  /** Compact icon-only variant. */
  iconOnly?: boolean;
}

export function WriteButton({
  defaultKind = "notice",
  className,
  iconOnly = false,
}: WriteButtonProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/write?kind=${defaultKind}`);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="글쓰기"
      className={cn(
        iconOnly
          ? "flex h-9 w-9 items-center justify-center rounded-md text-ink-primary hover:bg-muted"
          : "flex items-center gap-1.5 rounded-md bg-brand-500 px-3 py-2 text-[13px] font-semibold text-white hover:bg-brand-600",
        className
      )}
    >
      {iconOnly ? (
        <Plus className="h-[20px] w-[20px]" />
      ) : (
        <>
          <PenSquare className="h-4 w-4" />
          <span>글쓰기</span>
        </>
      )}
    </button>
  );
}
