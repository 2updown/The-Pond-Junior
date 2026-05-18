"use client";

import Link from "next/link";
import { LogoMark } from "./header";

const NAV_LINKS = [
  { href: "/about", label: "학원소개" },
  { href: "/programs", label: "프로그램" },
  { href: "/gallery", label: "갤러리" },
  { href: "/notices", label: "공지사항" },
  { href: "/location", label: "오시는 길" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-divider bg-[#FAFBFD]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1.4fr_2fr_1fr] md:py-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-[14px] font-bold tracking-tight">레티튜초등학교</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-secondary">
            아이의 성장을 함께하는
            <br />
            최고의 교육 파트너
          </p>
        </div>

        {/* Site nav — matches top GNB */}
        <nav>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            {NAV_LINKS.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="block text-[13px] font-bold text-ink-primary hover:text-brand-500"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <div className="mb-3 text-[13px] font-bold text-ink-primary">상담문의</div>
          <div className="text-base font-bold text-ink-primary">02-1234-5678</div>
          <a
            href="mailto:info@letitu.com"
            className="mt-1 block text-xs text-ink-secondary hover:text-brand-500"
          >
            info@letitu.com
          </a>
        </div>
      </div>

      <div className="border-t border-divider">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-4 text-[11px] text-ink-tertiary md:flex-row">
          <div>이용약관 · 개인정보처리방침 · 사업자등록번호: 123-45-67890</div>
          <div>© 2024 레티튜초등학교. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
