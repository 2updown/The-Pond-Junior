"use client";

import { useLogin } from "./landing-shell";

export function CtaBanner() {
  const login = useLogin();
  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-500 to-[#5BA0FF] px-6 py-8 md:px-12 md:py-12">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div className="text-white">
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
          <div className="hidden text-[120px] md:block">👧</div>
        </div>
        <span className="absolute -left-6 -top-6 text-[80px] opacity-15">🍃</span>
        <span className="absolute -right-6 -bottom-6 text-[80px] opacity-15">🌿</span>
      </div>
    </section>
  );
}
