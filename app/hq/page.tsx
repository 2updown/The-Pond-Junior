"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  GraduationCap,
  CreditCard,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Ban,
} from "lucide-react";
import { useAcademies } from "@/lib/hq-academies-store";
import { useHqNotices } from "@/lib/hq-notices-store";
import { cn } from "@/lib/utils";

export default function HqDashboardPage() {
  const all = useAcademies();
  const notices = useHqNotices();

  const active = all.filter((a) => a.status === "active");
  const pending = all.filter((a) => a.status === "pending");
  const suspended = all.filter((a) => a.status === "suspended");

  const totalStudents = all.reduce((sum, a) => sum + a.studentCount, 0);
  const totalTeachers = all.reduce((sum, a) => sum + a.teacherCount, 0);
  const mrr = active.reduce((sum, a) => sum + a.monthlyFee, 0);
  const landingActive = all.filter((a) => a.landingEnabled).length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-500">
          본사 대시보드
        </p>
        <h1 className="text-[22px] font-bold text-ink-primary md:text-[26px]">
          전체 학원 운영 현황
        </h1>
        <p className="text-[13px] text-ink-secondary">
          본사 운영자가 전 지점의 핵심 지표를 한눈에 확인할 수 있는 페이지입니다.
        </p>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          icon={Building2}
          label="운영 중인 학원"
          value={`${active.length}곳`}
          sub={`전체 ${all.length}곳 중`}
          tone="brand"
        />
        <KpiCard
          icon={GraduationCap}
          label="누적 원생 수"
          value={totalStudents.toLocaleString() + "명"}
          sub={`교사 ${totalTeachers}명 운영`}
          tone="success"
        />
        <KpiCard
          icon={CreditCard}
          label="월 정기 매출"
          value={`₩${(mrr / 10000).toFixed(0)}만`}
          sub="Active 학원 기준"
          tone="brand"
        />
        <KpiCard
          icon={TrendingUp}
          label="랜딩페이지 사용"
          value={`${landingActive}곳`}
          sub={`전체 ${all.length}곳 중`}
          tone="warning"
        />
      </section>

      {/* Status summary + recent notices */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-divider bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink-primary">학원 상태 분포</h2>
            <Link
              href="/hq/academies"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-500 hover:text-brand-600"
            >
              전체 보기 <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <StatusBox
              icon={CheckCircle2}
              label="운영 중"
              count={active.length}
              tone="success"
            />
            <StatusBox
              icon={Clock}
              label="가입 대기"
              count={pending.length}
              tone="warning"
            />
            <StatusBox
              icon={Ban}
              label="중단/일시중지"
              count={suspended.length}
              tone="danger"
            />
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-ink-tertiary">
              최근 가입 신청
            </h3>
            {pending.length === 0 ? (
              <p className="text-[12.5px] text-ink-tertiary">
                현재 대기 중인 학원이 없습니다.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-divider">
                {pending.slice(0, 3).map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-2.5">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-ink-primary">
                        {a.name}
                      </span>
                      <span className="text-[11.5px] text-ink-tertiary">
                        {a.region} · 원장 {a.ownerName} · {a.joinedAt}
                      </span>
                    </div>
                    <Link
                      href="/hq/academies/applications"
                      className="rounded-md border border-brand-500 px-2.5 py-1 text-[11.5px] font-semibold text-brand-500 hover:bg-brand-50"
                    >
                      검토
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-divider bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink-primary">최근 본사 공지</h2>
            <Link
              href="/hq/notices"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-500 hover:text-brand-600"
            >
              관리 <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-3 flex flex-col gap-2.5">
            {notices.slice(0, 4).map((n) => (
              <li
                key={n.id}
                className="flex items-start gap-2.5 rounded-xl border border-divider bg-[#F8FAFD] p-3"
              >
                <span
                  className={cn(
                    "mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-md text-[10.5px] font-bold",
                    n.kind === "push"
                      ? "bg-brand-50 text-brand-600"
                      : "bg-[#FFF6E5] text-[#B07700]"
                  )}
                >
                  {n.kind === "push" ? "푸시" : "공지"}
                </span>
                <div className="flex flex-col">
                  <span className="text-[12.5px] font-semibold leading-snug text-ink-primary line-clamp-2">
                    {n.title}
                  </span>
                  <span className="mt-0.5 text-[11px] text-ink-tertiary">
                    {n.date} · {n.author} ·{" "}
                    {n.status === "sent"
                      ? `${n.sentCount ?? 0}곳 발송`
                      : "초안"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Operations notes */}
      <section className="rounded-2xl border border-brand-500/30 bg-brand-50 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-500 text-white">
            <AlertCircle className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-[13.5px] font-bold text-brand-600">운영 안내</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-secondary">
              본사 모드의 모든 데이터는 현재 데모용 localStorage 기반입니다.
              실제 운영 전환 시 <code className="font-mono text-[11.5px]">lib/hq-*-store.ts</code>를
              백엔드 API로 교체하면 됩니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  tone: "brand" | "success" | "warning" | "danger";
}) {
  const toneStyles: Record<typeof tone, string> = {
    brand: "bg-brand-50 text-brand-600",
    success: "bg-[#E6F8EE] text-[#138A4D]",
    warning: "bg-[#FFF6E5] text-[#B07700]",
    danger: "bg-[#FDECEC] text-[#C13B3B]",
  };
  return (
    <div className="rounded-2xl border border-divider bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            toneStyles[tone]
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-0.5">
        <span className="text-[11.5px] font-medium text-ink-tertiary">{label}</span>
        <span className="text-[20px] font-bold leading-tight text-ink-primary">
          {value}
        </span>
        <span className="text-[11px] text-ink-tertiary">{sub}</span>
      </div>
    </div>
  );
}

function StatusBox({
  icon: Icon,
  label,
  count,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  tone: "success" | "warning" | "danger";
}) {
  const toneText: Record<typeof tone, string> = {
    success: "text-[#138A4D]",
    warning: "text-[#B07700]",
    danger: "text-[#C13B3B]",
  };
  const toneBg: Record<typeof tone, string> = {
    success: "bg-[#E6F8EE]",
    warning: "bg-[#FFF6E5]",
    danger: "bg-[#FDECEC]",
  };
  return (
    <div className={cn("flex items-center gap-3 rounded-xl p-3", toneBg[tone])}>
      <Icon className={cn("h-5 w-5 flex-none", toneText[tone])} />
      <div className="flex flex-col leading-tight">
        <span className={cn("text-[20px] font-bold", toneText[tone])}>{count}</span>
        <span className="text-[11.5px] font-medium text-ink-secondary">{label}</span>
      </div>
    </div>
  );
}
