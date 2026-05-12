import { GraduationCap, Users, BookOpen, MessageSquare } from "lucide-react";

const FEATURES = [
  {
    Icon: GraduationCap,
    title: "개별 맞춤 교육",
    description: "아이의 수준과 성향에 맞춘 1:1 맞춤 학습",
  },
  {
    Icon: Users,
    title: "전문 강사진",
    description: "풍부한 경험과 열정을 갖춘 최고의 선생님",
  },
  {
    Icon: BookOpen,
    title: "체계적인 커리큘럼",
    description: "검증된 교육 프로그램으로 효과적인 학습",
  },
  {
    Icon: MessageSquare,
    title: "학부모 소통",
    description: "정기적인 피드백과 투명한 학습 관리",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          레티튜초등학교만의 특별함
        </h2>
        <p className="mt-3 text-sm text-ink-secondary">
          아이 중심 교육 철학으로 꼭 필요한 가치를 키워갑니다.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {FEATURES.map(({ Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-divider bg-white p-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-base font-bold">{title}</h3>
            <p className="text-xs leading-relaxed text-ink-secondary">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
