import * as React from "react";
import { cn } from "@/lib/utils";

interface InfoBoxProps {
  children: React.ReactNode;
  variant?: "muted" | "brand";
  className?: string;
}

export function InfoBox({ children, variant = "muted", className }: InfoBoxProps) {
  return (
    <div
      className={cn(
        "rounded-md px-4 py-4 text-[12.5px] leading-relaxed",
        variant === "muted" && "bg-muted text-ink-secondary",
        variant === "brand" && "bg-brand-50 text-brand-600",
        className
      )}
    >
      {children}
    </div>
  );
}
