const GALLERY = [
  { emoji: "📖", gradient: "from-[#FFE0B5] to-[#FFC279]" },
  { emoji: "🎨", gradient: "from-[#D6E5FF] to-[#9CC0FF]" },
  { emoji: "🧩", gradient: "from-[#E8DCFA] to-[#BCA3E8]" },
  { emoji: "🎵", gradient: "from-[#D5F0E0] to-[#A0DDB5]" },
  { emoji: "🔬", gradient: "from-[#FFD9D9] to-[#FFAFAF]" },
];

export function Gallery() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20" id="gallery">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">레티튜 갤러리</h2>
        <p className="mt-3 text-sm text-ink-secondary">
          아이들의 즐거운 수업 모습과 다양한 활동을 확인해보세요.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {GALLERY.map((g, i) => (
          <div
            key={i}
            className={`aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${g.gradient} flex items-center justify-center text-5xl shadow-elev1 transition-transform hover:-translate-y-1`}
          >
            {g.emoji}
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <button className="rounded-md border border-divider bg-white px-6 py-3 text-sm font-semibold text-ink-primary hover:bg-muted">
          갤러리 더보기
        </button>
      </div>
    </section>
  );
}
