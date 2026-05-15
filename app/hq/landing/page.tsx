"use client";

import * as React from "react";
import {
  Globe,
  Building2,
  CheckCircle2,
  Crown,
  Lock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  useAcademies,
  setLandingEnabled,
  type AcademyPlan,
} from "@/lib/hq-academies-store";
import { cn } from "@/lib/utils";

export default function HqLandingPage() {
  const all = useAcademies();
  const active = all.filter((a) => a.status === "active");
  const enabled = active.filter((a) => a.landingEnabled);
  const eligible = active.filter((a) => a.plan === "pro" || a.plan === "basic");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-500">
          랜딩페이지 (유료)
        </p>
        <h1 className="text-[22px] font-bold text-ink-primary md:text-[26px]">
          학원별 랜딩페이지 기능 사용 설정
        </h1>
        <p className="text-[13px] text-ink-secondary">
          각 학원에게 노출되는 자체 랜딩페이지(/about, /programs 등) 빌더 사용 여부를 본사가 일괄 관리합니다.
          <strong className="font-semibold"> Pro / Basic 플랜에서만 활성화</strong>할 수 있습니다.
        </p>
      </header>

      {/* Summary */}
      <section className="grid grid-cols-3 gap-3">
        <SummaryCard
          icon={Globe}
          label="기능 사용 중"
          value={`${enabled.length}곳`}
          tone="brand"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="활성화 가능 학원"
          value={`${eligible.length}곳`}
          tone="success"
        />
        <SummaryCard
          icon={Lock}
          label="플랜 업그레이드 필요"
          value={`${active.length - eligible.length}곳`}
          tone="warning"
        />
      </section>

      {/* Pricing card */}
      <section className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-50 to-white p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-500 text-white">
            <Crown className="h-5 w-5" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-bold text-brand-600">
              랜딩페이지 빌더는 유료 부가 기능입니다
            </h2>
            <p className="text-[12.5px] leading-relaxed text-ink-secondary">
              학원별 도메인 연결, 갤러리, 공지, 프로그램 소개 페이지를 본사 템플릿 기반으로 운영할 수 있습니다.{" "}
              <strong>Pro 플랜</strong>은 기본 포함, <strong>Basic 플랜</strong>은 월 50,000원 추가 시 사용 가능합니다.
              Free 플랜 학원은 먼저 플랜 업그레이드가 필요합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Academy list */}
      <section className="overflow-hidden rounded-2xl border border-divider bg-white">
        <header className="flex items-center justify-between border-b border-divider bg-[#F8FAFD] px-4 py-3">
          <h2 className="text-[13px] font-bold text-ink-primary">
            학원별 활성화 상태
          </h2>
          <span className="text-[11.5px] text-ink-tertiary">
            운영 중 학원만 표시
          </span>
        </header>

        {active.length === 0 ? (
          <div className="px-4 py-12 text-center text-[12.5px] text-ink-tertiary">
            운영 중인 학원이 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-divider">
            {active.map((a) => {
              const isFree = a.plan === "free";
              return (
                <li
                  key={a.id}
                  className="flex flex-col gap-3 px-4 py-3.5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[13.5px] font-semibold text-ink-primary">
                        {a.name}
                      </span>
                      <span className="text-[11.5px] text-ink-tertiary">
                        {a.region} · 원장 {a.ownerName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PlanPill plan={a.plan} />
                    {isFree ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-ink-tertiary">
                        <Lock className="h-3 w-3" />
                        플랜 업그레이드 필요
                      </span>
                    ) : (
                      <ToggleButton
                        enabled={a.landingEnabled}
                        onChange={(v) => setLandingEnabled(a.id, v)}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="text-[11.5px] text-ink-tertiary">
        토글 변경 시 즉시 학원 측 화면에 반영됩니다. 결제 정산은 다음 정기 결제일에 자동 적용됩니다.
      </p>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "brand" | "success" | "warning";
}) {
  const toneCls: Record<typeof tone, string> = {
    brand: "bg-brand-50 text-brand-600",
    success: "bg-[#E6F8EE] text-[#138A4D]",
    warning: "bg-[#FFF6E5] text-[#B07700]",
  };
  return (
    <div className="rounded-2xl border border-divider bg-white p-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            toneCls[tone]
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[11.5px] font-medium text-ink-tertiary">
          {label}
        </span>
      </div>
      <div className="mt-2 text-[20px] font-bold text-ink-primary">{value}</div>
    </div>
  );
}

function PlanPill({ plan }: { plan: AcademyPlan }) {
  const map: Record<AcademyPlan, { label: string; cls: string }> = {
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

function ToggleButton({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
        enabled
          ? "bg-brand-500 text-white hover:bg-brand-600"
          : "border border-divider bg-white text-ink-secondary hover:bg-muted"
      )}
      aria-pressed={enabled}
    >
      {enabled ? (
        <ToggleRight className="h-3.5 w-3.5" />
      ) : (
        <ToggleLeft className="h-3.5 w-3.5" />
      )}
      {enabled ? "사용 중" : "사용 안 함"}
    </button>
  );
}
