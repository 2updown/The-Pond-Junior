"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Users,
  BookOpen,
  GraduationCap,
  FolderArchive,
  MessageSquare,
  LayoutGrid,
  Bell,
  TrendingUp,
  Star,
  Headphones,
  User,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "./landing/header";
import {
  MENU,
  findActiveCategory,
  isActiveItem,
  isSingleItemCategory,
  isItemExpandable,
  type MenuCategory,
  type MenuItem,
} from "./menu-config";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: Home,
  members: Users,
  classes: BookOpen,
  learning: GraduationCap,
  archive: FolderArchive,
  consult: MessageSquare,
  community: LayoutGrid,
  alimtalk: Bell,
  erp: TrendingUp,
  board: Star,
  support: Headphones,
  account: User,
};

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || null;
  const activeCategoryId = findActiveCategory(pathname, tab);

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

  // 화면 표시 순서: 홈 + 메인 카테고리들 + 마지막에 계정(정보 수정)을 따로
  const mainCategories = MENU.filter((c) => c.id !== "account");
  const accountCategory = MENU.find((c) => c.id === "account");

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 hidden w-[240px] flex-col border-r border-divider bg-white md:flex">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 border-b border-divider px-5 py-5"
      >
        <LogoMark />
        <div className="leading-tight">
          <div className="text-[14px] font-bold tracking-tight">레티튜초등학교</div>
          <div className="text-[10px] text-ink-tertiary">관리 페이지</div>
        </div>
      </Link>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="flex flex-col">
          {mainCategories.map((cat) => (
            <SidebarCategoryRow
              key={cat.id}
              category={cat}
              Icon={ICONS[cat.id] || User}
              isActive={cat.id === activeCategoryId}
              isExpanded={expanded.has(cat.id)}
              pathname={pathname}
              tab={tab}
              onToggle={() => toggle(cat.id)}
              router={router}
            />
          ))}
        </ul>
      </nav>

      {/* Account (정보 수정) — separated at bottom */}
      {accountCategory && (
        <div className="border-t border-divider py-2">
          <SidebarCategoryRow
            category={accountCategory}
            Icon={ICONS[accountCategory.id] || User}
            isActive={accountCategory.id === activeCategoryId}
            isExpanded={expanded.has(accountCategory.id)}
            pathname={pathname}
            tab={tab}
            onToggle={() => toggle(accountCategory.id)}
            router={router}
          />
        </div>
      )}
    </aside>
  );
}

function SidebarCategoryRow({
  category,
  Icon,
  isActive,
  isExpanded,
  pathname,
  tab,
  onToggle,
  router,
}: {
  category: MenuCategory;
  Icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isExpanded: boolean;
  pathname: string;
  tab: string | null;
  onToggle: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const single = isSingleItemCategory(category);

  // Single-item category: render as direct link
  if (single) {
    const href = category.items[0].href || "#";
    return (
      <li>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-2.5 px-5 py-2.5 text-[13px] font-medium transition-colors",
            isActive
              ? "bg-brand-50 text-brand-600"
              : "text-ink-primary hover:bg-muted"
          )}
        >
          <Icon className="h-4 w-4 flex-none" />
          <span className="flex-1">{category.label}</span>
        </Link>
      </li>
    );
  }

  // Multi-item category: collapsible
  return (
    <li>
      <button
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-2.5 px-5 py-2.5 text-left text-[13px] font-medium transition-colors",
          isActive
            ? "text-brand-600"
            : "text-ink-primary hover:bg-muted"
        )}
      >
        <Icon className={cn("h-4 w-4 flex-none", isActive && "text-brand-500")} />
        <span className="flex-1">{category.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-none text-ink-tertiary transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <ul className="bg-[#F8FAFD] py-1">
          {category.items.map((item) => (
            <SidebarSubItem
              key={item.label}
              item={item}
              pathname={pathname}
              tab={tab}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarSubItem({
  item,
  pathname,
  tab,
}: {
  item: MenuItem;
  pathname: string;
  tab: string | null;
}) {
  const expandable = isItemExpandable(item);
  const [open, setOpen] = React.useState(() => {
    if (!item.items) return false;
    return item.items.some((s) => isActiveItem(s, pathname, tab));
  });
  const active = isActiveItem(item, pathname, tab);

  if (expandable) {
    return (
      <li>
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between gap-2 py-2 pl-12 pr-4 text-left text-[12.5px] transition-colors",
            active
              ? "font-bold text-brand-600"
              : "text-ink-primary hover:bg-[#EDF1FA]"
          )}
        >
          <span>{item.label}</span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 flex-none text-ink-tertiary transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
        {open && item.items && (
          <ul>
            {item.items.map((sub) => (
              <li key={sub.label}>
                {sub.href ? (
                  <Link
                    href={sub.href}
                    className={cn(
                      "block py-1.5 pl-16 pr-4 text-[12px] transition-colors",
                      isActiveItem(sub, pathname, tab)
                        ? "font-bold text-brand-600"
                        : "text-ink-secondary hover:bg-[#EDF1FA]"
                    )}
                  >
                    {sub.label}
                  </Link>
                ) : (
                  <span className="block py-1.5 pl-16 pr-4 text-[12px] text-ink-tertiary">
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
          className={cn(
            "block py-2 pl-12 pr-4 text-[12.5px] transition-colors",
            active
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
}
