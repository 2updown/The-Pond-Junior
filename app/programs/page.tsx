import { LandingShell } from "@/components/pond/landing/landing-shell";
import { PageHero } from "@/components/pond/landing/page-hero";
import { Programs } from "@/components/pond/landing/programs";

export default function ProgramsPage() {
  return (
    <LandingShell>
      <PageHero
        eyebrow="Programs"
        title="프로그램 안내"
        description="아이의 성장 단계에 맞춘 다양한 프로그램을 제공합니다."
      />
      <Programs />

      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="rounded-3xl bg-[#FAFBFD] p-8 md:p-12">
          <h3 className="text-xl font-bold tracking-tight md:text-2xl">수업 진행 방식</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary md:text-base">
            모든 프로그램은 진단 평가 → 맞춤 커리큘럼 설계 → 1:1 학습 진행 → 매주 리포트
            발송의 순서로 운영됩니다.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { step: "01", title: "진단", desc: "현 수준 평가" },
              { step: "02", title: "설계", desc: "커리큘럼 맞춤" },
              { step: "03", title: "수업", desc: "1:1 학습 진행" },
              { step: "04", title: "리포트", desc: "주간 발송" },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl bg-white p-5 shadow-elev1">
                <div className="text-xs font-bold text-brand-500">{s.step}</div>
                <div className="mt-1 text-base font-bold">{s.title}</div>
                <div className="mt-1 text-xs text-ink-secondary">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </LandingShell>
  );
}
