import { notFound } from "next/navigation";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Avatar } from "@/components/pond/avatar";
import { Chip } from "@/components/pond/chip";
import { InfoBox } from "@/components/pond/info-box";
import { TODOS_ACTIVE, TODOS_DONE } from "@/lib/mock-data";
import type { AvatarColor } from "@/types";

const SUB_SAMPLE: { name: string; initial: string; color: AvatarColor; submitted?: string }[] = [
  { name: "김민서", initial: "김", color: "blue", submitted: "5/11 21:00 제출" },
  { name: "박지호", initial: "박", color: "cyan", submitted: "5/11 18:30 제출" },
  { name: "이서윤", initial: "이", color: "purple", submitted: "5/10 22:10 제출" },
  { name: "정유나", initial: "정", color: "green" },
  { name: "최도현", initial: "최", color: "blue" },
];

export default function TodoDetailPage({ params }: { params: { id: string } }) {
  const t = [...TODOS_ACTIVE, ...TODOS_DONE].find((x) => x.id === params.id);
  if (!t) notFound();
  const ratio = t.total > 0 ? (t.submitted / t.total) * 100 : 0;

  return (
    <>
      <Topbar title="할일 상세" variant="back" />
      <AppShell hideBottomNav>
        <div className="pond-card">
          <div className="text-base font-bold">{t.title}</div>
          <div className="mt-1 text-xs text-ink-secondary">
            마감까지 D-{t.daysLeft}
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-brand-500" style={{ width: `${ratio}%` }} />
            </div>
            <span className="text-[11px] font-semibold text-ink-secondary">
              {t.submitted}/{t.total} 제출됨
            </span>
          </div>
        </div>

        {t.description && (
          <div className="pond-card">
            <div className="text-xs font-semibold text-ink-tertiary">할일 설명</div>
            <div className="font-medium leading-relaxed">{t.description}</div>
          </div>
        )}

        <div>
          <div className="px-1 py-2 text-xs font-semibold text-ink-tertiary">제출 현황</div>
          <div className="flex flex-col gap-2.5">
            {SUB_SAMPLE.map((s) => (
              <div key={s.name} className="pond-card flex items-center gap-3.5">
                <Avatar initial={s.initial} color={s.color} />
                <div className="flex-1">
                  <div className="font-semibold">{s.name}</div>
                  <div className={"text-xs " + (s.submitted ? "text-success" : "text-ink-tertiary")}>
                    {s.submitted || "미제출"}
                  </div>
                </div>
                {s.submitted && <Chip variant="done">제출</Chip>}
              </div>
            ))}
          </div>
        </div>

        <InfoBox>제출물 채점·코멘트는 PC에서 진행해주세요.</InfoBox>
      </AppShell>
    </>
  );
}
