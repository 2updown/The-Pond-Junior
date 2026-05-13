"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePosts } from "@/lib/posts-store";
import { useLoginState } from "@/lib/use-login-state";
import { WriteButton } from "@/components/pond/write-button";

export function NoticeBoard() {
  const notices = usePosts("notice").slice(0, 20);
  const loggedIn = useLoginState();

  return (
    <section className="bg-[#FAFBFD] py-16 md:py-20" id="notices">
      <div className="mx-auto max-w-4xl px-5">
        <div className="mb-10 flex flex-col items-center text-center md:mb-12">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">공지사항</h2>
          <p className="mt-3 text-sm text-ink-secondary">
            학원의 최신 소식과 중요한 안내를 확인하세요.
          </p>
          {loggedIn && (
            <div className="mt-5">
              <WriteButton defaultKind="notice" />
            </div>
          )}
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
              <Link
                key={n.id}
                href={`/notices/${n.id}`}
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
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
