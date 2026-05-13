"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X, Check, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "email" | "code" | "password";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("email");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [remain, setRemain] = React.useState(600);
  const [pw1, setPw1] = React.useState("");
  const [pw2, setPw2] = React.useState("");

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setStep("email");
      setEmail("");
      setCode(["", "", "", "", "", ""]);
      setRemain(600);
      setPw1("");
      setPw2("");
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

  // Timer for code step
  React.useEffect(() => {
    if (step !== "code" || remain <= 0) return;
    const t = setInterval(() => setRemain((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [step, remain]);

  if (!open) return null;

  const handlePasswordSubmit = () => {
    localStorage.setItem("pond_logged_in", "true");
    onClose();
    router.push("/consultations?toast=password-changed");
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

        {/* Back button (steps 2-3) */}
        {step !== "email" && (
          <button
            onClick={() => setStep(step === "password" ? "code" : "email")}
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
            onNext={() => email.trim() && setStep("code")}
          />
        )}
        {step === "code" && (
          <CodeStep
            email={email}
            code={code}
            setCode={setCode}
            remain={remain}
            onResend={() => setRemain(600)}
            onNext={() => setStep("password")}
          />
        )}
        {step === "password" && (
          <PasswordStep
            pw1={pw1}
            pw2={pw2}
            setPw1={setPw1}
            setPw2={setPw2}
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
  pw1,
  pw2,
  setPw1,
  setPw2,
  onSubmit,
}: {
  pw1: string;
  pw2: string;
  setPw1: (v: string) => void;
  setPw2: (v: string) => void;
  onSubmit: () => void;
}) {
  const match = pw1.length > 0 && pw1 === pw2;
  const mismatch = pw2.length > 0 && pw1 !== pw2;
  const canSubmit = pw1.length > 0 && pw2.length > 0 && match;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[13px] font-semibold">새 비밀번호 설정</div>
      <input
        type="password"
        value={pw1}
        onChange={(e) => setPw1(e.target.value)}
        placeholder="새 비밀번호"
        className="h-12 w-full rounded-md border border-divider bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
      />
      <div>
        <input
          type="password"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          placeholder="비밀번호 확인"
          className={cn(
            "h-12 w-full rounded-md border bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15",
            mismatch ? "border-danger" : "border-divider"
          )}
        />
        {mismatch && (
          <p className="mt-2 text-xs text-danger">비밀번호가 일치하지 않습니다.</p>
        )}
        {match && (
          <p className="mt-2 flex items-center gap-1 text-xs text-success">
            <Check className="h-3 w-3" strokeWidth={3} />
            비밀번호가 일치합니다.
          </p>
        )}
      </div>
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className={cn(
          "h-12 w-full rounded-md font-semibold transition-colors",
          canSubmit
            ? "bg-brand-500 text-white hover:bg-brand-600"
            : "cursor-not-allowed bg-muted text-ink-tertiary"
        )}
      >
        완료
      </button>
    </div>
  );
}

