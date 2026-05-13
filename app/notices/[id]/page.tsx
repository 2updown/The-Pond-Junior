"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Calendar, User as UserIcon } from "lucide-react";
import { LandingShell } from "@/components/pond/landing/landing-shell";
import { usePosts } from "@/lib/posts-store";
import { cn } from "@/lib/utils";

export default function NoticeDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const all = usePosts("notice");
  const post = all.find((p) => p.id === params.id);

  return (
    <LandingShell>
      <section className="mx-auto max-w-4xl px-5 py-10 md:py-14">
        {/* Back link */}
        <button
          onClick={() => router.push("/notices")}
          className="mb-5 inline-flex items-center gap-1 text-[13px] font-semibold text-ink-secondary hover:text-brand-500"
        >
          <ChevronLeft className="h-4 w-4" />
          공지사항 목록
        </button>

        {!post ? (
          <NotFoundPost />
        ) : (
          <article className="rounded-2xl border border-divider bg-white p-6 md:p-10">
            {/* Tag + date */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {(post.pinned || post.tag === "필독") && (
                <span className="rounded-md bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-600">
                  필독
                </span>
              )}
              {post.tag && post.tag !== "필독" && (
                <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-ink-secondary">
                  {post.tag}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{post.title}</h1>

            {/* Meta row */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-tertiary">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </span>
              {post.author && (
                <span className="inline-flex items-center gap-1">
                  <UserIcon className="h-3.5 w-3.5" />
                  {post.author}
                </span>
              )}
              {typeof post.views === "number" && <span>조회 {post.views}</span>}
            </div>

            <hr className="my-6 border-divider" />

            {/* Content */}
            <div className="whitespace-pre-line text-[15px] leading-relaxed text-ink-primary">
              {post.content}
            </div>
          </article>
        )}

        {/* Other notices */}
        {post && all.length > 1 && (
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-bold text-ink-secondary">다른 공지사항</h3>
            <div className="overflow-hidden rounded-2xl border border-divider bg-white">
              {all
                .filter((p) => p.id !== post.id)
                .slice(0, 5)
                .map((n, i, arr) => (
                  <Link
                    key={n.id}
                    href={`/notices/${n.id}`}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted",
                      i !== arr.length - 1 && "border-b border-divider"
                    )}
                  >
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10.5px] font-semibold",
                        n.pinned || n.tag === "필독"
                          ? "bg-brand-50 text-brand-600"
                          : "bg-muted text-ink-secondary"
                      )}
                    >
                      {n.tag || (n.pinned ? "필독" : "안내")}
                    </span>
                    <span className="flex-1 truncate text-ink-primary">{n.title}</span>
                    <span className="hidden text-xs text-ink-tertiary md:inline">{n.date}</span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </section>
    </LandingShell>
  );
}

function NotFoundPost() {
  return (
    <div className="rounded-2xl border border-dashed border-divider bg-white px-6 py-16 text-center">
      <p className="text-sm text-ink-secondary">존재하지 않거나 삭제된 게시글입니다.</p>
      <Link
        href="/notices"
        className="mt-4 inline-block rounded-md border border-divider bg-white px-4 py-2 text-sm font-semibold text-ink-primary hover:bg-muted"
      >
        공지사항 목록으로
      </Link>
    </div>
  );
}
