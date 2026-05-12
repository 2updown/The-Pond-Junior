import * as React from "react";
import { cn } from "@/lib/utils";

type AvatarColor = "blue" | "cyan" | "purple" | "green" | "gradient";

const COLORS: Record<AvatarColor, string> = {
  blue: "bg-brand-500",
  cyan: "bg-[#7BB1FF]",
  purple: "bg-[#A78BFA]",
  green: "bg-[#34D399]",
  gradient: "bg-gradient-to-br from-brand-500 to-[#7BB1FF]",
};

interface AvatarProps {
  initial: string;
  color?: AvatarColor;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ initial, color = "blue", size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center justify-center rounded-full font-bold text-white",
        COLORS[color],
        size === "sm" && "h-9 w-9 text-[13px]",
        size === "md" && "h-11 w-11 text-[15px]",
        size === "lg" && "h-14 w-14 text-[18px]",
        className
      )}
    >
      {initial}
    </span>
  );
}
