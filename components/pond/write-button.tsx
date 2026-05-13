"use client";

import * as React from "react";
import { PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { WriteModal } from "./write-modal";
import type { PostKind } from "@/lib/posts-store";

interface WriteButtonProps {
  /** Pre-selected post kind in the modal. */
  defaultKind?: PostKind;
  className?: string;
  /** Compact icon-only variant for mobile topbar. */
  iconOnly?: boolean;
}

export function WriteButton({ defaultKind = "notice", className, iconOnly = false }: WriteButtonProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="글쓰기"
        className={cn(
          iconOnly
            ? "flex h-9 w-9 items-center justify-center text-ink-primary hover:bg-muted rounded-md"
            : "flex items-center gap-1.5 rounded-md bg-brand-500 px-3 py-2 text-[13px] font-semibold text-white hover:bg-brand-600",
          className
        )}
      >
        <PenSquare className={iconOnly ? "h-[20px] w-[20px]" : "h-4 w-4"} />
        {!iconOnly && <span>글쓰기</span>}
      </button>
      <WriteModal open={open} onClose={() => setOpen(false)} defaultKind={defaultKind} />
    </>
  );
}
