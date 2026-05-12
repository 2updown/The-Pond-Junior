"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function strengthScore(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[a-zA-Z]/.test(p) && /\d/.test(p)) s++;
  if (p.length >= 12) s++;
  if (/[^a-zA-Z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}

const STRENGTH_BAR_COLORS = ["bg-muted", "bg-danger", "bg-warning", "bg-yellow-400", "bg-success"];

export default function SetPasswordPage() {
  const router = useRouter();
  const [pw1, setPw1] = React.useState("");
  const [pw2, setPw2] = React.useState("");

  const okLen = pw1.length >= 8;
  const okMix = /[a-zA-Z]/.test(pw1) && /\d/.test(pw1);
  const okSpace = pw1.length > 0 && !/\s/.test(pw1);
  const match = pw1.length > 0 && pw1 === pw2;
  const mismatch = pw2.length > 0 && pw1 !== pw2;
  // 테스트 편의 — 두 칸이 비어있지 않으면 진행 가능 (규칙은 시각적 피드백만)
  const canSubmit = pw1.length > 0 && pw2.length > 0 && pw1 === pw2;
  const score = strengthScore(pw1);

  const handleSubmit = () => {
    if (!canSubmit) return;
    localStorage.setItem("pond_logged_in", "true");
    router.push("/consultations?toast=password-changed");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-page">
      <div className="relative flex items-center justify-center px-5 py-4 pt-6">
        <button
          onClick={() => router.back()}
          aria-label="뒤로"
          className="absolute left-3 flex h-10 w-10 items-center justify-center text-ink-primary"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="text-[17px] font-semibold">비밀번호 설정</span>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 pt-2 pb-8">
        <h1 className="px-1 text-[26px] font-bold leading-snug tracking-tight">
          새 비밀번호를
          <br />
          입력해주세요
        </h1>

        <div>
          <label className="mb-2 block text-[13px] font-semibold">새 비밀번호</label>
          <input
            type="password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            placeholder="8자 이상, 영문·숫자 포함"
            className="h-12 w-full rounded-md border border-divider bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn("h-1 rounded-full", pw1 && i <= score ? STRENGTH_BAR_COLORS[score] : "bg-muted")}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-col gap-1.5">
            <Rule ok={okLen}>8자 이상</Rule>
            <Rule ok={okMix}>영문과 숫자 포함</Rule>
            <Rule ok={okSpace}>공백 없음</Rule>
          </ul>
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-semibold">비밀번호 확인</label>
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
          {mismatch && (
            <p className="mt-2 text-xs text-danger">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={cn(
            "mt-2 h-12 w-full rounded-md font-semibold transition-colors",
            canSubmit
              ? "bg-brand-500 text-white hover:bg-brand-600"
              : "cursor-not-allowed bg-muted text-ink-tertiary"
          )}
        >
          완료
        </button>
      </div>
    </div>
  );
}

function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={cn("flex items-center gap-2 text-xs", ok ? "text-success" : "text-ink-tertiary")}>
      <span
        className={cn(
          "flex h-3.5 w-3.5 items-center justify-center rounded-full",
          ok ? "bg-success" : "bg-muted"
        )}
      >
        {ok && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
      </span>
      {children}
    </li>
  );
}
