"use client";

import * as React from "react";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Chip } from "@/components/pond/chip";
import { SUPPORT_TICKETS, SUPPORT_FAQS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tab = "my" | "faq";

export default function SupportPage() {
  const [tab, setTab] = React.useState<Tab>("my");

  return (
    <>
      <Topbar title="본사 고객센터" />
      <AppShell hideBottomNav>
        <div className="pond-card flex flex-col gap-1.5 bg-gradient-to-br from-brand-500 to-[#7BB1FF] text-white">
          <div className="text-xs opacity-90">고객센터</div>
          <div className="text-base font-semibold">customerservice@letitu.io</div>
          <div className="mt-1 text-[11px] opacity-85">평일 10:00-18:00 · 답변까지 평균 4시간</div>
        </div>

        <button className="h-12 rounded-md bg-brand-500 font-semibold text-white hover:bg-brand-600">
          문의하기
        </button>

        <div className="flex border-b border-divider">
          {(["my", "faq"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 border-b-2 py-3 text-sm font-semibold -mb-px transition-colors",
                tab === t ? "border-brand-500 text-brand-500" : "border-transparent text-ink-tertiary"
              )}
            >
              {t === "my" ? "내 문의" : "자주 묻는 질문"}
            </button>
          ))}
        </div>

        {tab === "my" ? (
          <div className="flex flex-col gap-3.5">
            {SUPPORT_TICKETS.map((t) => (
              <div key={t.id} className="pond-card flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{t.title}</span>
                  <Chip variant={t.status === "answered" ? "done" : "scheduled"}>
                    {t.status === "answered" ? "답변완료" : "답변대기"}
                  </Chip>
                </div>
                <div className="mt-1 text-[11px] text-ink-tertiary">
                  {t.date}
                  {t.answeredAt && ` · 답변 ${t.answeredAt}`}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {SUPPORT_FAQS.map((f) => (
              <div key={f.id} className="pond-card font-semibold">
                {f.title}
              </div>
            ))}
          </div>
        )}
      </AppShell>
    </>
  );
}
