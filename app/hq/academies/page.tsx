"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  MoreVertical,
  CheckCircle2,
  Clock,
  Ban,
  Pause,
  Play,
} from "lucide-react";
import {
  useAcademies,
  approveAcademy,
  suspendAcademy,
  updateAcademy,
  type AcademyStatus,
} from "@/lib/hq-academies-store";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | AcademyStatus;

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "active", label: "운영 중" },
  { id: "pending", label: "가입 대기" },
  { id: "suspended", label: "중단" },
];

export default function HqAcademiesPage() {
  const all = useAcademies();
  const [tab, setTab] = React.useState<StatusFilter>("all");
  const [query, setQuery] = React.useState("");

  const filtered = all
    .filter((a) => (tab === "all" ? true : a.status === tab))
    .filter((a) => {
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        a.ownerName.toLowerCase().includes(q)
      );
    });

  const counts: Record<StatusFilter, number> = {
    all: all.length,
    active: all.filter((a) => a.status === "active").length,
    pending: all.filter((a) => a.status === "pending").length,
    suspended: all.filter((a) => a.status === "suspended").length,
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-500">
          학원(지점) 관리
        </p>
        <h1 className="text-[22px] font-bold text-ink-primary md:text-[26px]">
          전체 학원 목록
        </h1>
        <p className="text-[13px] text-ink-secondary">
          본사 운영자가 관리하는 모든 학원 지점입니다. 상태 변경, 플랜 조회, 랜딩페이지 사용 여부를 확인할 수 있습니다.
        </p>
      </header>

      {/* Tabs + search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-divider bg-white p-1">
          {STATUS_TABS.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                  isActive
                    ? "bg-brand-500 text-white"
                    : "text-ink-secondary hover:bg-muted"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "rounded-md px-1.5 text-[10.5px] font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-muted text-ink-tertiary"
                  )}
                >
                  {counts[t.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-tertiary" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="학원명, 지역, 원장 이름으로 검색"
            className="h-9 w-full rounded-xl border border-divider bg-white pl-8 pr-3 text-[12.5px] text-ink-primary placeholder:text-ink-tertiary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-divider bg-white md:block">
        <table className="w-full table-fixed text-[12.5px]">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead className="border-b border-divider bg-[#F8FAFD] text-left text-[11.5px] font-semibold uppercase tracking-wide text-ink-tertiary">
            <tr>
              <th className="px-4 py-3">학원 / 원장</th>
              <th className="px-4 py-3">지역</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">플랜</th>
              <th className="px-4 py-3 text-right">원생/교사</th>
              <th className="px-4 py-3 text-right">월 결제</th>
              <th className="px-4 py-3 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-[#F8FAFD]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-semibold text-ink-primary">
                        {a.name}
                      </span>
                      <span className="truncate text-[11.5px] text-ink-tertiary">
                        {a.ownerName} · {a.ownerEmail}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-secondary">{a.region}</td>
                <td className="px-4 py-3">
                  <StatusPill status={a.status} />
                </td>
                <td className="px-4 py-3">
                  <PlanPill plan={a.plan} />
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-secondary">
                  {a.studentCount}/{a.teacherCount}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-primary">
                  {a.monthlyFee === 0
                    ? "—"
                    : `₩${a.monthlyFee.toLocaleString()}`}
                </td>
                <td className="px-4 py-3">
                  <RowActions academyId={a.id} status={a.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-ink-tertiary">
                  조건에 맞는 학원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="flex flex-col gap-3 rounded-2xl border border-divider bg-white p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Building2 className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[13.5px] font-bold text-ink-primary">
                    {a.name}
                  </span>
                  <span className="text-[11.5px] text-ink-tertiary">
                    {a.region}
                  </span>
                </div>
              </div>
              <StatusPill status={a.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12px] text-ink-secondary">
              <div>
                <div className="text-[10.5px] uppercase tracking-wide text-ink-tertiary">
                  원장
                </div>
                <div>{a.ownerName}</div>
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-wide text-ink-tertiary">
                  플랜
                </div>
                <PlanPill plan={a.plan} />
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-wide text-ink-tertiary">
                  원생/교사
                </div>
                <div>
                  {a.studentCount}/{a.teacherCount}
                </div>
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-wide text-ink-tertiary">
                  월 결제
                </div>
                <div>
                  {a.monthlyFee === 0 ? "—" : `₩${a.monthlyFee.toLocaleString()}`}
                </div>
              </div>
            </div>
            <RowActions academyId={a.id} status={a.status} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-divider bg-white px-4 py-12 text-center text-[12.5px] text-ink-tertiary">
            조건에 맞는 학원이 없습니다.
          </div>
        )}
      </div>

      <p className="text-[11.5px] text-ink-tertiary">
        가입 신청만 별도로 검토하려면{" "}
        <Link
          href="/hq/academies/applications"
          className="font-semibold text-brand-500 hover:text-brand-600"
        >
          가입 신청 페이지
        </Link>
        를 이용하세요.
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: AcademyStatus }) {
  const map: Record<
    AcademyStatus,
    { label: string; icon: React.ComponentType<{ className?: string }>; cls: string }
  > = {
    active: {
      label: "운영 중",
      icon: CheckCircle2,
      cls: "bg-[#E6F8EE] text-[#138A4D]",
    },
    pending: {
      label: "가입 대기",
      icon: Clock,
      cls: "bg-[#FFF6E5] text-[#B07700]",
    },
    suspended: {
      label: "중단",
      icon: Ban,
      cls: "bg-[#FDECEC] text-[#C13B3B]",
    },
  };
  const { label, icon: Icon, cls } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold",
        cls
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function PlanPill({ plan }: { plan: "free" | "basic" | "pro" }) {
  const map: Record<typeof plan, { label: string; cls: string }> = {
    free: { label: "Free", cls: "bg-muted text-ink-secondary" },
    basic: { label: "Basic", cls: "bg-brand-50 text-brand-600" },
    pro: { label: "Pro", cls: "bg-brand-500 text-white" },
  };
  const { label, cls } = map[plan];
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
        cls
      )}
    >
      {label}
    </span>
  );
}

function RowActions({
  academyId,
  status,
}: {
  academyId: string;
  status: AcademyStatus;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {status === "pending" && (
        <button
          type="button"
          onClick={() => approveAcademy(academyId)}
          className="inline-flex items-center gap-1 rounded-md bg-brand-500 px-2.5 py-1 text-[11.5px] font-semibold text-white hover:bg-brand-600"
        >
          <CheckCircle2 className="h-3 w-3" />
          승인
        </button>
      )}
      {status === "active" && (
        <button
          type="button"
          onClick={() => suspendAcademy(academyId)}
          className="inline-flex items-center gap-1 rounded-md border border-divider bg-white px-2.5 py-1 text-[11.5px] font-semibold text-ink-secondary hover:bg-muted"
        >
          <Pause className="h-3 w-3" />
          중단
        </button>
      )}
      {status === "suspended" && (
        <button
          type="button"
          onClick={() => updateAcademy(academyId, { status: "active" })}
          className="inline-flex items-center gap-1 rounded-md border border-divider bg-white px-2.5 py-1 text-[11.5px] font-semibold text-ink-secondary hover:bg-muted"
        >
          <Play className="h-3 w-3" />
          재개
        </button>
      )}
      <button
        type="button"
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-tertiary hover:bg-muted"
        aria-label="더 보기"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
