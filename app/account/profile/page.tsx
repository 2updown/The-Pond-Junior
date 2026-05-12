"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Avatar } from "@/components/pond/avatar";
import { useToast } from "@/components/ui/toast";

export default function ProfileEditPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = React.useState("Letitu");

  return (
    <>
      <Topbar title="프로필 편집" variant="back" />
      <AppShell hideBottomNav>
        <div className="flex flex-col items-center gap-3 py-4">
          <Avatar initial="L" color="gradient" size="lg" className="!h-[72px] !w-[72px] !text-[24px]" />
          <button className="text-[13px] font-semibold text-brand-500">프로필 사진 변경</button>
        </div>

        <Field label="이름">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-md border border-divider bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        </Field>
        <Field label="이메일" helper="이메일은 변경할 수 없어요.">
          <input
            value="letitu.dev.kr@gmail.com"
            disabled
            className="h-12 w-full rounded-md border border-divider bg-muted px-4 text-sm text-ink-secondary"
          />
        </Field>
        <Field label="전화번호">
          <input
            placeholder="010-0000-0000"
            className="h-12 w-full rounded-md border border-divider bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        </Field>
        <Field label="소속">
          <input
            placeholder="학원 / 과외 / 기타"
            className="h-12 w-full rounded-md border border-divider bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        </Field>

        <button
          onClick={() => {
            toast({ message: "프로필이 저장되었습니다." });
            router.push("/account");
          }}
          className="mt-4 h-12 w-full rounded-md bg-brand-500 font-semibold text-white hover:bg-brand-600"
        >
          저장
        </button>
      </AppShell>
    </>
  );
}

function Field({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold">{label}</label>
      {children}
      {helper && <p className="mt-2 text-xs text-ink-secondary">{helper}</p>}
    </div>
  );
}
