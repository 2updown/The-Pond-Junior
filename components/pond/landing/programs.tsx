const PROGRAMS = [
  {
    name: "유아 프로그램",
    description: "놀이와 체험을 통한 창의성 발달 (3세 – 7세)",
    image:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
    alt: "유아들이 함께 놀이하는 모습",
  },
  {
    name: "초등 프로그램",
    description: "기초부터 심화까지 탄탄한 학습 (초등 1학년 – 6학년)",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    alt: "학생이 책상에서 공부하는 모습",
  },
  {
    name: "특별 프로그램",
    description: "영어·코딩·독서논술 등 다양한 특별 활동",
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80",
    alt: "다양한 색의 미술 도구",
  },
];

export function Programs() {
  return (
    <section className="py-10 md:py-12" id="programs">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-6 md:grid-cols-3">
          {PROGRAMS.map((p) => (
            <div
              key={p.name}
              className="overflow-hidden rounded-2xl border border-divider bg-white"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.alt}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-base font-bold">{p.name}</h3>
                <p className="text-xs leading-relaxed text-ink-secondary">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
