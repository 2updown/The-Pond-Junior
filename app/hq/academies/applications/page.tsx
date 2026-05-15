"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  useAcademies,
  approveAcademy,
  updateAcademy,
} from "@/lib/hq-academies-store";

export default function HqAcademyApplicationsPage() {
  const all = useAcademies();
  const pending = all.filter((a) => a.status === "pending");

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[12px] text-ink-tertiary">
          <Link
            href="/hq/academies"
            className="inline-flex items-center gap-1 font-semibold text-brand-500 hover:text-brand-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            학원 목록
          </Link>
          <span>/</span>
          <span>가입 신청</span>
        </div>
        <h1 className="text-[22px] font-bold text-ink-primary md:text-[26px]">
          가입 신청 검토
        </h1>
        <p className="text-[13px] text-ink-secondary">
          신규 학원 가입 신청을 검토하고 승인/반려할 수 있습니다. 승인된 학원은 즉시 운영 상태로 전환됩니다.
        </p>
      </header>

      {pending.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-divider bg-white px-4 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F8EE] text-[#138A4D]">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <h2 className="text-[15px] font-bold text-ink-primary">
            대기 중인 가입 신청이 없습니다
          </h2>
          <p className="text-[12.5px] text-ink-tertiary">
            새 신청이 접수되면 여기에서 검토할 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pending.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-divider bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[15.5px] font-bold text-ink-primary">
                      {a.name}
                    </h2>
                    <span className="inline-flex w-fit items-center gap-1 rounded-md bg-[#FFF6E5] px-2 py-0.5 text-[11px] font-semibold text-[#B07700]">
                      가입 대기
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:self-start">
                  <button
                    type="button"
                    onClick={() => approveAcademy(a.id)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-brand-600"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    승인
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAcademy(a.id, { status: "suspended" })}
                    className="inline-flex items-center gap-1.5 rounded-md border border-divider bg-white px-3 py-2 text-[12.5px] font-semibold text-ink-secondary hover:bg-muted"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    반려
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoRow icon={MapPin} label="지역" value={a.region} />
                <InfoRow icon={Calendar} label="신청일" value={a.joinedAt} />
                <InfoRow
                  icon={Mail}
                  label="원장 이메일"
                  value={a.ownerEmail}
                />
                <InfoRow
                  icon={Phone}
                  label="연락처"
                  value={a.ownerPhone}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-[#F8FAFD] px-3 py-2.5">
      <Icon className="h-4 w-4 flex-none text-ink-tertiary" />
      <div className="flex min-w-0 flex-col">
        <span className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-tertiary">
          {label}
        </span>
        <span className="truncate text-[12.5px] font-medium text-ink-primary">
          {value}
        </span>
      </div>
    </div>
  );
}
