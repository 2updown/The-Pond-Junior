import Link from "next/link";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Avatar } from "@/components/pond/avatar";
import { Chip } from "@/components/pond/chip";
import { InfoBox } from "@/components/pond/info-box";
import { CONSULTATIONS_UPCOMING, CONSULTATIONS_PAST } from "@/lib/mock-data";

export default function ConsultationDetailPage({ params }: { params: { id: string } }) {
  const c =
    CONSULTATIONS_UPCOMING.find((x) => x.id === params.id) ||
    CONSULTATIONS_PAST.find((x) => x.id === params.id);
  if (!c) notFound();

  return (
    <>
      <Topbar title="상담 상세" variant="back" />
      <AppShell hideBottomNav>
        <div className="pond-card flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">
              {c.startTime} – {c.endTime}
            </span>
            <Chip variant={c.status === "scheduled" ? "scheduled" : c.status === "done" ? "done" : "canceled"}>
              {c.status === "scheduled" ? "예정" : c.status === "done" ? "완료" : "취소"}
            </Chip>
          </div>
          <div className="text-[13px] text-ink-secondary">{formatDate(c.date)}</div>
        </div>

        <div className="pond-card flex items-center gap-3.5">
          <Avatar initial={c.studentInitial} color={c.studentColor} />
          <div className="flex-1">
            <div className="font-semibold">{c.studentName}</div>
            <div className="text-xs text-ink-secondary">{c.subject}</div>
          </div>
          <Link href={`/student/${c.studentId}`} className="text-[13px] font-semibold text-brand-500">
            학생 보기 ›
          </Link>
        </div>

        <div className="pond-card">
          <div className="text-xs font-semibold text-ink-tertiary">상담 방식</div>
          <div className="font-medium">{c.mode === "online" ? "온라인 (Zoom)" : "대면"}</div>
        </div>

        {c.note && (
          <div className="pond-card">
            <div className="text-xs font-semibold text-ink-tertiary">메모</div>
            <div className="font-medium leading-relaxed">{c.note}</div>
          </div>
        )}

        <InfoBox>편집·취소는 PC에서 진행해주세요. 모바일에서는 상담 내용을 조회만 할 수 있어요.</InfoBox>
      </AppShell>
    </>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}
