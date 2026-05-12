import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Location() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20" id="location">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">오시는 길</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Map placeholder */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E8EFF6] md:aspect-auto">
          {/* fake grid + pin */}
          <svg className="absolute inset-0 h-full w-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C7D3E0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* road lines */}
            <line x1="0" y1="60%" x2="100%" y2="55%" stroke="#fff" strokeWidth="14" />
            <line x1="0" y1="60%" x2="100%" y2="55%" stroke="#D5DDE6" strokeWidth="12" />
            <line x1="35%" y1="0" x2="40%" y2="100%" stroke="#fff" strokeWidth="14" />
            <line x1="35%" y1="0" x2="40%" y2="100%" stroke="#D5DDE6" strokeWidth="12" />
          </svg>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white shadow-elev2">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Info */}
        <ul className="flex flex-col gap-5">
          <InfoRow icon={<MapPin className="h-5 w-5" />} label="주소">
            서울특별시 강남구 테헤란로 123, 4층
          </InfoRow>
          <InfoRow icon={<Phone className="h-5 w-5" />} label="전화">
            02-1234-5678
          </InfoRow>
          <InfoRow icon={<Mail className="h-5 w-5" />} label="이메일">
            info@letitu.com
          </InfoRow>
          <InfoRow icon={<Clock className="h-5 w-5" />} label="운영시간">
            평·금 10:00 - 20:00 | 토 10:00 - 16:00
            <br />
            <span className="text-xs text-ink-tertiary">(일요일, 공휴일 휴원)</span>
          </InfoRow>
        </ul>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-500">
        {icon}
      </span>
      <div>
        <div className="text-[12px] font-semibold text-ink-tertiary">{label}</div>
        <div className="text-sm text-ink-primary">{children}</div>
      </div>
    </li>
  );
}
