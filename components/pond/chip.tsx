import * as React from "react";
import { cn } from "@/lib/utils";

type ChipVariant = "scheduled" | "done" | "canceled" | "warning" | "muted" | "role";

const VARIANTS: Record<ChipVariant, string> = {
  scheduled: "bg-brand-50 text-brand-600",
  done: "bg-emerald-50 text-emerald-700",
  canceled: "bg-rose-50 text-rose-700",
  warning: "bg-amber-50 text-amber-700",
  muted: "bg-muted text-ink-tertiary",
  role: "bg-brand-50 text-brand-600",
};

interface ChipProps {
  variant?: ChipVariant;
  children: React.ReactNode;
  className?: string;
}

export function Chip({ variant = "scheduled", children, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-[3px] text-[11px] font-semibold",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
