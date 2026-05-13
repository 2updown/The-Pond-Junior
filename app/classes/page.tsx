"use client";

import * as React from "react";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Chip } from "@/components/pond/chip";
import { InfoBox } from "@/components/pond/info-box";
import { CLASSES } from "@/lib/mock-data";

export default function ClassesPage() {
  return (
    <>
      <Topbar title="반관리" />
      <AppShell hideBottomNav>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="pond-card">
            <div className="text-[11px] font-semibold text-ink-secondary">전체 반</div>
            <div className="text-xl font-bold">{CLASSES.length}</div>
          </div>
          <div className="pond-card">
            <div className="text-[11px] font-semibold text-ink-secondary">평균 인원</div>
            <div className="text-xl font-bold">
              {(CLASSES.reduce((s, c) => s + c.current, 0) / CLASSES.length).toFixed(1)}명
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CLASSES.map((c) => {
            const full = c.current >= c.capacity;
            return (
              <div key={c.id} className="pond-card">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold">{c.name}</span>
                  <Chip variant={full ? "canceled" : "scheduled"}>
                    {full ? `${c.current}명 (정원)` : `${c.current}명`}
                  </Chip>
                </div>
                <div className="text-xs text-ink-secondary">
                  {c.teacher} · {c.schedule}
                </div>
                <div className="text-[11px] text-ink-tertiary">
                  정원 {c.capacity}명 · 현재 {c.current}명
                  {c.waitlist && ` · 대기 ${c.waitlist}명`}
                </div>
              </div>
            );
          })}
        </div>
        <InfoBox>반 생성·삭제 및 학생 배정은 PC에서 진행해주세요.</InfoBox>
      </AppShell>
    </>
  );
}
