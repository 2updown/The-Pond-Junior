"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Avatar } from "@/components/pond/avatar";
import { Chip } from "@/components/pond/chip";
import { STUDENTS } from "@/lib/mock-data";
import { PcOnlyModal } from "@/components/pond/pc-only-modal";

export default function StudentsPage() {
  const [query, setQuery] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);

  const filtered = STUDENTS.filter((s) =>
    !query || s.name.includes(query) || s.grade.includes(query) || s.subject.includes(query)
  );

  return (
    <>
      <Topbar
        title="학생 목록"
        right={
          <button
            onClick={() => setModalOpen(true)}
            aria-label="학생 등록"
            className="flex h-10 w-10 items-center justify-center text-ink-primary"
          >
            <Plus className="h-[22px] w-[22px]" />
          </button>
        }
      />
      <AppShell>
        <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 shadow-elev1">
          <Search className="h-4 w-4 text-ink-tertiary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름·메모로 검색"
            className="flex-1 bg-transparent text-sm text-ink-primary outline-none placeholder:text-ink-tertiary"
          />
        </div>

        <div className="flex flex-col gap-3.5">
          {filtered.map((s) => (
            <Link
              key={s.id}
              href={`/student/${s.id}`}
              className="pond-card flex items-center gap-3.5"
            >
              <Avatar initial={s.initial} color={s.color} />
              <div className="flex-1">
                <div className="font-semibold text-ink-primary">{s.name}</div>
                <div className="text-xs text-ink-secondary">
                  {s.grade} · {s.subject}
                  {s.nextConsultation && ` · 다음 상담 ${s.nextConsultation}`}
                  {!s.nextConsultation && " · 다음 상담 미정"}
                </div>
              </div>
              {s.openTodos > 0 && <Chip variant="scheduled">할일 {s.openTodos}</Chip>}
            </Link>
          ))}
        </div>
      </AppShell>

      <PcOnlyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        message={
          <>
            학생 등록은 PC에서 작업하면
            <br />
            훨씬 빠르게 끝낼 수 있어요.
          </>
        }
      />
    </>
  );
}
