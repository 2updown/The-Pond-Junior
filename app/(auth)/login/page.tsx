"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const valid = email.trim().length > 0;
  const showError = false;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!valid) return;
    sessionStorage.setItem("pond_email", email.trim());
    router.push("/login/code");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-page">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 pb-4 pt-8 text-lg font-bold">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <path
            d="M2 14c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
            stroke="#3E8BFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
            stroke="#9CC2FF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>The Pond</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3.5 px-6 pt-2 pb-8">
        <h1 className="px-1 text-[26px] font-bold tracking-tight">로그인</h1>

        <div>
          <label htmlFor="email" className="mb-2 block text-[13px] font-semibold">
            아이디(이메일)
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            autoComplete="email"
            className={cn(
              "h-12 w-full rounded-md border bg-white px-4 text-sm text-ink-primary outline-none transition",
              "focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15",
              showError ? "border-danger" : "border-divider"
            )}
          />
        </div>

        <button
          type="submit"
          disabled={!valid}
          className={cn(
            "h-12 w-full rounded-md font-semibold transition-colors",
            valid
              ? "bg-brand-500 text-white hover:bg-brand-600"
              : "cursor-not-allowed bg-muted text-ink-tertiary"
          )}
        >
          다음
        </button>

        <div className="mt-4 rounded-md bg-muted px-5 py-4 text-[12.5px] leading-[1.65] text-ink-secondary">
          <p className="mb-2 text-[13px] font-semibold">로그인에 문제가 있으신가요?</p>
          <ul className="space-y-1 pl-4">
            <li className="list-disc">첫 로그인 시, 비밀번호를 설정하기 위한 활성화코드를 메일로 전송해드립니다.</li>
            <li className="list-disc">학생계정은 선생님이 등록 후 로그인이 가능합니다.</li>
            <li className="list-disc">
              문의사항:{" "}
              <a href="mailto:customerservice@letitu.io" className="text-brand-500 underline">
                customerservice@letitu.io
              </a>
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
}
