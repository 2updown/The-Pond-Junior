"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Trash2, Send, Smartphone, BellRing } from "lucide-react";
import {
  useHqNotices,
  removeHqNotice,
  type HqNoticeAudience,
} from "@/lib/hq-notices-store";
import { useAcademies } from "@/lib/hq-academies-store";
import { HqComposeModal } from "@/components/pond/hq-compose-modal";

export default function HqPushPage() {
  const pushes = useHqNotices("push");
  const academies = useAcademies();
  const [composeOpen, setComposeOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-500">
            본사 공지/푸시 발송
          </p>
          <h1 className="text-[22px] font-bold text-ink-primary md:text-[26px]">
            푸시 발송 내역
          </h1>
          <p className="text-[13px] text-ink-secondary">
            학원 관리자의 모바일 어플에 푸시 알림을 발송합니다. 즉시 알림이 필요할 때 사용합니다.
            텍스트 본문만 작성 가능하면{" "}
            <Link
              href="/hq/notices"
              className="font-semibold text-brand-500 hover:text-brand-600"
            >
              본사 공지사항
            </Link>
            을 이용하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setComposeOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-brand-600"
        >
          <Plus className="h-3.5 w-3.5" />새 푸시 발송
        </button>
      </header>

      <div className="rounded-2xl border border-brand-500/25 bg-brand-50 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-brand-500 text-white">
            <Smartphone className="h-4 w-4" />
          </span>
          <div className="text-[12.5px] leading-relaxed text-ink-secondary">
            <span className="font-semibold text-brand-600">푸시 발송 안내</span>
            <p className="mt-0.5">
              발송 시점에 어플이 백그라운드/종료 상태여도 알림이 전달됩니다. 본문은 100자 이내로 작성하는 것을 권장합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {pushes.length === 0 ? (
          <div className="rounded-2xl border border-divider bg-white px-4 py-12 text-center text-[12.5px] text-ink-tertiary">
            아직 발송된 푸시가 없습니다.
          </div>
        ) : (
          pushes.map((n) => (
            <article
              key={n.id}
              className="rounded-2xl border border-divider bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-brand-600">
                      <BellRing className="h-3 w-3" />
                      푸시
                    </span>
                    <AudienceBadge audience={n.audience} />
                    <StatusBadge status={n.status} sentCount={n.sentCount} />
                  </div>
                  <h2 className="text-[15.5px] font-bold text-ink-primary">
                    {n.title}
                  </h2>
                  <p className="whitespace-pre-line text-[13px] leading-relaxed text-ink-secondary">
                    {n.content}
                  </p>
                  <div className="mt-1 text-[11.5px] text-ink-tertiary">
                    {n.date} · {n.author}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("이 푸시 기록을 삭제하시겠습니까?")) {
                      removeHqNotice(n.id);
                    }
                  }}
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-md text-ink-tertiary hover:bg-muted hover:text-[#C13B3B]"
                  aria-label="삭제"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {composeOpen && (
        <HqComposeModal
          academyCount={academies.length}
          activeCount={academies.filter((a) => a.status === "active").length}
          proCount={academies.filter((a) => a.plan === "pro").length}
          onClose={() => setComposeOpen(false)}
          kind="push"
        />
      )}
    </div>
  );
}

function AudienceBadge({ audience }: { audience: HqNoticeAudience }) {
  const map: Record<HqNoticeAudience, string> = {
    all: "전체 학원",
    active: "운영 중 학원",
    pro: "Pro 플랜",
    custom: "지정 학원",
  };
  return (
    <span className="inline-flex items-center rounded-md border border-divider bg-white px-2 py-0.5 text-[10.5px] font-semibold text-ink-secondary">
      {map[audience]}
    </span>
  );
}

function StatusBadge({
  status,
  sentCount,
}: {
  status: "draft" | "sent";
  sentCount?: number;
}) {
  if (status === "draft") {
    return (
      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10.5px] font-semibold text-ink-secondary">
        초안
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[10.5px] font-semibold text-brand-600">
      <Send className="h-2.5 w-2.5" />
      {sentCount ?? 0}곳 발송
    </span>
  );
}
