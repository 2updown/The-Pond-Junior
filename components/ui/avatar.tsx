import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  className,
  src,
  alt,
  fallback,
  size = 36,
}: {
  className?: string;
  src?: string;
  alt?: string;
  fallback: string;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-medium text-muted-foreground",
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || ""}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}
