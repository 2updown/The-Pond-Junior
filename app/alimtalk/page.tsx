"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Chip } from "@/components/pond/chip";
import { ALIMTALK_SETTINGS, ALIMTALK_LOGS, CHARGE_LOGS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tab = "setting" | "history" | "charge";

export default function AlimtalkPage() {
  const sp = useSearchParams();
  const initial = (sp?.get("tab") as Tab) || "setting";
  const [tab, setTab] = React.useState<Tab>(initial);
  const [settings, setSettings] = React.useState(ALIMTALK_SETTINGS);

  React.useEffect(() => {
    if (sp?.get("tab")) setTab(sp.get("tab") as Tab);
  }, [sp]);

  const toggle = (id: string) =>
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );

  return (
    <>
      <Topbar title="학부모 알림톡" />
      <AppShell hideBottomNav>
        <div className="flex border-b border-divider">
          {(["setting", "history", "charge"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 border-b-2 py-3 text-sm font-semibold -mb-px transition-colors",
                tab === t ? "border-brand-500 text-brand-500" : "border-transparent text-ink-tertiary"
              )}
            >
              {t === "setting" ? "자동 발송" : t === "history" ? "발송 내역" : "충전"}
            </button>
          ))}
        </div>

        {tab === "setting" && (
          <div className="flex flex-col gap-3.5">
            {settings.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3.5 rounded-md bg-white px-4 py-3.5 shadow-elev1"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-ink-secondary">{s.description}</div>
                </div>
                <button
                  onClick={() => toggle(s.id)}
                  className={cn(
                    "relative h-[26px] w-11 flex-none rounded-full transition-colors",
                    s.enabled ? "bg-brand-500" : "bg-muted"
                  )}
                  aria-pressed={s.enabled}
                >
                  <span
                    className={cn(
                      "absolute top-[3px] block h-5 w-5 rounded-full bg-white transition-transform",
                      s.enabled ? "translate-x-[22px]" : "translate-x-[3px]"
                    )}
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "history" && (
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="pond-card">
                <div className="text-[11px] font-semibold text-ink-secondary">이번 달 발송</div>
                <div className="text-xl font-bold">428건</div>
              </div>
              <div className="pond-card">
                <div className="text-[11px] font-semibold text-ink-secondary">성공률</div>
                <div className="text-xl font-bold">98.4%</div>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
              {ALIMTALK_LOGS.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center gap-2.5 border-b border-divider px-4 py-3 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{l.title}</div>
                    <div className="text-[11px] text-ink-secondary">{l.meta}</div>
                  </div>
                  <Chip variant={l.status === "success" ? "done" : "canceled"}>
                    {l.status === "success" ? "성공" : "실패"}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "charge" && (
          <div className="flex flex-col gap-3.5">
            <div className="pond-card flex flex-col gap-1.5 bg-gradient-to-br from-brand-500 to-[#7BB1FF] text-white">
              <div className="text-xs opacity-90">잔여 알림톡</div>
              <div className="text-[32px] font-extrabold tracking-tight">2,572 건</div>
              <div className="text-[11px] opacity-90">건당 13원 · 약 33,436원 상당</div>
            </div>
            <button className="h-12 rounded-md bg-brand-500 font-semibold text-white hover:bg-brand-600">
              충전하기
            </button>
            <div className="px-1 pt-2 text-xs font-semibold text-ink-tertiary">충전 내역</div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
              {CHARGE_LOGS.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2.5 border-b border-divider px-4 py-3 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{c.title}</div>
                    <div className="text-[11px] text-ink-secondary">{c.meta}</div>
                  </div>
                  <Chip variant="done">완료</Chip>
                </div>
              ))}
            </div>
          </div>
        )}
      </AppShell>
    </>
  );
}
