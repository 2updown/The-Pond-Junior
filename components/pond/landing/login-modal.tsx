"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// "code" (OTP) step is intentionally removed — see CodeStep below for the
// previous implementation, kept for reference when OTP is re-introduced.
type Step = "email" | "password";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("email");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setStep("email");
      setEmail("");
      setPassword("");
    }
  }, [open]);

  // Body lock + esc handler
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handlePasswordSubmit = () => {
    if (!password.trim()) return;
    // Demo-only — any non-empty password is accepted. Replace with real auth.
    localStorage.setItem("pond_logged_in", "true");
    onClose();
    router.push("/consultations");
  };

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 px-5 py-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="로그인"
        className="relative w-full max-w-[380px] rounded-3xl bg-white p-7 pt-9 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Back button (only on password step now that OTP is removed) */}
        {step !== "email" && (
          <button
            onClick={() => setStep("email")}
            aria-label="이전"
            className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Logo header */}
        <div className="mb-6 flex justify-center pt-1">
          <img
            src="/images/Pond-logo.png"
            alt="The Pond"
            className="h-24 w-auto object-contain"
          />
        </div>

        {step === "email" && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            onNext={() => email.trim() && setStep("password")}
          />
        )}
        {step === "password" && (
          <PasswordStep
            email={email}
            password={password}
            setPassword={setPassword}
            onSubmit={handlePasswordSubmit}
          />
        )}
      </div>
    </div>
  );
}

function EmailStep({
  email,
  setEmail,
  onNext,
}: {
  email: string;
  setEmail: (v: string) => void;
  onNext: () => void;
}) {
  const valid = email.trim().length > 0;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onNext();
      }}
      className="flex flex-col gap-4"
    >
      <div>
        <label className="mb-2 block text-[13px] font-semibold">이메일</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@naver.com"
          autoComplete="email"
          className="h-12 w-full rounded-md border border-divider bg-white px-4 text-sm text-ink-primary outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
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
    </form>
  );
}

function CodeStep({
  email,
  code,
  setCode,
  remain,
  onResend,
  onNext,
}: {
  email: string;
  code: string[];
  setCode: (v: string[]) => void;
  remain: number;
  onResend: () => void;
  onNext: () => void;
}) {
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [local, domain] = email.split("@");
  const masked = local
    ? local.length <= 2
      ? local[0] + "***"
      : local.slice(0, 2) + "***"
    : "메일";
  const maskedEmail = `${masked}@${domain || ""}`;
  const mm = String(Math.floor(remain / 60)).padStart(2, "0");
  const ss = String(remain % 60).padStart(2, "0");
  const expired = remain <= 0;

  React.useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const onChange = (i: number, v: string) => {
    const next = [...code];
    next[i] = v.replace(/\D/g, "").slice(0, 1);
    setCode(next);
    if (next[i] && i < 5) inputs.current[i + 1]?.focus();
  };
  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
  };
  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    const next = [...code];
    text.split("").forEach((c, idx) => {
      if (idx < 6) next[idx] = c;
    });
    setCode(next);
    const focusIdx = Math.min(text.length, 5);
    inputs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-1 text-[13px] font-semibold">활성화 코드</div>
        <p className="text-xs text-ink-secondary">
          <span className="font-medium">{maskedEmail}</span>로 보낸{" "}
          <b>6자리 코드</b>를 입력해주세요.
        </p>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {code.map((c, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={c}
            maxLength={1}
            inputMode="numeric"
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={onPaste}
            className="h-12 w-full rounded-md border border-divider bg-white text-center text-[20px] font-bold text-ink-primary outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-ink-secondary">
        <span>
          남은 시간{" "}
          <b className={expired ? "text-danger" : "text-brand-500"}>
            {expired ? "만료됨" : `${mm}:${ss}`}
          </b>
        </span>
        <button
          type="button"
          onClick={onResend}
          className="text-[13px] font-semibold text-brand-500 hover:text-brand-600"
        >
          코드 재전송
        </button>
      </div>
      <button
        onClick={onNext}
        className="h-12 w-full rounded-md bg-brand-500 font-semibold text-white hover:bg-brand-600"
      >
        다음
      </button>
    </div>
  );
}

function PasswordStep({
  email,
  password,
  setPassword,
  onSubmit,
}: {
  email: string;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [show, setShow] = React.useState(false);
  const [local, domain] = email.split("@");
  const masked = local
    ? local.length <= 2
      ? local[0] + "***"
      : local.slice(0, 2) + "***"
    : "메일";
  const maskedEmail = `${masked}@${domain || ""}`;

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const canSubmit = password.trim().length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <div>
        <div className="mb-1 text-[13px] font-semibold">비밀번호</div>
        <p className="text-xs text-ink-secondary">
          <span className="font-medium">{maskedEmail}</span> 계정으로 로그인합니다.
        </p>
      </div>
      <div className="relative">
        <input
          ref={inputRef}
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
          className="h-12 w-full rounded-md border border-divider bg-white pl-4 pr-12 text-sm text-ink-primary outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-tertiary hover:bg-muted"
          aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <div className="-mt-1 flex items-center justify-end">
        <button
          type="button"
          className="text-[12px] font-semibold text-brand-500 hover:text-brand-600"
          onClick={() =>
            alert(
              "비밀번호 재설정 안내 메일을 발송했습니다. (데모용 — 실제로는 발송되지 않습니다.)"
            )
          }
        >
          비밀번호 찾기
        </button>
      </div>
      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "h-12 w-full rounded-md font-semibold transition-colors",
          canSubmit
            ? "bg-brand-500 text-white hover:bg-brand-600"
            : "cursor-not-allowed bg-muted text-ink-tertiary"
        )}
      >
        로그인
      </button>
    </form>
  );
}

