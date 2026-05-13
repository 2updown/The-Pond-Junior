"use client";

// Simple localStorage-based store for teacher-created content.
// On first read in a session, seeds with mock data so the UI isn't empty.

import * as React from "react";

export type PostKind = "notice" | "schedule" | "photo" | "menu";

export interface Post {
  id: string;
  kind: PostKind;
  title: string;
  content: string;
  tag?: string;        // 필독 / 안내 / 행사 / 학사 / 휴원 등
  pinned?: boolean;
  date: string;        // YYYY.MM.DD or YYYY-MM-DD
  author?: string;
  views?: number;
  imageUrl?: string;   // photo URL for photo posts (Unsplash etc.)
}

const STORAGE_KEY = "pond_posts_v2";

const SEED: Post[] = [
  {
    id: "n1",
    kind: "notice",
    title: "[필독] 5월 휴원 일정 안내",
    content:
      "5월 5일(어린이날)과 5월 25일(석가탄신일)은 휴원입니다. 자녀 일정에 참고 부탁드립니다.",
    tag: "필독",
    pinned: true,
    date: "2026.05.01",
    author: "원장",
    views: 142,
  },
  {
    id: "n2",
    kind: "notice",
    title: "중간고사 대비 특강 신청 안내",
    content:
      "5월 14일부터 중간고사 대비 특강이 시작됩니다. 신청은 학부모 어플에서 가능합니다.",
    tag: "안내",
    date: "2026.04.28",
    author: "Letitu 선생님",
    views: 218,
  },
  {
    id: "n3",
    kind: "notice",
    title: "학부모 상담 주간 신청 방법",
    content: "상담 주간은 5/20~5/24입니다. 학부모 어플 → 상담 신청에서 시간 선택 가능합니다.",
    tag: "안내",
    date: "2026.04.25",
    author: "Letitu 선생님",
    views: 96,
  },
  {
    id: "n4",
    kind: "notice",
    title: "신규 강사 인사 — 김지훈 선생님 (영어)",
    content: "5월부터 영어 김지훈 선생님이 합류합니다. 따뜻한 환영 부탁드립니다.",
    tag: "안내",
    date: "2026.04.10",
    author: "원장",
    views: 73,
  },
  {
    id: "n5",
    kind: "notice",
    title: "학원 출입 NFC 카드 사용 안내",
    content: "신규 NFC 출입 카드 배포가 완료되었습니다. 등하원 시 카드 태깅 부탁드립니다.",
    tag: "안내",
    date: "2026.03.20",
    author: "원장",
    views: 305,
  },

  // photos
  {
    id: "p1",
    kind: "photo",
    title: "5월 우리들의 일상",
    content: "함께 배우고 함께 자라는 시간",
    date: "2026.05.10",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    author: "Letitu 선생님",
  },
  {
    id: "p2",
    kind: "photo",
    title: "미술 시간",
    content: "직접 만들고 색칠한 작품들",
    date: "2026.05.08",
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80",
    author: "이수민 선생님",
  },
  {
    id: "p3",
    kind: "photo",
    title: "단체 활동",
    content: "협동심을 키우는 보드게임",
    date: "2026.05.06",
    imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=800&q=80",
    author: "박선영 선생님",
  },
  {
    id: "p4",
    kind: "photo",
    title: "음악 수업",
    content: "다 같이 부르는 동요",
    date: "2026.05.04",
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
    author: "이수민 선생님",
  },
  {
    id: "p5",
    kind: "photo",
    title: "과학 실험",
    content: "신기한 색소 실험",
    date: "2026.05.02",
    imageUrl: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=800&q=80",
    author: "김지훈 선생님",
  },

  // schedule (학원 일정표)
  { id: "s1", kind: "schedule", title: "중간고사 대비 특강 시작", content: "전 학년 대상 보충 특강", tag: "학사", date: "2026-05-14" },
  { id: "s2", kind: "schedule", title: "학부모 상담 주간 시작 (~5/24)", content: "전 학부모 대상 상담", tag: "학사", date: "2026-05-20" },
  { id: "s3", kind: "schedule", title: "석가탄신일 휴원", content: "전 수업 휴강", tag: "휴원", date: "2026-05-25" },
  { id: "s4", kind: "schedule", title: "중간고사 결과 분석 리포트 발송", content: "월말 리포트 알림톡 발송", tag: "학사", date: "2026-05-28" },
  { id: "s5", kind: "schedule", title: "6월 신규 등록 안내", content: "신규 학원생 모집", tag: "행사", date: "2026-06-01" },
];

function readAll(): Post[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED;
    return parsed as Post[];
  } catch {
    return SEED;
  }
}

function writeAll(posts: Post[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  // dispatch event so other tabs/components can refresh
  window.dispatchEvent(new CustomEvent("pond:posts-changed"));
}

export function listPosts(kind?: PostKind): Post[] {
  const all = readAll();
  const filtered = kind ? all.filter((p) => p.kind === kind) : all;
  // pinned first, then newest first
  return filtered.sort((a, b) => {
    if ((a.pinned ? 1 : 0) !== (b.pinned ? 1 : 0)) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    return (b.date || "").localeCompare(a.date || "");
  });
}

export function addPost(post: Omit<Post, "id" | "views" | "date"> & { date?: string }): Post {
  const all = readAll();
  const today = new Date();
  const dateStr =
    post.date ||
    (post.kind === "schedule"
      ? today.toISOString().slice(0, 10)
      : `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`);
  const next: Post = {
    ...post,
    id: `u${Date.now()}`,
    date: dateStr,
    views: 0,
  };
  writeAll([next, ...all]);
  return next;
}

export function removePost(id: string) {
  const all = readAll();
  writeAll(all.filter((p) => p.id !== id));
}

/** Subscribe a React component to posts changes. Returns the current list (re-fetched on change). */
export function usePosts(kind?: PostKind): Post[] {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("pond:posts-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("pond:posts-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  // re-read on each render (tick increment triggers re-render)
  return React.useMemo(() => listPosts(kind), [kind, tick]);
}
