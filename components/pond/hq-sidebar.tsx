"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  Building2,
  Megaphone,
  Globe,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HQ_MENU, findHqActiveItem } from "./hq-menu-config";

const HQ_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "hq-dashboard": LayoutDashboard,
  "hq-academies": Building2,
  "hq-notices": Megaphone,
  "hq-landing": Globe,
};

interface HqSidebarProps {
  /** Mobile drawer open state */
  mobileOpen?: boolean;
  /** Called when user dismisses the mobile drawer */
  onMobileClose?: () => void;
}

export function HqSidebar({ mobileOpen = false, onMobileClose }: HqSidebarProps) {
  const pathname = usePathname() || "/hq";
  const active = findHqActiveItem(pathname);
  const activeCategoryId = active?.categoryId || HQ_MENU[0].id;

  const [expanded, setExpanded] = React.useState<Set<string>>(
    () => new Set([activeCategoryId])
  );

  React.useEffect(() => {
    setExpanded((prev) => {
      if (prev.has(activeCategoryId)) return prev;
      return new Set([...prev, activeCategoryId]);
    });
  }, [activeCategoryId]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const Nav = (
    <nav className="flex-1 overflow-y-auto py-3">
      <ul className="flex flex-col">
        {HQ_MENU.map((cat) => {
          const Icon = HQ_ICONS[cat.id] || LayoutDashboard;
          const isSingle = cat.items.length === 1;
          const isCategoryActive = cat.id === activeCategoryId;
          const isExpanded = expanded.has(cat.id);

          if (isSingle) {
            const item = cat.items[0];
            const itemActive = item.href === pathname;
            return (
              <li key={cat.id}>
                <Link
                  href={item.href || "#"}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-2.5 px-5 py-2.5 text-[13px] font-medium transition-colors",
                    itemActive
                      ? "bg-brand-50 text-brand-600"
                      : "text-ink-primary hover:bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 flex-none",
                      itemActive ? "text-brand-500" : ""
                    )}
                  />
                  <span className="flex-1">{cat.label}</span>
                </Link>
              </li>
            );
          }

          return (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => toggle(cat.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-5 py-2.5 text-left text-[13px] font-medium transition-colors",
                  isCategoryActive ? "text-brand-600" : "text-ink-primary hover:bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 flex-none",
                    isCategoryActive && "text-brand-500"
                  )}
                />
                <span className="flex-1">{cat.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 flex-none text-ink-tertiary transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>
              {isExpanded && (
                <ul className="bg-[#F8FAFD] py-1">
                  {cat.items.map((item) => {
                    const itemActive = item.href === pathname;
                    return (
                      <li key={item.label}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            onClick={onMobileClose}
                            className={cn(
                              "block py-2 pl-12 pr-4 text-[12.5px] transition-colors",
                              itemActive
                                ? "font-bold text-brand-600"
                                : "text-ink-primary hover:bg-[#EDF1FA]"
                            )}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span className="block py-2 pl-12 pr-4 text-[12.5px] text-ink-tertiary">
                            {item.label}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const Footer = (
    <div className="border-t border-divider px-5 py-3 text-[11px] leading-relaxed text-ink-tertiary">
      <div className="font-semibold text-ink-secondary">The Pond HQ</div>
      <div>본사 운영자 전용 콘솔입니다.</div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 z-40 hidden w-[240px] flex-col border-r border-divider bg-white md:flex">
        {Nav}
        {Footer}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        {/* backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onMobileClose}
        />
        {/* panel */}
        <aside
          className={cn(
            "absolute left-0 top-0 bottom-0 flex w-[260px] max-w-[80vw] flex-col border-r border-divider bg-white shadow-xl transition-transform",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-divider px-5">
            <div className="text-sm font-bold text-ink-primary">메뉴</div>
            <button
              type="button"
              onClick={onMobileClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-secondary hover:bg-muted"
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {Nav}
          {Footer}
        </aside>
      </div>
    </>
  );
}
