"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { addHqNotice, type HqNoticeAudience } from "@/lib/hq-notices-store";
import { cn } from "@/lib/utils";

export function HqComposeModal({
  onClose,
  academyCount,
  activeCount,
  proCount,
  kind,
}: {
  onClose: () => void;
  academyCount: number;
  activeCount: number;
  proCount: number;
  kind: "notice" | "push";
}) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [audience, setAudience] = React.useState<HqNoticeAudience>("all");

  const audienceCount =
    audience === "all"
      ? academyCount
      : audience === "active"
      ? activeCount
      : audience === "pro"
      ? proCount
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addHqNotice({
      kind,
      title: title.trim(),
      content: content.trim(),
      audience,
      author: "본사 운영팀",
      status: "sent",
      sentCount: audienceCount,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[560px] rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-[17px] font-bold text-ink-primary">
          새 {kind === "push" ? "푸시 알림" : "공지"} 작성
        </h2>
        <p className="mt-1 text-[12.5px] text-ink-tertiary">
          선택한 대상의 학원 관리자에게 전달됩니다.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <Field label="제목">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="예) 6월 정기점검 일정 안내"
              className="h-10 w-full rounded-lg border border-divider bg-white px-3 text-[13px] text-ink-primary placeholder:text-ink-tertiary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
            />
          </Field>

          <Field label="내용">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              placeholder="공지/푸시 본문을 입력하세요."
              className="w-full resize-none rounded-lg border border-divider bg-white px-3 py-2 text-[13px] leading-relaxed text-ink-primary placeholder:text-ink-tertiary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
            />
          </Field>

          <Field label={`발송 대상 (${audienceCount}곳)`}>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["all", `전체 학원 (${academyCount})`],
                  ["active", `운영 중 학원 (${activeCount})`],
                  ["pro", `Pro 플랜 (${proCount})`],
                  ["custom", "직접 지정"],
                ] as [HqNoticeAudience, string][]
              ).map(([id, label]) => {
                const isActive = audience === id;
                const isDisabled = id === "custom"; // not implemented in MVP
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setAudience(id)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-[12.5px] transition-colors",
                      isActive
                        ? "border-brand-500 bg-brand-50 font-semibold text-brand-600"
                        : "border-divider bg-white text-ink-secondary hover:bg-muted",
                      isDisabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    {label}
                    {isDisabled && (
                      <div className="text-[10.5px] text-ink-tertiary">
                        준비 중
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-divider bg-white px-3.5 py-2 text-[12.5px] font-semibold text-ink-secondary hover:bg-muted"
          >
            취소
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-brand-600"
          >
            <Send className="h-3.5 w-3.5" />
            발송
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-semibold text-ink-secondary">
        {label}
      </span>
      {children}
    </label>
  );
}
