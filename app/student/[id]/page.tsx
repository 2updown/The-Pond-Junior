"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Avatar } from "@/components/pond/avatar";
import { Chip } from "@/components/pond/chip";
import { InfoBox } from "@/components/pond/info-box";
import { STUDENTS, CONSULTATIONS_UPCOMING, CONSULTATIONS_PAST, TODOS_ACTIVE, TODOS_DONE } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tab = "consult" | "todo" | "memo";

export default function StudentDetailPage() {
  const params = useParams() as { id: string };
  const student = STUDENTS.find((s) => s.id === params.id);
  const [tab, setTab] = React.useState<Tab>("consult");
  if (!student) notFound();

  const consults = [...CONSULTATIONS_UPCOMING, ...CONSULTATIONS_PAST].filter(
    (c) => c.studentId === student.id
  );

  return (
    <>
      <Topbar title="학생 상세" variant="back" />
      <AppShell hideBottomNav>
        <div className="flex items-center gap-3.5 rounded-2xl bg-white px-4 py-[18px] shadow-elev1">
          <Avatar initial={student.initial} color={student.color} size="lg" />
          <div className="flex-1">
            <div className="text-base font-bold">{student.name}</div>
            <div className="text-xs text-ink-secondary">
              {student.grade} · {student.subject}
            </div>
            <div className="text-xs text-ink-secondary">{student.phone}</div>
          </div>
          <Chip variant="scheduled">활성</Chip>
        </div>

        <div className="flex border-b border-divider">
          {(["consult", "todo", "memo"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 border-b-2 py-3 text-sm font-semibold -mb-px transition-colors",
                tab === t ? "border-brand-500 text-brand-500" : "border-transparent text-ink-tertiary"
              )}
            >
              {t === "consult" ? "상담 이력" : t === "todo" ? "할일" : "메모"}
            </button>
          ))}
        </div>

        {tab === "consult" && (
          <div className="flex flex-col gap-3.5">
            {consults.length === 0 && (
              <p className="text-center text-xs text-ink-tertiary">상담 이력이 없습니다.</p>
            )}
            {consults.map((c) => (
              <Link key={c.id} href={`/consultation/${c.id}`} className="pond-card flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">
                    {c.date.slice(5).replace("-", "/")} {c.startTime}
                  </span>
                  <Chip variant={c.status === "scheduled" ? "scheduled" : c.status === "done" ? "done" : "canceled"}>
                    {c.status === "scheduled" ? "예정" : c.status === "done" ? "완료" : "취소"}
                  </Chip>
                </div>
                {c.note && <div className="text-xs text-ink-secondary">{c.note}</div>}
              </Link>
            ))}
          </div>
        )}

        {tab === "todo" && (
          <div className="flex flex-col gap-3.5">
            {[...TODOS_ACTIVE, ...TODOS_DONE].map((t) => (
              <Link key={t.id} href={`/todo/${t.id}`} className="pond-card">
                <div className="font-semibold">{t.title}</div>
                <div className={cn("mt-1 text-xs", t.status === "done" ? "text-success" : "text-ink-secondary")}>
                  {t.status === "done" ? "제출 완료" : `D-${t.daysLeft} · 미제출`}
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === "memo" && (
          <div className="flex flex-col gap-3.5">
            <div className="pond-card">
              <div className="text-xs text-ink-tertiary">5/9 작성</div>
              <div className="font-medium leading-relaxed">
                함수 단원 약함. 다음 주에 집중 보강 필요. 학부모님께 진도표 전달함.
              </div>
            </div>
            <div className="pond-card">
              <div className="text-xs text-ink-tertiary">5/2 작성</div>
              <div className="font-medium leading-relaxed">
                집중력 좋아짐. 노트 정리 습관이 잘 잡힘.
              </div>
            </div>
          </div>
        )}

        <InfoBox>학생 정보 수정과 메모 작성은 PC에서 진행해주세요.</InfoBox>
      </AppShell>
    </>
  );
}
