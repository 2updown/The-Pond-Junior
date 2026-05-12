"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, ListChecks, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavItem {
  href: string;
  label: string;
  match: string[];
  Icon: React.ComponentType<{ className?: string }>;
}

const ITEMS: BottomNavItem[] = [
  { href: "/consultations", label: "상담목록", match: ["/consultations"], Icon: Calendar },
  { href: "/students", label: "학생목록", match: ["/students", "/student/"], Icon: Users },
  { href: "/todos", label: "할일목록", match: ["/todos", "/todo/"], Icon: ListChecks },
  { href: "/account", label: "계정", match: ["/account"], Icon: User },
];

export function BottomNav() {
  const pathname = usePathname() || "";
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-20 grid w-full max-w-[480px] -translate-x-1/2 grid-cols-4 border-t border-divider bg-white pt-2 pb-[max(6px,env(safe-area-inset-bottom))]"
    >
      {ITEMS.map((item) => {
        const active = item.match.some((m) => pathname === m || pathname.startsWith(m));
        const { Icon } = item;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-1 text-[11px] font-semibold",
              active ? "text-brand-500" : "text-ink-tertiary"
            )}
          >
            <Icon className="h-[22px] w-[22px]" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
