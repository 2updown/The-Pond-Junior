"use client";

import { Sparkles } from "lucide-react";
import { useLogin } from "./landing-shell";

export function CtaBanner() {
  const login = useLogin();
  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <div className="relative grid items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-500 to-[#5BA0FF] px-6 py-10 md:grid-cols-[1fr_auto] md:px-12 md:py-12">
        <div className="text-white">
          <Sparkles className="mb-3 h-8 w-8 opacity-90" />
          <h2 className="mb-2 text-xl font-bold leading-snug md:text-2xl">
            우리 아이의 밝은 미래를 시작하세요
          </h2>
          <p className="text-sm leading-relaxed opacity-90">
            상담을 통해 아이에게 맞는 최적의 교육을 제안해드립니다.
          </p>
          <button
            onClick={login.open}
            className="mt-6 inline-block rounded-md bg-white px-5 py-3 text-sm font-bold text-brand-500 hover:bg-brand-50"
          >
            상담문의 하기
          </button>
        </div>
        <div className="hidden md:block">
          <div className="relative h-44 w-44 overflow-hidden rounded-2xl shadow-elev2">
            <img
              src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=600&q=80"
              alt="아이의 미소"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        {/* Subtle decorative shapes (no emoji) */}
        <span className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
        <span className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/10" />
      </div>
    </section>
  );
}
