import * as React from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  /** @deprecated kept for compat; bottom nav has been removed */
  hideBottomNav?: boolean;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className={cn("app-shell", className)}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-3.5 px-5 pt-2 pb-8 md:gap-5 md:px-8 md:pt-6 md:pb-12 lg:px-10">
        {children}
      </div>
    </div>
  );
}
