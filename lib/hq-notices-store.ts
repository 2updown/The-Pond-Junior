"use client";

// localStorage-based store for HQ-issued notices and push messages.
// HQ notices are broadcast from headquarters to academies (or to specific ones).

import * as React from "react";

export type HqNoticeKind = "notice" | "push";
export type HqNoticeAudience = "all" | "active" | "pro" | "custom";

export interface HqNotice {
  id: string;
  kind: HqNoticeKind;
  title: string;
  content: string;
  audience: HqNoticeAudience;
  targetAcademyIds?: string[]; // only for "custom"
  date: string;       // YYYY.MM.DD
  author: string;     // 본사 운영자
  status: "draft" | "sent";
  sentCount?: number; // 발송된 학원 수
}

const STORAGE_KEY = "pond_hq_notices_v1";

const SEED: HqNotice[] = [
  {
    id: "hn1",
    kind: "notice",
    title: "[필독] 6월 정기점검 일정 안내",
    content:
      "6월 첫째 주 일요일 새벽 2시~5시 시스템 정기점검이 예정되어 있습니다. 해당 시간 알림장/푸시 발송이 일시 중단됩니다.",
    audience: "all",
    date: "2026.05.13",
    author: "본사 운영팀",
    status: "sent",
    sentCount: 7,
  },
  {
    id: "hn2",
    kind: "notice",
    title: "Pro 플랜 신규 기능 — 랜딩페이지 자동 빌더",
    content:
      "Pro 플랜 학원 대상 랜딩페이지 자동 빌더 베타가 오픈되었습니다. 본사 페이지 → 랜딩페이지 메뉴에서 기능을 활성화해 주세요.",
    audience: "pro",
    date: "2026.05.10",
    author: "본사 PM",
    status: "sent",
    sentCount: 2,
  },
  {
    id: "hn3",
    kind: "push",
    title: "이번 주 신규 가입 학원 2곳 환영",
    content: "부산점, 대전점 가입을 환영합니다. 가입 신청 메뉴에서 승인 진행 부탁드립니다.",
    audience: "active",
    date: "2026.05.08",
    author: "본사 운영팀",
    status: "sent",
    sentCount: 5,
  },
  {
    id: "hn4",
    kind: "notice",
    title: "2026년 봄학기 운영 가이드 업데이트",
    content:
      "봄학기 학사 운영 가이드 v2가 배포되었습니다. 첨부 자료는 학원 관리자 모드 → 공지사항에서 확인 가능합니다.",
    audience: "all",
    date: "2026.04.28",
    author: "본사 운영팀",
    status: "sent",
    sentCount: 7,
  },
  {
    id: "hn5",
    kind: "push",
    title: "결제 갱신 안내 (5월분)",
    content: "5월 정기 결제가 5/20에 자동 진행됩니다. 결제 정보가 변경된 학원은 사전에 업데이트 부탁드립니다.",
    audience: "active",
    date: "2026.05.15",
    author: "본사 정산팀",
    status: "draft",
  },
];

function readAll(): HqNotice[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED;
    return parsed as HqNotice[];
  } catch {
    return SEED;
  }
}

function writeAll(rows: HqNotice[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent("pond:hq-notices-changed"));
}

export function listHqNotices(kind?: HqNoticeKind): HqNotice[] {
  const all = readAll();
  const filtered = kind ? all.filter((n) => n.kind === kind) : all;
  return filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function addHqNotice(
  notice: Omit<HqNotice, "id" | "date" | "status" | "sentCount"> & {
    status?: HqNotice["status"];
    sentCount?: number;
  }
): HqNotice {
  const all = readAll();
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
  const next: HqNotice = {
    ...notice,
    id: `u${Date.now()}`,
    date: dateStr,
    status: notice.status || "sent",
    sentCount: notice.sentCount ?? 0,
  };
  writeAll([next, ...all]);
  return next;
}

export function removeHqNotice(id: string) {
  const all = readAll();
  writeAll(all.filter((n) => n.id !== id));
}

export function useHqNotices(kind?: HqNoticeKind): HqNotice[] {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("pond:hq-notices-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("pond:hq-notices-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return React.useMemo(() => listHqNotices(kind), [kind, tick]);
}
