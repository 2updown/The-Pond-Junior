"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Trash2, Send, FileText } from "lucide-react";
import {
  useHqNotices,
  removeHqNotice,
  type HqNoticeAudience,
} from "@/lib/hq-notices-store";
import { useAcademies } from "@/lib/hq-academies-store";
import { HqComposeModal } from "@/components/pond/hq-compose-modal";

export default function HqNoticesPage() {
  const notices = useHqNotices("notice");
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
            본사 공지사항
          </h1>
          <p className="text-[13px] text-ink-secondary">
            전 학원 또는 특정 그룹에 본사 공지를 발송합니다. 푸시 알림이 필요하면{" "}
            <Link
              href="/hq/notices/push"
              className="font-semibold text-brand-500 hover:text-brand-600"
            >
              푸시 발송
            </Link>
            을 이용하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setComposeOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-brand-600"
        >
          <Plus className="h-3.5 w-3.5" />새 공지 작성
        </button>
      </header>

      <div className="flex flex-col gap-3">
        {notices.length === 0 ? (
          <div className="rounded-2xl border border-divider bg-white px-4 py-12 text-center text-[12.5px] text-ink-tertiary">
            아직 발송된 공지가 없습니다.
          </div>
        ) : (
          notices.map((n) => (
            <article
              key={n.id}
              className="rounded-2xl border border-divider bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#FFF6E5] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-[#B07700]">
                      <FileText className="h-3 w-3" />
                      공지
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
                    if (confirm("이 공지를 삭제하시겠습니까?")) {
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
          kind="notice"
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

