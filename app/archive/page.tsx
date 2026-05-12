"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Chip } from "@/components/pond/chip";
import { InfoBox } from "@/components/pond/info-box";
import { VOCA_ARCHIVE, SENTENCE_ARCHIVE } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tab = "voca" | "sentence";

export default function ArchivePage() {
  const sp = useSearchParams();
  const initial = (sp?.get("tab") as Tab) || "voca";
  const [tab, setTab] = React.useState<Tab>(initial);

  React.useEffect(() => {
    if (sp?.get("tab")) setTab(sp.get("tab") as Tab);
  }, [sp]);

  const list = tab === "voca" ? VOCA_ARCHIVE : SENTENCE_ARCHIVE;

  return (
    <>
      <Topbar title="Archive" />
      <AppShell hideBottomNav>
        <div className="flex border-b border-divider">
          {(["voca", "sentence"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 border-b-2 py-3 text-sm font-semibold -mb-px transition-colors",
                tab === t ? "border-brand-500 text-brand-500" : "border-transparent text-ink-tertiary"
              )}
            >
              {t === "voca" ? "Voca" : "Sentence"}
            </button>
          ))}
        </div>

        {tab === "voca" && (
          <div className="grid grid-cols-2 gap-2.5">
            <div className="pond-card">
              <div className="text-[11px] font-semibold text-ink-secondary">등록 단어</div>
              <div className="text-xl font-bold">3,248</div>
            </div>
            <div className="pond-card">
              <div className="text-[11px] font-semibold text-ink-secondary">AI 문장 생성</div>
              <div className="text-xl font-bold">1,920</div>
            </div>
          </div>
        )}

        <InfoBox variant="brand">
          {tab === "voca"
            ? "학원에서 사용하는 단어 등록 · 온라인 학습 연동 · 각종 시험지 자동 출력. AI가 예문과 빈칸·오답을 생성합니다."
            : "교재 문장 등록 · 이미지/PDF 업로드 시 텍스트 추출 · AI 빈칸·청크 자동 생성."}
        </InfoBox>

        <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
          {list.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2.5 border-b border-divider px-4 py-3 last:border-b-0"
            >
              <div className="flex-1">
                <div className="text-[13px] font-medium">{item.title}</div>
                <div className="text-[11px] text-ink-secondary">{item.meta}</div>
              </div>
              <Chip
                variant={item.status === "done" ? "done" : item.status === "progress" ? "scheduled" : "muted"}
              >
                {item.status === "done" ? "완료" : item.status === "progress" ? "진행" : "대기"}
              </Chip>
            </div>
          ))}
        </div>
      </AppShell>
    </>
  );
}
