"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { usePosts } from "@/lib/posts-store";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80",
];

export function HomeTeaser() {
  const notices = usePosts("notice").slice(0, 4);
  const photos = usePosts("photo").slice(0, 2);

  return (
    <section className="mx-auto max-w-6xl px-5 py-7 md:py-10">
      <div className="grid items-stretch gap-10 md:grid-cols-2">
        {/* Notices — tab widget style */}
        <div className="overflow-hidden rounded-2xl border-2 border-[#3B5072] bg-white">
          {/* Tab header */}
          <div className="flex items-center justify-between bg-[#3B5072] px-4 py-3">
            <span className="text-xl font-bold tracking-tight text-white md:text-2xl">
              공지사항
            </span>
            <Link
              href="/notices"
              aria-label="공지사항 더보기"
              className="flex h-9 w-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/20"
            >
              <Plus className="h-5 w-5" />
            </Link>
          </div>
          {/* List */}
          <ul>
            {notices.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-ink-tertiary">
                등록된 공지가 없습니다.
              </li>
            )}
            {notices.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/notices/${n.id}`}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[#F5F8FF]"
                >
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-ink-tertiary" />
                  <span className="flex-1 truncate text-ink-primary">{n.title}</span>
                  <span className="hidden text-xs text-ink-tertiary md:inline">{n.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Gallery — same tab widget style, 2 photos */}
        <div className="overflow-hidden rounded-2xl border-2 border-[#3B5072] bg-white">
          {/* Tab header */}
          <div className="flex items-center justify-between bg-[#3B5072] px-4 py-3">
            <span className="text-xl font-bold tracking-tight text-white md:text-2xl">
              갤러리
            </span>
            <Link
              href="/gallery"
              aria-label="갤러리 더보기"
              className="flex h-9 w-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/20"
            >
              <Plus className="h-5 w-5" />
            </Link>
          </div>
          {/* Photos — 2 in a row */}
          {photos.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-ink-tertiary">
              아직 등록된 사진이 없어요.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-2">
              {photos.map((p, i) => {
                const src = p.imageUrl || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                return (
                  <Link
                    key={p.id}
                    href={`/gallery/${p.id}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-lg shadow-elev1"
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
