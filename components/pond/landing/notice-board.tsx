"use client";

import { cn } from "@/lib/utils";
import { usePosts } from "@/lib/posts-store";

export function NoticeBoard() {
  const notices = usePosts("notice").slice(0, 6);

  return (
    <section className="bg-[#FAFBFD] py-16 md:py-20" id="notices">
      <div className="mx-auto max-w-4xl px-5">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">공지사항</h2>
          <p className="mt-3 text-sm text-ink-secondary">
            학원의 최신 소식과 중요한 안내를 확인하세요.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-divider bg-white">
          {notices.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-ink-tertiary">
              등록된 공지가 없습니다.
            </div>
          )}
          {notices.map((n, i) => {
            const isPinned = n.pinned || n.tag === "필독";
            return (
              <a
                key={n.id}
                href="#"
                className={cn(
                  "flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted",
                  i !== notices.length - 1 && "border-b border-divider"
                )}
              >
                <span
                  className={cn(
                    "rounded-md px-2 py-1 text-[11px] font-semibold",
                    isPinned ? "bg-brand-50 text-brand-600" : "bg-muted text-ink-secondary"
                  )}
                >
                  {n.tag || (isPinned ? "필독" : "안내")}
                </span>
                <span className="flex-1 truncate text-sm text-ink-primary">{n.title}</span>
                <span className="hidden text-xs text-ink-tertiary md:inline">{n.date}</span>
              </a>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <button className="rounded-md border border-divider bg-white px-6 py-3 text-sm font-semibold text-ink-primary hover:bg-muted">
            더보기
          </button>
        </div>
      </div>
    </section>
  );
}
