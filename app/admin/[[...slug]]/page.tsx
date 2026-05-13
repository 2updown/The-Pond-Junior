"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Construction } from "lucide-react";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { ADMIN_MENU, findAdminActiveItem } from "@/components/pond/admin-menu-config";

export default function AdminCatchAllPage() {
  const pathname = usePathname() || "/admin";
  const router = useRouter();

  // /admin → first page redirect
  React.useEffect(() => {
    if (pathname === "/admin") {
      router.replace("/admin/notices");
    }
  }, [pathname, router]);

  if (pathname === "/admin") return null;

  const match = findAdminActiveItem(pathname);
  const title = match?.itemLabel || "관리자";
  const categoryLabel = match?.categoryLabel || "";

  return (
    <>
      <Topbar title={title} />
      <AppShell hideBottomNav>
        {categoryLabel && (
          <div className="px-1 text-xs font-semibold text-ink-tertiary">
            {categoryLabel}
          </div>
        )}

        <div className="flex flex-col items-center py-16 text-center md:py-24">
          <div className="empty-illustration mb-6">
            <Construction className="h-9 w-9 text-brand-500" strokeWidth={2} />
          </div>
          <h3 className="text-[18px] font-bold tracking-tight text-brand-500 md:text-xl">
            {title}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary md:text-sm">
            관리자 페이지는 준비 중입니다.
            <br />
            좌측 사이드바에서 다른 메뉴를 선택하거나
            <br />
            선생님 모드로 전환할 수 있어요.
          </p>
          <Link
            href="/consultations"
            className="mt-6 inline-block rounded-md border border-divider bg-white px-5 py-2.5 text-sm font-semibold text-ink-primary hover:bg-muted"
          >
            선생님 모드로 돌아가기
          </Link>
        </div>

        {/* Quick links to other admin pages in same category */}
        {match && (
          <div className="rounded-2xl bg-white p-4 shadow-elev1 md:p-6">
            <div className="mb-3 text-xs font-semibold text-ink-tertiary">
              같은 카테고리의 다른 메뉴
            </div>
            <ul className="flex flex-wrap gap-2">
              {ADMIN_MENU.find((c) => c.id === match.categoryId)
                ?.items.filter((i) => i.href !== pathname)
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href || "#"}
                      className="inline-block rounded-md bg-muted px-3 py-1.5 text-[12.5px] font-medium text-ink-primary hover:bg-brand-50 hover:text-brand-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </AppShell>
    </>
  );
}
