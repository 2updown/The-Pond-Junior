// Admin (관리자) sidebar menu — separate from teacher mode.

import type { MenuCategory } from "./menu-config";

export const ADMIN_MENU: MenuCategory[] = [
  {
    id: "admin-notices",
    label: "공지",
    items: [
      { label: "공지사항", href: "/admin/notices", match: ["/admin/notices"] },
    ],
  },
  {
    id: "admin-basic",
    label: "기본관리",
    items: [
      { label: "반 관리", href: "/admin/basic/classes", match: ["/admin/basic/classes"] },
      { label: "원생 관리", href: "/admin/basic/students", match: ["/admin/basic/students"] },
      { label: "기타게시판 관리", href: "/admin/basic/board", match: ["/admin/basic/board"] },
      { label: "원 정보 관리", href: "/admin/basic/info", match: ["/admin/basic/info"] },
      { label: "웹사이트 설정 관리", href: "/admin/basic/website", match: ["/admin/basic/website"] },
      { label: "외부 서비스 연동 설정", href: "/admin/basic/external", match: ["/admin/basic/external"] },
      { label: "PC 웹사이트 꾸미기", href: "/admin/basic/pc-customize", match: ["/admin/basic/pc-customize"] },
      { label: "교사 ID 관리", href: "/admin/basic/teachers", match: ["/admin/basic/teachers"] },
      { label: "팝업 관리", href: "/admin/basic/popup", match: ["/admin/basic/popup"] },
      { label: "메인화면 이미지 관리", href: "/admin/basic/main-image", match: ["/admin/basic/main-image"] },
    ],
  },
  {
    id: "admin-mobile",
    label: "모바일 & 알림장 관리",
    items: [
      { label: "모바일 설정 관리", href: "/admin/mobile/settings", match: ["/admin/mobile/settings"] },
      { label: "모바일 메인 꾸미기", href: "/admin/mobile/customize", match: ["/admin/mobile/customize"] },
      { label: "어플 알림 설정", href: "/admin/mobile/app-notify-setting", match: ["/admin/mobile/app-notify-setting"] },
      { label: "어플 알림 조회", href: "/admin/mobile/app-notify-history", match: ["/admin/mobile/app-notify-history"] },
      { label: "알림장 설정", href: "/admin/mobile/notebook-settings", match: ["/admin/mobile/notebook-settings"] },
    ],
  },
  {
    id: "admin-checkin",
    label: "등하원 알림",
    items: [
      { label: "등하원 알림 설정", href: "/admin/checkin/settings", match: ["/admin/checkin/settings"] },
      { label: "등하원 알림 기록", href: "/admin/checkin/history", match: ["/admin/checkin/history"] },
      { label: "시간대별 학생수 통계", href: "/admin/checkin/stats", match: ["/admin/checkin/stats"] },
    ],
  },
  {
    id: "admin-stats",
    label: "조회 및 통계",
    items: [
      { label: "원생별 방문 현황", href: "/admin/stats/visit", match: ["/admin/stats/visit"] },
      { label: "방문 트렌드", href: "/admin/stats/trends", match: ["/admin/stats/trends"] },
      { label: "출석부 - 사진기준", href: "/admin/stats/attendance", match: ["/admin/stats/attendance"] },
      { label: "댓글 통계", href: "/admin/stats/comments", match: ["/admin/stats/comments"] },
      { label: "사진 수 현황", href: "/admin/stats/photos", match: ["/admin/stats/photos"] },
      { label: "원내 게시물 통계", href: "/admin/stats/posts", match: ["/admin/stats/posts"] },
      { label: "입학신청 관리", href: "/admin/stats/applications", match: ["/admin/stats/applications"] },
      { label: "기타 신청 관리", href: "/admin/stats/other-applications", match: ["/admin/stats/other-applications"] },
      { label: "청구서 조회", href: "/admin/stats/invoices", match: ["/admin/stats/invoices"] },
      { label: "자동이체 신청", href: "/admin/stats/auto-payment", match: ["/admin/stats/auto-payment"] },
    ],
  },
];

export function findAdminActiveItem(
  pathname: string
): { categoryId: string; href: string; categoryLabel: string; itemLabel: string } | null {
  for (const cat of ADMIN_MENU) {
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
  return null;
}
