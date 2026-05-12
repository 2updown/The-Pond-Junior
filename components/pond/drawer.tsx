"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MENU,
  findActiveCategory,
  isActiveItem,
  isSingleItemCategory,
  isItemExpandable,
  type MenuItem,
} from "./menu-config";

interface DrawerContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

export function useDrawer() {
  const ctx = React.useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within DrawerProvider");
  return ctx;
}

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setOpen] = React.useState(false);
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || null;
  const [query, setQuery] = React.useState("");
  const [activeCategoryId, setActiveCategoryId] = React.useState(() =>
    findActiveCategory(pathname, tab)
  );
  const [expanded, setExpanded] = React.useState<Set<string>>(() => {
    // Expand the currently active expandable item by default
    const active = findActiveCategory(pathname, tab);
    const cat = MENU.find((c) => c.id === active);
    if (cat) {
      for (const item of cat.items) {
        if (item.items && item.items.some((s) => isActiveItem(s, pathname, tab))) {
          return new Set([item.label]);
        }
      }
    }
    return new Set();
  });

  React.useEffect(() => {
    setActiveCategoryId(findActiveCategory(pathname, tab));
  }, [pathname, tab]);

  React.useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [isOpen]);

  React.useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [pathname, tab]);

  const open = React.useCallback(() => setOpen(true), []);
  const close = React.useCallback(() => setOpen(false), []);

  const q = query.trim().toLowerCase();
  const matchQuery = (text: string) => !q || text.toLowerCase().includes(q);

  const itemMatches = (item: MenuItem): boolean => {
    if (matchQuery(item.label)) return true;
    if (item.items) return item.items.some(itemMatches);
    return false;
  };

  const visibleCategories = MENU.filter(
    (c) => matchQuery(c.label) || c.items.some(itemMatches)
  );

  const currentCat = MENU.find((c) => c.id === activeCategoryId);
  const items =
    currentCat && !isSingleItemCategory(currentCat)
      ? matchQuery(currentCat.label)
        ? currentCat.items
        : currentCat.items.filter(itemMatches)
      : [];

  const handleCategoryClick = (cat: typeof MENU[number]) => {
    if (isSingleItemCategory(cat)) {
      const href = cat.items[0].href;
      if (href) {
        router.push(href);
        close();
        return;
      }
    }
    setActiveCategoryId(cat.id);
  };

  const toggleExpand = (label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <DrawerContext.Provider value={{ open, close, isOpen }}>
      {children}
      {/* Backdrop — mobile only */}
      <div
        className={cn(
          "fixed inset-0 z-[300] bg-black/40 transition-opacity duration-200 md:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={close}
        aria-hidden
      />
      {/* Drawer — mobile only */}
      <aside
        role="dialog"
        aria-label="전체 메뉴"
        aria-hidden={!isOpen}
        className="fixed top-0 bottom-0 z-[301] flex w-[min(94vw,460px)] flex-col bg-white shadow-[0_0_30px_rgba(16,24,40,0.18)] transition-transform duration-250 ease-[cubic-bezier(0.2,0.8,0.2,1)] md:hidden"
        style={{
          left: "max(0px, calc(50vw - 240px))",
          transform: isOpen ? "translateX(0)" : "translateX(-100vw)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-divider px-5 py-4">
          <span className="flex-1 text-base font-bold tracking-tight">
            레티튜초등학교
          </span>
          <button
            onClick={close}
            aria-label="메뉴 닫기"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-primary hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-divider px-4 py-3">
          <div className="flex items-center gap-2 rounded-[10px] border border-divider bg-white px-3 py-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="flex-1 bg-transparent text-sm text-ink-primary outline-none placeholder:text-ink-tertiary"
            />
            <Search className="h-[18px] w-[18px] text-ink-secondary" />
          </div>
        </div>

        {/* Two-column body */}
        <div className="grid min-h-0 flex-1 grid-cols-[42%_58%]">
          {/* Left: Categories */}
          <ul className="overflow-y-auto" style={{ background: "#EDF1FA" }}>
            {visibleCategories.length === 0 && (
              <li className="px-4 py-6 text-center text-[13px] text-ink-tertiary">
                검색 결과가 없어요
              </li>
            )}
            {visibleCategories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className={cn(
                      "block w-full px-4 py-3.5 text-left text-sm font-medium tracking-tight transition-colors",
                      isActive
                        ? "bg-brand-500 font-bold text-white"
                        : "text-ink-primary hover:bg-brand-500/10"
                    )}
                  >
                    {cat.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right: Items (empty for single-item categories — they navigate directly) */}
          <ul className="overflow-y-auto bg-white">
            {items.length === 0 && currentCat && !isSingleItemCategory(currentCat) && (
              <li className="px-4 py-6 text-center text-[13px] text-ink-tertiary">
                항목이 없어요
              </li>
            )}
            {items.map((item) => (
              <DrawerSubItem
                key={item.label}
                item={item}
                pathname={pathname}
                tab={tab}
                expanded={expanded.has(item.label)}
                onToggle={() => toggleExpand(item.label)}
                onNavigate={close}
              />
            ))}
          </ul>
        </div>
      </aside>
    </DrawerContext.Provider>
  );
}

function DrawerSubItem({
  item,
  pathname,
  tab,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: MenuItem;
  pathname: string;
  tab: string | null;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const expandable = isItemExpandable(item);
  const active = isActiveItem(item, pathname, tab);

  if (expandable) {
    return (
      <li>
        <button
          onClick={onToggle}
          className={cn(
            "flex w-full items-center justify-between gap-2 border-b border-divider px-4 py-3.5 text-[13.5px] font-medium transition-colors",
            active
              ? "bg-brand-50 font-bold text-brand-600"
              : "text-ink-primary hover:bg-[#F5F7FB]"
          )}
        >
          <span>{item.label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 flex-none text-ink-tertiary transition-transform",
              expanded && "rotate-180"
            )}
          />
        </button>
        {expanded && item.items && (
          <ul className="bg-[#F8FAFD]">
            {item.items.map((sub) => (
              <li key={sub.label}>
                {sub.href ? (
                  <Link
                    href={sub.href}
                    onClick={onNavigate}
                    className={cn(
                      "block border-b border-divider py-3 pl-7 pr-4 text-[13px] transition-colors",
                      isActiveItem(sub, pathname, tab)
                        ? "font-bold text-brand-600"
                        : "text-ink-primary hover:bg-[#EDF1FA]"
                    )}
                  >
                    {sub.label}
                  </Link>
                ) : (
                  <span className="block py-3 pl-7 pr-4 text-[13px] text-ink-tertiary">
                    {sub.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  // leaf
  return (
    <li>
      {item.href ? (
        <Link
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "block border-b border-divider px-4 py-3.5 text-[13.5px] font-medium transition-colors",
            active
              ? "bg-brand-50 font-bold text-brand-600"
              : "text-ink-primary hover:bg-[#F5F7FB]"
          )}
        >
          {item.label}
        </Link>
      ) : (
        <span className="block px-4 py-3.5 text-[13.5px] text-ink-tertiary">
          {item.label}
        </span>
      )}
    </li>
  );
}
