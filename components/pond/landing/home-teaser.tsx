"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePosts } from "@/lib/posts-store";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
];

export function HomeTeaser() {
  const notices = usePosts("notice").slice(0, 4);
  const photos = usePosts("photo").slice(0, 4);

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Notices */}
        <div>
          <SectionHead title="공지사항" subtitle="학원의 최신 소식" href="/notices" />
          <ul className="overflow-hidden rounded-2xl border border-divider bg-white">
            {notices.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-ink-tertiary">
                등록된 공지가 없습니다.
              </li>
            )}
            {notices.map((n, i) => {
              const isPinned = n.pinned || n.tag === "필독";
              return (
                <li
                  key={n.id}
                  className={cn(i !== notices.length - 1 && "border-b border-divider")}
                >
                  <Link
                    href={`/notices/${n.id}`}
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted md:px-5"
                  >
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10.5px] font-semibold",
                        isPinned ? "bg-brand-50 text-brand-600" : "bg-muted text-ink-secondary"
                      )}
                    >
                      {n.tag || (isPinned ? "필독" : "안내")}
                    </span>
                    <span className="flex-1 truncate text-ink-primary">{n.title}</span>
                    <span className="hidden text-xs text-ink-tertiary md:inline">{n.date}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Gallery */}
        <div>
          <SectionHead title="갤러리" subtitle="최근 활동 사진" href="/gallery" />
          {photos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-divider bg-white py-12 text-center text-sm text-ink-tertiary">
              아직 등록된 사진이 없어요.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((p, i) => {
                const src = p.imageUrl || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                return (
                  <Link
                    key={p.id}
                    href={`/gallery/${p.id}`}
                    className="group relative block aspect-square overflow-hidden rounded-2xl shadow-elev1 transition-transform hover:-translate-y-0.5"
                  >
                    <img
                      src={src}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 text-white transition-transform group-hover:translate-y-0">
                      <div className="text-[11px] font-semibold leading-tight">{p.title}</div>
                      <div className="text-[10px] opacity-80">{p.date}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-2">
      <div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h3>
        <p className="mt-1 text-xs text-ink-secondary">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-[13px] font-semibold text-brand-500 hover:text-brand-600"
      >
        더보기
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
