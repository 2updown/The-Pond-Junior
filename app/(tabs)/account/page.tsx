"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Avatar } from "@/components/pond/avatar";
import { Chip } from "@/components/pond/chip";

export default function AccountPage() {
  const router = useRouter();
  return (
    <>
      <Topbar title="계정" />
      <AppShell>
        {/* Profile card */}
        <div className="pond-card flex items-center gap-3.5">
          <Avatar initial="L" color="gradient" size="lg" />
          <div className="flex-1">
            <div className="text-[15px] font-bold">Letitu 선생님</div>
            <div className="text-xs text-ink-secondary">letitu.dev.kr@gmail.com</div>
          </div>
          <Chip variant="role">선생님</Chip>
        </div>

        {/* Menu group 1 */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
          <MenuRow href="/account/profile" label="프로필 편집" />
          <MenuRow href="/account/security" label="비밀번호 변경" />
          <MenuRow href="/account/notifications" label="알림 설정" />
        </div>

        {/* Menu group 2 */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
          <MenuRow href="/board" label="공지사항" />
          <MenuRow href="/support" label="도움말" />
          <MenuRow href="mailto:customerservice@letitu.io" label="문의하기" trailing="customerservice@letitu.io" />
        </div>

        {/* Logout */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
          <button
            onClick={() => {
              if (confirm("로그아웃 하시겠어요?")) {
                localStorage.removeItem("pond_logged_in");
                router.push("/");
              }
            }}
            className="flex w-full items-center justify-between border-b-0 px-4 py-3.5 text-left text-sm font-semibold text-danger"
          >
            <span>로그아웃</span>
            <span className="text-lg text-ink-tertiary">›</span>
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-ink-tertiary">v1.0.0 · © Letitu</p>
      </AppShell>
    </>
  );
}

function MenuRow({
  href,
  label,
  trailing,
}: {
  href: string;
  label: string;
  trailing?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between border-b border-divider px-4 py-3.5 text-sm last:border-b-0"
    >
      <span>{label}</span>
      {trailing ? (
        <span className="text-xs text-ink-tertiary">{trailing}</span>
      ) : (
        <span className="text-lg text-ink-tertiary">›</span>
      )}
    </Link>
  );
}
