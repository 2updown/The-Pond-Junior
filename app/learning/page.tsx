"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Avatar } from "@/components/pond/avatar";
import { Chip } from "@/components/pond/chip";
import { InfoBox } from "@/components/pond/info-box";
import { TODOS_ACTIVE, REPORT_LOGS, POINT_LOGS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tab = "homework" | "report" | "point";

export default function LearningPage() {
  const sp = useSearchParams();
  const initial = (sp?.get("tab") as Tab) || "homework";
  const [tab, setTab] = React.useState<Tab>(initial);

  React.useEffect(() => {
    if (sp?.get("tab")) setTab(sp.get("tab") as Tab);
  }, [sp]);

  return (
    <>
      <Topbar title="학습관리" />
      <AppShell hideBottomNav>
        <div className="flex border-b border-divider">
          {(["homework", "report", "point"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 border-b-2 py-3 text-sm font-semibold transition-colors -mb-px",
                tab === t ? "border-brand-500 text-brand-500" : "border-transparent text-ink-tertiary"
              )}
            >
              {t === "homework" ? "숙제" : t === "report" ? "리포트" : "포인트"}
            </button>
          ))}
        </div>

        {tab === "homework" && (
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
              <div className="pond-card">
                <div className="text-[11px] font-semibold text-ink-secondary">진행 중 숙제</div>
                <div className="text-xl font-bold">12</div>
              </div>
              <div className="pond-card">
                <div className="text-[11px] font-semibold text-ink-secondary">평균 제출률</div>
                <div className="text-xl font-bold">68%</div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
            {TODOS_ACTIVE.map((t) => {
              const ratio = (t.submitted / t.total) * 100;
              const full = t.submitted === t.total;
              return (
                <div key={t.id} className="pond-card flex flex-col gap-1.5">
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-xs text-ink-secondary">
                    {t.classOrStudent} · D-{t.daysLeft}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full", full ? "bg-success" : "bg-brand-500")}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-ink-secondary">
                      {t.submitted}/{t.total}
                    </span>
                  </div>
                </div>
              );
            })}
            </div>
            <InfoBox>숙제 출제·검사·삭제는 PC에서 진행해주세요.</InfoBox>
          </div>
        )}

        {tab === "report" && (
          <div className="flex flex-col gap-3.5">
            <InfoBox variant="brand">
              매주 일요일 22:00에 학생별 주간 리포트가 자동 생성되고 학부모님께 알림톡으로 발송됩니다.
            </InfoBox>
            <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
              {REPORT_LOGS.map((r) => (
                <div key={r.id} className="flex items-center gap-2.5 border-b border-divider px-4 py-3 last:border-b-0">
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{r.title}</div>
                    <div className="text-[11px] text-ink-secondary">
                      {r.count}명 발송 {r.status === "partial" ? "(일부 실패)" : "완료"} · {r.sentAt}
                    </div>
                  </div>
                  <Chip variant={r.status === "sent" ? "done" : "warning"}>
                    {r.status === "sent" ? "발송" : "일부실패"}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "point" && (
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="pond-card">
                <div className="text-[11px] font-semibold text-ink-secondary">이번 달 지급</div>
                <div className="text-xl font-bold">12,400P</div>
                <div className="text-[11px] font-semibold text-success">▲ 8.2%</div>
              </div>
              <div className="pond-card">
                <div className="text-[11px] font-semibold text-ink-secondary">사용 포인트</div>
                <div className="text-xl font-bold">3,800P</div>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
              {POINT_LOGS.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 border-b border-divider px-4 py-3 last:border-b-0">
                  <Avatar initial={p.initial} color={p.color} size="sm" />
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{p.studentName}</div>
                    <div className="text-[11px] text-ink-secondary">
                      {p.reason} · {p.date}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "font-bold",
                      p.amount > 0 ? "text-success" : "text-danger"
                    )}
                  >
                    {p.amount > 0 ? "+" : ""}
                    {p.amount.toLocaleString()}P
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </AppShell>
    </>
  );
}
