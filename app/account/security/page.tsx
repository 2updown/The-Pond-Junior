"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { cn } from "@/lib/utils";

export default function SecurityPage() {
  const router = useRouter();
  const [pwOld, setPwOld] = React.useState("");
  const [pw1, setPw1] = React.useState("");
  const [pw2, setPw2] = React.useState("");

  const okLen = pw1.length >= 8;
  const okMix = /[a-zA-Z]/.test(pw1) && /\d/.test(pw1);
  const okSpace = pw1.length > 0 && !/\s/.test(pw1);
  const allOk = okLen && okMix && okSpace;
  const match = pw1.length > 0 && pw1 === pw2;
  const mismatch = pw2.length > 0 && pw1 !== pw2;
  const canSubmit = pwOld.length > 0 && allOk && match;

  return (
    <>
      <Topbar title="비밀번호 변경" variant="back" />
      <AppShell hideBottomNav>
        <Field label="현재 비밀번호">
          <input
            type="password"
            value={pwOld}
            onChange={(e) => setPwOld(e.target.value)}
            placeholder="현재 비밀번호"
            className="h-12 w-full rounded-md border border-divider bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        </Field>

        <Field label="새 비밀번호">
          <input
            type="password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            placeholder="8자 이상, 영문·숫자 포함"
            className="h-12 w-full rounded-md border border-divider bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
          <ul className="mt-3 flex flex-col gap-1.5">
            <Rule ok={okLen}>8자 이상</Rule>
            <Rule ok={okMix}>영문과 숫자 포함</Rule>
            <Rule ok={okSpace}>공백 없음</Rule>
          </ul>
        </Field>

        <Field label="새 비밀번호 확인">
          <input
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
            className={cn(
              "h-12 w-full rounded-md border bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15",
              mismatch ? "border-danger" : "border-divider"
            )}
          />
          {mismatch && <p className="mt-2 text-xs text-danger">비밀번호가 일치하지 않습니다.</p>}
        </Field>

        <button
          onClick={() => {
            if (!canSubmit) return;
            router.push("/consultations?toast=password-changed");
          }}
          disabled={!canSubmit}
          className={cn(
            "mt-2 h-12 w-full rounded-md font-semibold transition-colors",
            canSubmit ? "bg-brand-500 text-white hover:bg-brand-600" : "cursor-not-allowed bg-muted text-ink-tertiary"
          )}
        >
          변경하기
        </button>
      </AppShell>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold">{label}</label>
      {children}
    </div>
  );
}

function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={cn("flex items-center gap-2 text-xs", ok ? "text-success" : "text-ink-tertiary")}>
      <span className={cn("flex h-3.5 w-3.5 items-center justify-center rounded-full", ok ? "bg-success" : "bg-muted")}>
        {ok && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
      </span>
      {children}
    </li>
  );
}
