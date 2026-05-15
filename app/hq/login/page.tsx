"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Demo-only credential. In production this should hit a real auth endpoint.
const DEMO_HQ_EMAIL = "hq@thepond.kr";
const DEMO_HQ_PASSWORD = "hq1234";

export default function HqLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const valid = email.trim().length > 0 && password.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);

    // Simulated auth — replace with real API call later.
    window.setTimeout(() => {
      if (
        email.trim().toLowerCase() === DEMO_HQ_EMAIL &&
        password === DEMO_HQ_PASSWORD
      ) {
        localStorage.setItem("pond_hq_logged_in", "1");
        localStorage.setItem("pond_hq_email", email.trim());
        router.replace("/hq");
      } else {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        setSubmitting(false);
      }
    }, 250);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-10">
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src="/images/Pond-logo.png"
            alt="The Pond"
            className="h-28 w-auto object-contain"
          />
          <h1 className="text-[24px] font-bold text-ink-primary">
            본사 운영자 로그인
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-divider bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
        >
          <div className="flex flex-col gap-4">
            <Field
              icon={Mail}
              label="이메일"
              type="email"
              placeholder={DEMO_HQ_EMAIL}
              value={email}
              onChange={setEmail}
              autoComplete="email"
              autoFocus
            />
            <Field
              icon={Lock}
              label="비밀번호"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-[#F5C6C6] bg-[#FDECEC] px-3 py-2 text-[12px] text-[#C13B3B]">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-none" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!valid || submitting}
              className={cn(
                "mt-2 h-11 w-full rounded-md text-[13.5px] font-semibold transition-colors",
                valid && !submitting
                  ? "bg-brand-500 text-white hover:bg-brand-600"
                  : "cursor-not-allowed bg-muted text-ink-tertiary"
              )}
            >
              {submitting ? "확인 중..." : "본사 콘솔 로그인"}
            </button>
          </div>

          {/* Demo hint */}
          <div className="mt-5 rounded-md bg-muted px-3 py-3 text-[11.5px] leading-relaxed text-ink-secondary">
            <p className="font-semibold text-ink-primary">데모 계정</p>
            <p className="mt-0.5">
              이메일{" "}
              <span className="font-mono text-ink-primary">{DEMO_HQ_EMAIL}</span>{" "}
              · 비밀번호{" "}
              <span className="font-mono text-ink-primary">{DEMO_HQ_PASSWORD}</span>
            </p>
          </div>
        </form>

        <p className="mt-5 text-center text-[11.5px] text-ink-tertiary">
          본사 콘솔 접근 권한은 운영팀이 별도로 발급합니다.
        </p>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  autoFocus,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-semibold text-ink-secondary">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-tertiary" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className="h-11 w-full rounded-md border border-divider bg-white pl-9 pr-3 text-[13px] text-ink-primary placeholder:text-ink-tertiary focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
        />
      </div>
    </label>
  );
}
