"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Home } from "lucide-react";
import { LandingShell } from "@/components/pond/landing/landing-shell";
import { usePosts, removePost } from "@/lib/posts-store";
import { useLoginState } from "@/lib/use-login-state";
import { useToast } from "@/components/ui/toast";

function maskAuthor(name?: string) {
  if (!name) return "관리자";
  return name[0] + "**";
}

export default function NoticeDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const { toast } = useToast();
  const loggedIn = useLoginState();
  const all = usePosts("notice");
  const post = all.find((p) => p.id === params.id);

  // posts already sorted: pinned first then newest. find adjacency.
  const idx = all.findIndex((p) => p.id === params.id);
  const prevPost = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const nextPost = idx > 0 ? all[idx - 1] : null;

  const handleDelete = () => {
    if (!post) return;
    if (confirm(`"${post.title}" 게시글을 삭제할까요?`)) {
      removePost(post.id);
      toast({ message: "게시글이 삭제되었습니다." });
      router.push("/notices");
    }
  };

  return (
    <LandingShell>
      <section className="mx-auto max-w-6xl px-5 py-8 md:py-12">
        {/* Page header — title + breadcrumb */}
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">공지사항</h1>
          <div className="flex items-center gap-1.5 text-xs text-ink-tertiary">
            <Link href="/" className="flex items-center gap-1 hover:text-brand-500">
              <Home className="h-3.5 w-3.5" />홈
            </Link>
            <span>›</span>
            <Link href="/notices" className="hover:text-brand-500">열린정보</Link>
            <span>›</span>
            <span className="font-semibold text-ink-primary">공지사항</span>
          </div>
        </div>

        {!post ? (
          <NotFound />
        ) : (
          <>
            <article className="overflow-hidden border-t-2 border-[#3B5072] bg-white shadow-elev1">
              {/* Title bar (centered) */}
              <div className="border-b border-divider bg-[#FAFBFD] px-6 py-6 text-center">
                <h2 className="text-base font-bold leading-snug tracking-tight md:text-lg">
                  {post.title}
                </h2>
              </div>

              {/* Meta table */}
              <div>
                <MetaRow label="작성자" value={maskAuthor(post.author)} />
                <MetaRow label="등록일" value={post.date} />
                <MetaRow label="조회수" value={String(post.views || 0)} />
              </div>

              {/* Content body */}
              <div className="px-6 py-8 md:px-10 md:py-12">
                <div className="whitespace-pre-line text-[14px] leading-[1.85] text-ink-primary">
                  {post.content}
                </div>
              </div>
            </article>

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              {loggedIn && (
                <>
                  <Link
                    href={`/write?id=${post.id}`}
                    className="rounded-md border border-divider bg-white px-5 py-2.5 text-sm font-semibold text-ink-primary hover:bg-muted"
                  >
                    수정
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="rounded-md border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    삭제
                  </button>
                </>
              )}
              <Link
                href="/notices"
                className="rounded-md bg-[#3B5072] px-7 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                목록
              </Link>
            </div>

            {/* Prev / Next nav */}
            <div className="mt-8 overflow-hidden border border-divider bg-white">
              <NavRow
                direction="prev"
                post={prevPost}
              />
              <NavRow
                direction="next"
                post={nextPost}
              />
            </div>
          </>
        )}
      </section>
    </LandingShell>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] border-b border-divider md:grid-cols-[160px_1fr]">
      <div className="bg-[#FAFBFD] px-6 py-3 text-sm font-semibold text-ink-primary">
        {label}
      </div>
      <div className="px-6 py-3 text-sm text-ink-secondary">{value}</div>
    </div>
  );
}

function NavRow({
  direction,
  post,
}: {
  direction: "prev" | "next";
  post: { id: string; title: string } | null;
}) {
  const Icon = direction === "prev" ? ChevronUp : ChevronDown;
  const label = direction === "prev" ? "이전글" : "다음글";
  const isLast = direction === "next";

  if (!post) {
    return (
      <div
        className={
          "grid grid-cols-[24px_72px_1fr] items-center gap-3 px-5 py-4 md:grid-cols-[24px_100px_1fr] " +
          (isLast ? "" : "border-b border-divider")
        }
      >
        <Icon className="h-4 w-4 text-ink-tertiary" />
        <span className="text-xs font-semibold text-ink-tertiary">{label}</span>
        <span className="text-sm text-ink-tertiary">{`${
          direction === "prev" ? "이전" : "다음"
        } 글이 없습니다.`}</span>
      </div>
    );
  }

  return (
    <Link
      href={`/notices/${post.id}`}
      className={
        "grid grid-cols-[24px_72px_1fr] items-center gap-3 px-5 py-4 transition-colors hover:bg-[#F5F8FF] md:grid-cols-[24px_100px_1fr] " +
        (isLast ? "" : "border-b border-divider")
      }
    >
      <Icon className="h-4 w-4 text-ink-tertiary" />
      <span className="text-xs font-semibold text-ink-secondary">{label}</span>
      <span className="truncate text-sm text-ink-primary">{post.title}</span>
    </Link>
  );
}

function NotFound() {
  return (
    <div className="rounded-lg border border-dashed border-divider bg-white px-6 py-16 text-center">
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
