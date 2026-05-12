"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SegmentProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function Segment<T extends string>({ options, value, onChange }: SegmentProps<T>) {
  return (
    <div
      className="grid gap-1 rounded-md bg-muted p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-[10px] py-2.5 text-sm font-semibold transition-colors",
            opt.value === value
              ? "bg-white text-ink-primary shadow-elev2"
              : "text-ink-tertiary"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
