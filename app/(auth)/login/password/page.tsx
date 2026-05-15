"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [maskedEmail, setMaskedEmail] = React.useState("이메일");

  React.useEffect(() => {
    const email = sessionStorage.getItem("pond_email") || "example@email.com";
    const [local, domain] = email.split("@");
    const masked =
      local.length <= 2 ? local[0] + "***" : local.slice(0, 2) + "***";
    setMaskedEmail(`${masked}@${domain || ""}`);
  }, []);

  const valid = password.length > 0;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);

    // Demo-only — any non-empty password is accepted for now.
    // Replace with real auth call when backend is wired up.
    window.setTimeout(() => {
      localStorage.setItem("pond_logged_in", "true");
      router.replace("/consultations");
    }, 200);
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
        <span className="text-[17px] font-semibold">비밀번호 입력</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col gap-3.5 px-6 pt-2 pb-8"
      >
        <h1 className="px-1 text-[26px] font-bold leading-snug tracking-tight">
          비밀번호를 입력해주세요
        </h1>
        <p className="-mt-3 text-xs text-ink-secondary">
          <span className="font-medium">{maskedEmail}</span> 계정으로 로그인합니다.
        </p>

        <div className="mt-3">
          <label
            htmlFor="password"
            className="mb-2 block text-[13px] font-semibold"
          >
            비밀번호
          </label>
          <div className="relative">
            <input
              id="password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              autoFocus
              className={cn(
                "h-12 w-full rounded-md border bg-white pl-4 pr-12 text-sm text-ink-primary outline-none transition",
                "focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15",
                error ? "border-danger" : "border-divider"
              )}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-tertiary hover:bg-muted"
              aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {error && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-danger">
              <AlertCircle className="mt-0.5 h-3 w-3 flex-none" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!valid || submitting}
          className={cn(
            "mt-2 h-12 w-full rounded-md font-semibold transition-colors",
            valid && !submitting
              ? "bg-brand-500 text-white hover:bg-brand-600"
              : "cursor-not-allowed bg-muted text-ink-tertiary"
          )}
        >
          {submitting ? "확인 중..." : "로그인"}
        </button>

        <div className="mt-1 flex items-center justify-between text-[12.5px]">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-ink-secondary hover:text-ink-primary"
          >
            다른 이메일로 로그인
          </button>
          <button
            type="button"
            className="font-semibold text-brand-500 hover:text-brand-600"
            onClick={() =>
              alert(
                "비밀번호 재설정 안내 메일을 발송했습니다. (데모용 — 실제로는 발송되지 않습니다.)"
              )
            }
          >
            비밀번호 찾기
          </button>
        </div>

        <div className="mt-4 rounded-md bg-muted px-5 py-4 text-[12.5px] leading-[1.65] text-ink-secondary">
          <p className="mb-1 text-[13px] font-semibold text-ink-primary">
            데모 안내
          </p>
          <p>
            현재는 데모용으로 어떤 비밀번호든 입력하면 로그인됩니다. OTP / 2단계 인증은 추후 정식 도입 예정입니다.
          </p>
        </div>
      </form>
    </div>
  );
}
