"use client";

import { useLogin } from "./landing-shell";

export function Hero() {
  const login = useLogin();
  return (
    <section className="bg-gradient-to-b from-brand-50 to-white" id="about">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-3 text-sm font-semibold text-brand-500">
            아이의 성장을 함께하는
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            최고의 교육 파트너
            <br />
            레티튜초등학교
          </h1>
          <p className="mb-8 text-base leading-relaxed text-ink-secondary">
            개별 맞춤 교육으로 아이의 잠재력을 발견하고
            <br />
            미래를 준비하는 힘을 키워줍니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#programs"
              className="rounded-md bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
            >
              학원소개 보기
            </a>
            <button
              onClick={login.open}
              className="rounded-md border border-brand-500 bg-white px-6 py-3 text-sm font-semibold text-brand-500 hover:bg-brand-50"
            >
              상담문의
            </button>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <span className="h-1.5 w-6 rounded-full bg-brand-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand-100" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand-100" />
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100 via-[#D9E8FF] to-[#E8DCFA] shadow-elev3">
            <div className="flex h-full items-center justify-center text-[120px]">
              👧
            </div>
          </div>
          <div className="absolute -bottom-3 -right-3 rounded-2xl bg-white px-4 py-3 shadow-elev2">
            <div className="text-[11px] font-semibold text-ink-tertiary">현재 운영중</div>
            <div className="text-base font-bold text-brand-500">12개 프로그램</div>
          </div>
        </div>
      </div>
    </section>
  );
}
