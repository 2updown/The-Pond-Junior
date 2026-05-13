// Menu structure shared by Drawer.

export interface MenuItem {
  label: string;
  href?: string;
  match?: string[];
  tab?: string;
  items?: MenuItem[];  // optional 3rd-depth children
}

export interface MenuCategory {
  id: string;
  label: string;
  items: MenuItem[];
}

export const MENU: MenuCategory[] = [
  {
    id: "members",
    label: "회원관리",
    items: [
      {
        label: "교사 관리",
        match: ["/members"],
        tab: "teacher",
        items: [
          { label: "정규 교사", href: "/members?tab=teacher&status=active", match: ["/members"], tab: "teacher" },
          { label: "퇴사 교사", href: "/members?tab=teacher&status=resigned", match: ["/members"], tab: "teacher" },
        ],
      },
      {
        label: "학생 관리",
        match: ["/members"],
        tab: "student",
        items: [
          { label: "정규 학생", href: "/members?tab=student&status=active", match: ["/members"], tab: "student" },
          { label: "정지 학생", href: "/members?tab=student&status=paused", match: ["/members"], tab: "student" },
          { label: "탈퇴 학생", href: "/members?tab=student&status=withdrawn", match: ["/members"], tab: "student" },
        ],
      },
      { label: "학생 출결관리", href: "/members?tab=attendance", match: ["/members"], tab: "attendance" },
    ],
  },
  {
    id: "classes",
    label: "반관리",
    items: [{ label: "반 관리 및 반 배정", href: "/classes", match: ["/classes"] }],
  },
  {
    id: "learning",
    label: "학습관리",
    items: [
      {
        label: "숙제 관리",
        match: ["/learning"],
        tab: "homework",
        items: [
          { label: "숙제 출제", href: "/learning?tab=homework&mode=create", match: ["/learning"], tab: "homework" },
          { label: "숙제 검사", href: "/learning?tab=homework&mode=review", match: ["/learning"], tab: "homework" },
          { label: "숙제 삭제", href: "/learning?tab=homework&mode=delete", match: ["/learning"], tab: "homework" },
        ],
      },
      { label: "리포트", href: "/learning?tab=report", match: ["/learning"], tab: "report" },
      { label: "학습 포인트", href: "/learning?tab=point", match: ["/learning"], tab: "point" },
    ],
  },
  {
    id: "archive",
    label: "Archive",
    items: [
      { label: "Voca Archive", href: "/archive?tab=voca", match: ["/archive"], tab: "voca" },
      { label: "Sentence Archive", href: "/archive?tab=sentence", match: ["/archive"], tab: "sentence" },
    ],
  },
  {
    id: "consult",
    label: "상담관리",
    items: [
      { label: "상담 스케쥴", href: "/consultations", match: ["/consultation"] },
      { label: "학생별 상담 이력", href: "/students", match: ["/students", "/student"] },
    ],
  },
  {
    id: "community",
    label: "커뮤니티",
    items: [
      { label: "학원 일정표", href: "/community?tab=schedule", match: ["/community"], tab: "schedule" },
      { label: "학원 공지사항", href: "/community?tab=notice", match: ["/community"], tab: "notice" },
    ],
  },
  {
    id: "alimtalk",
    label: "학부모 알림톡",
    items: [
      { label: "자동 발송 설정", href: "/alimtalk?tab=setting", match: ["/alimtalk"], tab: "setting" },
      { label: "발송 내역", href: "/alimtalk?tab=history", match: ["/alimtalk"], tab: "history" },
      { label: "충전 / 충전 내역", href: "/alimtalk?tab=charge", match: ["/alimtalk"], tab: "charge" },
    ],
  },
  {
    id: "erp",
    label: "경영관리 / ERP",
    items: [
      { label: "월별 매출 현황", href: "/erp?tab=revenue", match: ["/erp"], tab: "revenue" },
      { label: "수강료 결제 관리", href: "/erp?tab=payment", match: ["/erp"], tab: "payment" },
      { label: "교재비 청구 / 결제", href: "/erp?tab=textbook", match: ["/erp"], tab: "textbook" },
      { label: "온라인 사용료", href: "/erp?tab=online", match: ["/erp"], tab: "online" },
      { label: "지출 관리", href: "/erp?tab=expense", match: ["/erp"], tab: "expense" },
      { label: "집계 / 통계", href: "/erp?tab=stats", match: ["/erp"], tab: "stats" },
    ],
  },
  {
    id: "board",
    label: "게시판",
    items: [{ label: "본사 공지사항", href: "/board", match: ["/board"] }],
  },
  {
    id: "support",
    label: "고객센터",
    items: [{ label: "본사 고객센터", href: "/support", match: ["/support"] }],
  },
  {
    id: "account",
    label: "계정",
    items: [{ label: "계정 설정", href: "/account", match: ["/account"] }],
  },
];

export function isSingleItemCategory(cat: MenuCategory): boolean {
  return cat.items.length === 1 && !cat.items[0].items;
}

export function isItemExpandable(item: MenuItem): boolean {
  return !!item.items && item.items.length > 0;
}

export function findActiveCategory(pathname: string, tab?: string | null): string {
  // Prefer match with same tab
  for (const cat of MENU) {
    for (const item of cat.items) {
      const matchList = item.match || [];
      if (matchList.some((m) => pathname.startsWith(m))) {
        if (!item.tab) return cat.id;
        if (tab === item.tab) return cat.id;
      }
      // also check nested
      if (item.items) {
        for (const sub of item.items) {
          const subMatch = sub.match || [];
          if (subMatch.some((m) => pathname.startsWith(m))) {
            if (!sub.tab) return cat.id;
            if (tab === sub.tab) return cat.id;
          }
        }
      }
    }
  }
  // fallback by pathname only
  for (const cat of MENU) {
    for (const item of cat.items) {
      const matchList = item.match || [];
      if (matchList.some((m) => pathname.startsWith(m))) return cat.id;
    }
  }
  return MENU[0]?.id || "";
}

export function isActiveItem(
  item: MenuItem,
  pathname: string,
  tab: string | null
): boolean {
  const matchList = item.match || [];
  if (!matchList.some((m) => pathname.startsWith(m))) return false;
  if (item.tab) {
    if (tab) return tab === item.tab;
    return false;
  }
  return true;
}
