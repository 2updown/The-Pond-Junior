import { cn } from "@/lib/utils";

const NOTICES = [
  { tag: "공지", title: "2024년 여름방학 특강 안내", date: "2024.05.20" },
  { tag: "안내", title: "6월 영어 특별 프로그램 모집 안내", date: "2024.05.18" },
  { tag: "안내", title: "현충일 휴원 안내", date: "2024.05.15" },
  { tag: "안내", title: "5월 학부모 상담 주간 안내", date: "2024.05.10" },
  { tag: "안내", title: "시설 안전 점검 안내", date: "2024.05.08" },
];

export function NoticeBoard() {
  return (
    <section className="bg-[#FAFBFD] py-16 md:py-20" id="notices">
      <div className="mx-auto max-w-4xl px-5">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">공지사항</h2>
          <p className="mt-3 text-sm text-ink-secondary">
            학원의 최신 소식과 중요한 안내를 확인하세요.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-divider bg-white">
          {NOTICES.map((n, i) => (
            <a
              key={i}
              href="#"
              className={cn(
                "flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted",
                i !== NOTICES.length - 1 && "border-b border-divider"
              )}
            >
              <span
                className={cn(
                  "rounded-md px-2 py-1 text-[11px] font-semibold",
                  n.tag === "공지" ? "bg-brand-50 text-brand-600" : "bg-muted text-ink-secondary"
                )}
              >
                {n.tag}
              </span>
              <span className="flex-1 text-sm text-ink-primary">{n.title}</span>
              <span className="text-xs text-ink-tertiary">{n.date}</span>
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="rounded-md border border-divider bg-white px-6 py-3 text-sm font-semibold text-ink-primary hover:bg-muted">
            더보기
          </button>
        </div>
      </div>
    </section>
  );
}
