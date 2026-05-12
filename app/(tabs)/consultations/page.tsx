"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Segment } from "@/components/pond/segment";
import { Chip } from "@/components/pond/chip";
import { EmptyState } from "@/components/pond/empty-state";
import { useToast } from "@/components/ui/toast";
import { CONSULTATIONS_UPCOMING, CONSULTATIONS_PAST } from "@/lib/mock-data";
import type { Consultation } from "@/types";

type Tab = "upcoming" | "past";

function groupByDate(list: Consultation[]) {
  const groups: Record<string, Consultation[]> = {};
  for (const c of list) {
    if (!groups[c.date]) groups[c.date] = [];
    groups[c.date].push(c);
  }
  return groups;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

export default function ConsultationsPage() {
  const [tab, setTab] = React.useState<Tab>("upcoming");
  const [empty, setEmpty] = React.useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const t = searchParams?.get("toast");
    if (t === "password-changed") {
      toast({ message: "비밀번호가 변경되었습니다." });
      router.replace("/consultations");
    }
  }, [searchParams, toast, router]);

  const list = tab === "upcoming" ? CONSULTATIONS_UPCOMING : CONSULTATIONS_PAST;
  const groups = groupByDate(list);

  return (
    <>
      <Topbar
        title="상담 목록"
        right={
          <button
            onClick={() => setEmpty((v) => !v)}
            aria-label="빈상태 토글"
            className="flex h-10 w-10 items-center justify-center text-ink-primary"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        }
      />
      <AppShell>
        <Segment<Tab>
          options={[
            { value: "upcoming", label: "전체 일정" },
            { value: "past", label: "지난 일정" },
          ]}
          value={tab}
          onChange={setTab}
        />

        {empty ? (
          <EmptyState
            title="등록된 상담이 없어요"
            description={
              <>
                현재 모바일에서는 조회만 가능해요.
                <br />
                예약은 PC환경에서 진행해주세요!
              </>
            }
          />
        ) : (
          <div className="flex flex-col gap-3.5">
            {Object.entries(groups).map(([date, items]) => (
              <React.Fragment key={date}>
                <div className="px-1 pt-1 text-xs font-semibold text-ink-tertiary">
                  {formatDate(date)}
                </div>
                {items.map((c) => (
                  <Link
                    key={c.id}
                    href={`/consultation/${c.id}`}
                    className="pond-card flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-ink-primary">
                        {c.startTime} – {c.endTime}
                      </span>
                      <Chip variant={c.status === "scheduled" ? "scheduled" : c.status === "done" ? "done" : "canceled"}>
                        {c.status === "scheduled" ? "예정" : c.status === "done" ? "완료" : "취소"}
                      </Chip>
                    </div>
                    <div className="text-[13px] font-medium text-ink-primary">
                      {c.studentName}
                      <span className="mx-1.5 text-ink-tertiary">·</span>
                      {c.subject}
                      <span className="mx-1.5 text-ink-tertiary">·</span>
                      {c.mode === "online" ? "온라인" : "대면"}
                    </div>
                    {c.note && <div className="text-xs text-ink-secondary">{c.note}</div>}
                  </Link>
                ))}
              </React.Fragment>
            ))}
          </div>
        )}
      </AppShell>
    </>
  );
}
