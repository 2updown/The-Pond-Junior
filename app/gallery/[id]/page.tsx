"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Calendar, User as UserIcon } from "lucide-react";
import { LandingShell } from "@/components/pond/landing/landing-shell";
import { usePosts, removePost } from "@/lib/posts-store";
import { useLoginState } from "@/lib/use-login-state";
import { useToast } from "@/components/ui/toast";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80";

export default function GalleryDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const { toast } = useToast();
  const loggedIn = useLoginState();
  const all = usePosts("photo");
  const post = all.find((p) => p.id === params.id);

  const handleDelete = () => {
    if (!post) return;
    if (confirm(`"${post.title}" 게시글을 삭제할까요?`)) {
      removePost(post.id);
      toast({ message: "게시글이 삭제되었습니다." });
      router.push("/gallery");
    }
  };

  return (
    <LandingShell>
      <section className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <button
          onClick={() => router.push("/gallery")}
          className="mb-5 inline-flex items-center gap-1 text-[13px] font-semibold text-ink-secondary hover:text-brand-500"
        >
          <ChevronLeft className="h-4 w-4" />
          갤러리 목록
        </button>

        {!post ? (
          <div className="rounded-2xl border border-dashed border-divider bg-white px-6 py-16 text-center">
            <p className="text-sm text-ink-secondary">
              존재하지 않거나 삭제된 사진입니다.
            </p>
            <Link
              href="/gallery"
              className="mt-4 inline-block rounded-md border border-divider bg-white px-4 py-2 text-sm font-semibold text-ink-primary hover:bg-muted"
            >
              갤러리 목록으로
            </Link>
          </div>
        ) : (
          <article className="overflow-hidden rounded-2xl border border-divider bg-white">
            {/* Big photo */}
            <div className="bg-[#FAFBFD]">
              <img
                src={post.imageUrl || FALLBACK_IMAGE}
                alt={post.title}
                className="mx-auto max-h-[640px] w-full object-contain"
                loading="eager"
              />
            </div>

            {/* Caption */}
            <div className="p-6 md:p-8">
              <h1 className="text-xl font-bold tracking-tight md:text-2xl">{post.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-tertiary">
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
              </div>
              {post.content && (
                <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-ink-secondary">
                  {post.content}
                </p>
              )}
            </div>
          </article>
        )}

        {/* Edit / Delete buttons (logged in only) */}
        {post && loggedIn && (
          <div className="mt-4 flex justify-end gap-2">
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
          </div>
        )}

        {/* Other photos */}
        {post && all.length > 1 && (
          <div className="mt-10">
            <h3 className="mb-3 text-sm font-bold text-ink-secondary">다른 사진</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {all
                .filter((p) => p.id !== post.id)
                .slice(0, 8)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/gallery/${p.id}`}
                    className="group relative block aspect-square overflow-hidden rounded-2xl shadow-elev1 transition-transform hover:-translate-y-0.5"
                  >
                    <img
                      src={p.imageUrl || FALLBACK_IMAGE}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 text-white transition-transform group-hover:translate-y-0">
                      <div className="text-[11px] font-semibold leading-tight">{p.title}</div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </section>
    </LandingShell>
  );
}
