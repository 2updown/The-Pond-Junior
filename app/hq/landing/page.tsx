"use client";

import * as React from "react";
import Link from "next/link";
import {
  Globe,
  Building2,
  CheckCircle2,
  Crown,
  Lock,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import {
  useAcademies,
  setLandingEnabled,
  type AcademyPlan,
} from "@/lib/hq-academies-store";
import { cn } from "@/lib/utils";

// For the demo deployment, the publicly visible landing site corresponds to
// the first academy (강남점). LandingGuard reads the same constant.
const SITE_ACADEMY_ID = "ac1";

export default function HqLandingPage() {
  const all = useAcademies();
  const active = all.filter((a) => a.status === "active");
  const enabled = active.filter((a) => a.landingEnabled);
  const eligible = active.filter((a) => a.plan === "pro" || a.plan === "basic");
  const site = all.find((a) => a.id === SITE_ACADEMY_ID);

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

      {/* Current site master toggle */}
      {site && (
        <section
          className={cn(
            "rounded-2xl border p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
            site.landingEnabled
              ? "border-brand-500/40 bg-white"
              : "border-[#F5C6C6] bg-[#FFF7F7]"
          )}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex h-11 w-11 flex-none items-center justify-center rounded-xl",
                  site.landingEnabled
                    ? "bg-brand-500 text-white"
                    : "bg-[#C13B3B] text-white"
                )}
              >
                <Globe className="h-5 w-5" />
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-[15.5px] font-bold text-ink-primary">
                    현재 사이트 — {site.name}
                  </h2>
                  <span className="rounded-md border border-divider bg-white px-1.5 py-0.5 text-[10.5px] font-semibold text-ink-secondary">
                    데모
                  </span>
                </div>
                <p className="text-[12.5px] leading-relaxed text-ink-secondary">
                  이 토글이 현재 도메인의 랜딩페이지(<code className="font-mono text-[11.5px]">/</code>,{" "}
                  <code className="font-mono text-[11.5px]">/about</code>,{" "}
                  <code className="font-mono text-[11.5px]">/programs</code> 등) 노출 여부를 결정합니다.
                  끄면 모든 방문자는 자동으로{" "}
                  <code className="font-mono text-[11.5px]">/login</code>으로 이동합니다.
                </p>
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-1 text-[12px] font-semibold text-brand-500 hover:text-brand-600"
                >
                  사이트 새 창에서 열기
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3 md:self-center">
              <div className="text-right">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-tertiary">
                  현재 상태
                </div>
                <div
                  className={cn(
                    "text-[14px] font-bold",
                    site.landingEnabled ? "text-brand-500" : "text-[#C13B3B]"
                  )}
                >
                  {site.landingEnabled ? "랜딩 노출 중" : "랜딩 비공개"}
                </div>
              </div>
              <MasterToggle
                enabled={site.landingEnabled}
                onChange={(v) => setLandingEnabled(site.id, v)}
              />
            </div>
          </div>

          {!site.landingEnabled && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-[#F5C6C6] bg-white px-3 py-2 text-[12px] leading-relaxed text-[#C13B3B]">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none" />
              <span>
                지금 랜딩이 꺼진 상태입니다. 메인 도메인(<code className="font-mono">/</code>) 접속 시 즉시 로그인 화면으로 이동합니다.
              </span>
            </div>
          )}
        </section>
      )}

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

/* Large iOS-style toggle for the master site switch */
function MasterToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-8 w-14 flex-none items-center rounded-full transition-colors",
        enabled ? "bg-brand-500" : "bg-[#D1D5DB]"
      )}
    >
      <span
        className={cn(
          "inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform",
          enabled ? "translate-x-7" : "translate-x-1"
        )}
      />
    </button>
  );
}
