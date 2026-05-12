"use client";

import { LogoMark } from "./header";
import { useLogin } from "./landing-shell";

export function LandingFooter() {
  const login = useLogin();
  return (
    <footer className="border-t border-divider bg-[#FAFBFD]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-4 md:py-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <div className="leading-tight">
              <div className="text-[14px] font-bold tracking-tight">레티튜초등학교</div>
              <div className="text-[10px] text-ink-tertiary">프리미엄 교육 파트너</div>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-secondary">
            아이의 성장을 함께하는
            <br />
            최고의 교육 파트너
          </p>
        </div>

        <FooterColumn title="학원소개">
          <FooterLink href="#about">학원소개</FooterLink>
          <FooterLink href="#about">교육철학</FooterLink>
          <FooterLink href="#about">강사진 소개</FooterLink>
        </FooterColumn>

        <FooterColumn title="프로그램">
          <FooterLink href="#programs">유아 프로그램</FooterLink>
          <FooterLink href="#programs">초등 프로그램</FooterLink>
          <FooterLink href="#programs">특별 프로그램</FooterLink>
        </FooterColumn>

        <FooterColumn title="상담문의">
          <div className="text-base font-bold text-ink-primary">02-1234-5678</div>
          <button
            onClick={login.open}
            className="mt-2 inline-block self-start rounded-md border border-brand-500 px-4 py-2 text-xs font-semibold text-brand-500 hover:bg-brand-50"
          >
            상담문의 하기
          </button>
          <FooterLink href="#location">고객센터</FooterLink>
        </FooterColumn>
      </div>

      <div className="border-t border-divider">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-4 text-[11px] text-ink-tertiary md:flex-row">
          <div>
            이용약관 · 개인정보처리방침 · 사업자등록번호: 123-45-67890
          </div>
          <div>© 2024 레티튜초등학교. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="mb-3 text-[13px] font-bold text-ink-primary">{title}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="block text-xs text-ink-secondary hover:text-brand-500">
      {children}
    </a>
  );
}
