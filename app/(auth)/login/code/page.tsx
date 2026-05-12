"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginCodePage() {
  const router = useRouter();
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [remain, setRemain] = React.useState(600);
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [maskedEmail, setMaskedEmail] = React.useState("메일");

  React.useEffect(() => {
    const email = sessionStorage.getItem("pond_email") || "example@email.com";
    const [local, domain] = email.split("@");
    const masked = local.length <= 2 ? local[0] + "***" : local.slice(0, 2) + "***";
    setMaskedEmail(`${masked}@${domain || ""}`);
  }, []);

  React.useEffect(() => {
    if (remain <= 0) return;
    const t = setInterval(() => setRemain((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [remain]);

  // 테스트 편의를 위해 항상 진행 가능
  const filled = true;

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

  const mm = String(Math.floor(remain / 60)).padStart(2, "0");
  const ss = String(remain % 60).padStart(2, "0");
  const expired = remain <= 0;

  const handleSubmit = () => {
    if (!filled) return;
    router.push("/login/set-password");
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
        <span className="text-[17px] font-semibold">활성화 코드</span>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 px-6 pt-2 pb-8">
        <h1 className="px-1 text-[26px] font-bold leading-snug tracking-tight">
          코드를 입력해주세요
        </h1>
        <p className="-mt-3 text-xs text-ink-secondary">
          <span className="font-medium">{maskedEmail}</span>로 보낸 <b>6자리 코드</b>를 입력해주세요.
        </p>

        <div className="my-4 grid grid-cols-6 gap-2">
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
              className="h-14 w-full rounded-md border border-divider bg-white text-center text-[22px] font-bold text-ink-primary outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
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
            onClick={() => setRemain(600)}
            className="text-[13px] font-semibold text-brand-500"
          >
            코드 재전송
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!filled}
          className={cn(
            "mt-5 h-12 w-full rounded-md font-semibold transition-colors",
            filled
              ? "bg-brand-500 text-white hover:bg-brand-600"
              : "cursor-not-allowed bg-muted text-ink-tertiary"
          )}
        >
          다음
        </button>

        <p className="mt-4 text-center text-xs text-ink-secondary">
          코드를 받지 못하셨나요? 스팸함을 확인하거나 잠시 기다린 뒤 재전송을 눌러주세요.
        </p>
      </div>
    </div>
  );
}
