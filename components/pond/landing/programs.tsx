import Link from "next/link";

const PROGRAMS = [
  {
    name: "유아 프로그램",
    description: "놀이와 체험을 통한 창의성 발달 (3세 - 7세)",
    emoji: "🧒",
    gradient: "from-[#FFE9CC] to-[#FFD4A0]",
  },
  {
    name: "초등 프로그램",
    description: "기초부터 심화까지 탄탄한 학습 (초등 1학년 - 6학년)",
    emoji: "📚",
    gradient: "from-[#D6E5FF] to-[#A6C8FF]",
  },
  {
    name: "특별 프로그램",
    description: "영어·코딩·독서논술 등 다양한 특별 활동",
    emoji: "🎨",
    gradient: "from-[#E8DCFA] to-[#C7B0F0]",
  },
];

export function Programs() {
  return (
    <section className="bg-[#FAFBFD] py-16 md:py-20" id="programs">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">프로그램 안내</h2>
          <p className="mt-3 text-sm text-ink-secondary">
            아이의 성장 단계에 맞춘 다양한 프로그램을 제공합니다.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PROGRAMS.map((p) => (
            <div
              key={p.name}
              className="overflow-hidden rounded-2xl border border-divider bg-white"
            >
              <div className={`aspect-[4/3] bg-gradient-to-br ${p.gradient} flex items-center justify-center text-7xl`}>
                {p.emoji}
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-base font-bold">{p.name}</h3>
                <p className="mb-4 text-xs leading-relaxed text-ink-secondary">
                  {p.description}
                </p>
                <button className="text-[13px] font-semibold text-brand-500 hover:text-brand-600">
                  자세히 보기 →
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button className="rounded-md border border-divider bg-white px-6 py-3 text-sm font-semibold text-ink-primary hover:bg-muted">
            전체 프로그램 보기
          </button>
        </div>
      </div>
    </section>
  );
}
