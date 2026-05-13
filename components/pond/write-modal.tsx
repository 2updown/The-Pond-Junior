"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { addPost, type PostKind } from "@/lib/posts-store";
import { useToast } from "@/components/ui/toast";

interface WriteModalProps {
  open: boolean;
  onClose: () => void;
  defaultKind?: PostKind;
}

const KIND_LABEL: Record<PostKind, string> = {
  notice: "공지사항",
  schedule: "학원 일정",
  photo: "사진/갤러리",
  menu: "식단/메뉴",
};

const TAG_OPTIONS: Record<PostKind, string[]> = {
  notice: ["필독", "안내", "공지"],
  schedule: ["학사", "행사", "휴원"],
  photo: [],
  menu: [],
};

export function WriteModal({ open, onClose, defaultKind = "notice" }: WriteModalProps) {
  const { toast } = useToast();
  const [kind, setKind] = React.useState<PostKind>(defaultKind);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [pinned, setPinned] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setKind(defaultKind);
      setTitle("");
      setContent("");
      setTag("");
      setPinned(false);
    }
  }, [open, defaultKind]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    addPost({
      kind,
      title: title.trim(),
      content: content.trim(),
      tag: tag || undefined,
      pinned,
      author: "Letitu 선생님",
    });
    toast({ message: "게시글이 등록되었습니다." });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 px-5 py-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="글쓰기"
        className="relative w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-lg font-bold tracking-tight">글쓰기</h2>

        {/* Kind selector (segmented) */}
        <div className="mb-4">
          <div className="mb-2 text-[12px] font-semibold text-ink-tertiary">분류</div>
          <div className="flex gap-1.5 rounded-md bg-muted p-1">
            {(Object.keys(KIND_LABEL) as PostKind[]).map((k) => (
              <button
                key={k}
                onClick={() => {
                  setKind(k);
                  setTag("");
                }}
                className={cn(
                  "flex-1 rounded-[8px] py-1.5 text-[12.5px] font-semibold transition-colors",
                  k === kind ? "bg-white text-ink-primary shadow-elev1" : "text-ink-tertiary"
                )}
              >
                {KIND_LABEL[k]}
              </button>
            ))}
          </div>
        </div>

        {/* Tag (optional) */}
        {TAG_OPTIONS[kind].length > 0 && (
          <div className="mb-4">
            <div className="mb-2 text-[12px] font-semibold text-ink-tertiary">태그</div>
            <div className="flex flex-wrap gap-1.5">
              {TAG_OPTIONS[kind].map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t === tag ? "" : t)}
                  className={cn(
                    "rounded-pill px-3 py-1 text-[12px] font-semibold transition-colors",
                    t === tag
                      ? "bg-brand-500 text-white"
                      : "bg-muted text-ink-secondary hover:bg-brand-50 hover:text-brand-600"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pinned (notice only) */}
        {kind === "notice" && (
          <div className="mb-4">
            <label className="flex items-center gap-2 text-[13px] text-ink-primary">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="h-4 w-4 accent-brand-500"
              />
              상단 고정 (필독)
            </label>
          </div>
        )}

        {/* Title */}
        <div className="mb-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="h-11 w-full rounded-md border border-divider bg-white px-3.5 text-[14px] font-medium outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        </div>

        {/* Content */}
        <div className="mb-5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={6}
            className="w-full resize-none rounded-md border border-divider bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-divider bg-white px-5 py-2.5 text-[13px] font-semibold text-ink-primary hover:bg-muted"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "rounded-md px-5 py-2.5 text-[13px] font-semibold transition-colors",
              canSubmit
                ? "bg-brand-500 text-white hover:bg-brand-600"
                : "cursor-not-allowed bg-muted text-ink-tertiary"
            )}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
