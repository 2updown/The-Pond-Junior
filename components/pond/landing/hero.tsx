"use client";

import Link from "next/link";
import { useContact } from "./landing-shell";

export function Hero() {
  const contact = useContact();
  return (
    <section className="relative w-full overflow-hidden" id="about">
      {/* Background image — full width */}
      <div className="absolute inset-0">
        <img
          src="/images/home-hero.jpg"
          alt="레티튜초등학교 메인 이미지"
          className="h-full w-full object-cover"
          loading="eager"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/10" />
      </div>

      {/* Foreground content */}
      <div className="relative mx-auto flex min-h-[480px] max-w-6xl flex-col justify-center px-5 py-20 text-white md:min-h-[600px] md:py-28">
        <p className="mb-3 text-sm font-semibold text-white/80 drop-shadow-sm">
          아이의 성장을 함께하는
        </p>
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight drop-shadow-md md:text-5xl lg:text-6xl">
          최고의 교육 파트너
          <br />
          레티튜초등학교
        </h1>
        <p className="mb-8 max-w-xl text-base leading-relaxed text-white/90 drop-shadow md:text-lg">
          개별 맞춤 교육으로 아이의 잠재력을 발견하고
          <br />
          미래를 준비하는 힘을 키워줍니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/about"
            className="rounded-md bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-elev2 transition-colors hover:bg-brand-600"
          >
            학원소개 보기
          </Link>
          <button
            onClick={contact.open}
            className="rounded-md border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            상담문의
          </button>
        </div>
        <div className="mt-10 flex items-center gap-2">
          <span className="h-1.5 w-6 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </div>
      </div>
    </section>
  );
}
