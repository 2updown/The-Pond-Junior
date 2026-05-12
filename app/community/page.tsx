"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Chip } from "@/components/pond/chip";
import { InfoBox } from "@/components/pond/info-box";
import { SCHEDULE, NOTICES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tab = "schedule" | "notice";

export default function CommunityPage() {
  const sp = useSearchParams();
  const initial = (sp?.get("tab") as Tab) || "schedule";
  const [tab, setTab] = React.useState<Tab>(initial);

  React.useEffect(() => {
    if (sp?.get("tab")) setTab(sp.get("tab") as Tab);
  }, [sp]);

  return (
    <>
      <Topbar title="커뮤니티" />
      <AppShell hideBottomNav>
        <div className="flex border-b border-divider">
          {(["schedule", "notice"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 border-b-2 py-3 text-sm font-semibold -mb-px transition-colors",
                tab === t ? "border-brand-500 text-brand-500" : "border-transparent text-ink-tertiary"
              )}
            >
              {t === "schedule" ? "학원 일정" : "공지사항"}
            </button>
          ))}
        </div>

        {tab === "schedule" ? (
          <div className="flex flex-col gap-3.5">
            <div className="px-1 pt-1 text-xs font-semibold text-ink-tertiary">2026년 5월</div>
            {SCHEDULE.map((ev) => (
              <div key={ev.id} className="pond-card flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{ev.date}</span>
                  <Chip
                    variant={ev.category === "휴원" ? "warning" : "scheduled"}
                  >
                    {ev.category}
                  </Chip>
                </div>
                <div className="font-medium text-ink-primary">{ev.label}</div>
              </div>
            ))}
            <InfoBox>학부모 어플에서도 동일하게 노출됩니다.</InfoBox>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {NOTICES.map((n) => (
              <div key={n.id} className="pond-card flex flex-col">
                <div className="font-semibold">{n.title}</div>
                <div className="mt-1 text-[11px] text-ink-tertiary">
                  {n.date} · 조회 {n.views}
                </div>
              </div>
            ))}
          </div>
        )}
      </AppShell>
    </>
  );
}
