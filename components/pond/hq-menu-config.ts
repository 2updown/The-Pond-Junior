// HQ (본사) sidebar menu — for HQ operators who manage multiple academies.
// Separate from teacher mode (/) and academy admin mode (/admin/*).

import type { MenuCategory } from "./menu-config";

export const HQ_MENU: MenuCategory[] = [
  {
    id: "hq-dashboard",
    label: "대시보드",
    items: [
      { label: "통합 통계", href: "/hq", match: ["/hq"] },
    ],
  },
  {
    id: "hq-academies",
    label: "학원(지점) 관리",
    items: [
      { label: "전체 학원", href: "/hq/academies", match: ["/hq/academies"] },
      { label: "가입 신청", href: "/hq/academies/applications", match: ["/hq/academies/applications"] },
    ],
  },
  {
    id: "hq-notices",
    label: "공지/푸시 발송",
    items: [
      { label: "본사 공지사항", href: "/hq/notices", match: ["/hq/notices"] },
      { label: "푸시 발송", href: "/hq/notices/push", match: ["/hq/notices/push"] },
    ],
  },
  {
    id: "hq-landing",
    label: "랜딩페이지 (유료)",
    items: [
      { label: "기능 사용 설정", href: "/hq/landing", match: ["/hq/landing"] },
    ],
  },
];

export function findHqActiveItem(
  pathname: string
): { categoryId: string; href: string; categoryLabel: string; itemLabel: string } | null {
  // exact match first
  for (const cat of HQ_MENU) {
    for (const item of cat.items) {
      if (item.href === pathname) {
        return {
          categoryId: cat.id,
          href: item.href || "",
          categoryLabel: cat.label,
          itemLabel: item.label,
        };
      }
    }
  }
  // fallback: prefix match for nested routes like /hq/academies/abc
  for (const cat of HQ_MENU) {
    for (const item of cat.items) {
      if (item.href && item.href !== "/hq" && pathname.startsWith(item.href + "/")) {
        return {
          categoryId: cat.id,
          href: item.href,
          categoryLabel: cat.label,
          itemLabel: item.label,
        };
      }
    }
  }
  return null;
}
