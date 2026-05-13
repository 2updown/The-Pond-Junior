"use client";

import Link from "next/link";
import { usePosts } from "@/lib/posts-store";
import { useLoginState } from "@/lib/use-login-state";
import { WriteButton } from "@/components/pond/write-button";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=800&q=80",
];

export function Gallery() {
  const photos = usePosts("photo").slice(0, 20);
  const loggedIn = useLoginState();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20" id="gallery">
      <div className="mb-10 flex flex-col items-center text-center md:mb-12">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">레티튜 갤러리</h2>
        <p className="mt-3 text-sm text-ink-secondary">
          아이들의 즐거운 수업 모습과 다양한 활동을 확인해보세요.
        </p>
        {loggedIn && (
          <div className="mt-5">
            <WriteButton defaultKind="photo" />
          </div>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-divider bg-white py-16 text-center text-sm text-ink-tertiary">
          아직 등록된 사진이 없어요. 로그인 후 글쓰기로 사진을 올리면 여기에 표시됩니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {photos.map((p, i) => {
            const src = p.imageUrl || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
            return (
              <Link
                key={p.id}
                href={`/gallery/${p.id}`}
                className="group relative block aspect-square overflow-hidden rounded-2xl shadow-elev1 transition-transform hover:-translate-y-1"
              >
                <img
                  src={src}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white transition-transform group-hover:translate-y-0">
                  <div className="text-[11px] font-semibold leading-tight">{p.title}</div>
                  <div className="text-[10px] opacity-80">{p.date}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
