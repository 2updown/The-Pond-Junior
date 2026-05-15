"use client";

// localStorage-based store for HQ-managed academy (지점) records.
// Mirrors the pattern in lib/posts-store.ts.

import * as React from "react";

export type AcademyStatus = "active" | "pending" | "suspended";
export type AcademyPlan = "free" | "basic" | "pro";

export interface Academy {
  id: string;
  name: string;          // 학원명 (e.g., "레티튜초등학교 강남점")
  region: string;        // 지역 (e.g., "서울 강남구")
  ownerName: string;     // 원장 이름
  ownerEmail: string;
  ownerPhone: string;
  studentCount: number;  // 누적 원생 수
  teacherCount: number;  // 교사 수
  status: AcademyStatus;
  plan: AcademyPlan;
  landingEnabled: boolean; // 랜딩페이지 유료 기능 사용 여부
  joinedAt: string;      // YYYY.MM.DD
  monthlyFee: number;    // 월 결제 금액 (원)
}

const STORAGE_KEY = "pond_hq_academies_v1";

const SEED: Academy[] = [
  {
    id: "ac1",
    name: "레티튜초등학교 강남점",
    region: "서울 강남구",
    ownerName: "김민수",
    ownerEmail: "minsoo@letitu.kr",
    ownerPhone: "010-1234-5678",
    studentCount: 248,
    teacherCount: 12,
    status: "active",
    plan: "pro",
    landingEnabled: true,
    joinedAt: "2024.03.12",
    monthlyFee: 290000,
  },
  {
    id: "ac2",
    name: "레티튜초등학교 분당점",
    region: "경기 성남시 분당구",
    ownerName: "박지연",
    ownerEmail: "jiyeon@letitu.kr",
    ownerPhone: "010-2345-6789",
    studentCount: 187,
    teacherCount: 9,
    status: "active",
    plan: "pro",
    landingEnabled: true,
    joinedAt: "2024.07.01",
    monthlyFee: 290000,
  },
  {
    id: "ac3",
    name: "레티튜초등학교 송파점",
    region: "서울 송파구",
    ownerName: "이수민",
    ownerEmail: "soomin@letitu.kr",
    ownerPhone: "010-3456-7890",
    studentCount: 142,
    teacherCount: 7,
    status: "active",
    plan: "basic",
    landingEnabled: false,
    joinedAt: "2025.01.20",
    monthlyFee: 190000,
  },
  {
    id: "ac4",
    name: "레티튜초등학교 일산점",
    region: "경기 고양시 일산서구",
    ownerName: "최영호",
    ownerEmail: "youngho@letitu.kr",
    ownerPhone: "010-4567-8901",
    studentCount: 96,
    teacherCount: 5,
    status: "active",
    plan: "basic",
    landingEnabled: true,
    joinedAt: "2025.04.05",
    monthlyFee: 190000,
  },
  {
    id: "ac5",
    name: "레티튜초등학교 수원점",
    region: "경기 수원시 영통구",
    ownerName: "정해린",
    ownerEmail: "haerin@letitu.kr",
    ownerPhone: "010-5678-9012",
    studentCount: 64,
    teacherCount: 4,
    status: "active",
    plan: "free",
    landingEnabled: false,
    joinedAt: "2025.09.10",
    monthlyFee: 0,
  },
  {
    id: "ac6",
    name: "레티튜초등학교 부산점",
    region: "부산 해운대구",
    ownerName: "한지훈",
    ownerEmail: "jihoon@letitu.kr",
    ownerPhone: "010-6789-0123",
    studentCount: 0,
    teacherCount: 0,
    status: "pending",
    plan: "free",
    landingEnabled: false,
    joinedAt: "2026.05.08",
    monthlyFee: 0,
  },
  {
    id: "ac7",
    name: "레티튜초등학교 대전점",
    region: "대전 유성구",
    ownerName: "윤서연",
    ownerEmail: "seoyeon@letitu.kr",
    ownerPhone: "010-7890-1234",
    studentCount: 0,
    teacherCount: 0,
    status: "pending",
    plan: "free",
    landingEnabled: false,
    joinedAt: "2026.05.12",
    monthlyFee: 0,
  },
  {
    id: "ac8",
    name: "레티튜초등학교 인천점",
    region: "인천 연수구",
    ownerName: "장도윤",
    ownerEmail: "doyoon@letitu.kr",
    ownerPhone: "010-8901-2345",
    studentCount: 18,
    teacherCount: 2,
    status: "suspended",
    plan: "basic",
    landingEnabled: false,
    joinedAt: "2025.06.15",
    monthlyFee: 0,
  },
];

function readAll(): Academy[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED;
    return parsed as Academy[];
  } catch {
    return SEED;
  }
}

function writeAll(rows: Academy[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent("pond:hq-academies-changed"));
}

export function listAcademies(status?: AcademyStatus): Academy[] {
  const all = readAll();
  const filtered = status ? all.filter((a) => a.status === status) : all;
  // active first, then by joinedAt desc
  return filtered.sort((a, b) => {
    const sa = a.status === "active" ? 0 : a.status === "pending" ? 1 : 2;
    const sb = b.status === "active" ? 0 : b.status === "pending" ? 1 : 2;
    if (sa !== sb) return sa - sb;
    return (b.joinedAt || "").localeCompare(a.joinedAt || "");
  });
}

export function updateAcademy(id: string, patch: Partial<Academy>) {
  const all = readAll();
  const next = all.map((a) => (a.id === id ? { ...a, ...patch } : a));
  writeAll(next);
}

export function approveAcademy(id: string) {
  updateAcademy(id, { status: "active" });
}

export function suspendAcademy(id: string) {
  updateAcademy(id, { status: "suspended" });
}

export function setLandingEnabled(id: string, enabled: boolean) {
  updateAcademy(id, { landingEnabled: enabled });
}

export function useAcademies(status?: AcademyStatus): Academy[] {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("pond:hq-academies-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("pond:hq-academies-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return React.useMemo(() => listAcademies(status), [status, tick]);
}
