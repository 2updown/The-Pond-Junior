import { LandingShell } from "@/components/pond/landing/landing-shell";
import { PageHero } from "@/components/pond/landing/page-hero";
import { Features } from "@/components/pond/landing/features";

export default function AboutPage() {
  return (
    <LandingShell>
      <PageHero
        eyebrow="About"
        title="학원소개"
        description="아이의 성장을 함께하는 최고의 교육 파트너. 개별 맞춤 교육으로 잠재력을 발견합니다."
      />

      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-elev3">
            <img
              src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1000&q=80"
              alt="학원 책장에 놓인 책들"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              교육 철학
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-secondary">
              레티튜초등학교는 <b className="text-ink-primary">"한 명의 아이도 놓치지 않는 교육"</b>을 모토로,
              개별 학습 수준과 성향을 고려한 1:1 맞춤 학습을 제공합니다. 단순히 점수를
              올리는 것을 넘어, 평생 학습할 수 있는 힘과 자신감을 키워줍니다.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5 text-[14px] text-ink-primary">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
                개별 수준 진단 후 맞춤 커리큘럼 설계
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
                매주 진행되는 학부모 리포트 발송
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
                전 강사진 학원/공교육 경력 10년 이상
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Features />
    </LandingShell>
  );
}
