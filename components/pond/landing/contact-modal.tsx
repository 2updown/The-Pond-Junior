"use client";

import * as React from "react";
import { X, Phone, Mail, MessageCircle } from "lucide-react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 상담문의 모달.
 * - 지금은 전화/이메일 정보를 노출
 * - 추후 카카오톡 채널 등 SNS URL이 정해지면 CONTACT_LINKS만 교체하면 됨
 */
const CONTACT = {
  phone: "02-1234-5678",
  email: "info@letitu.com",
};

export function ContactModal({ open, onClose }: ContactModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 px-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="상담문의"
        className="relative w-full max-w-[380px] rounded-2xl bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex flex-col items-center pt-1 text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <MessageCircle className="h-6 w-6" />
          </span>
          <h2 className="text-lg font-bold tracking-tight">상담문의</h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
            아래 연락처로 편하게 문의 부탁드립니다.
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          <li>
            <a
              href={`tel:${CONTACT.phone.replace(/-/g, "")}`}
              className="flex items-center gap-3 rounded-xl border border-divider bg-white px-4 py-3.5 transition-colors hover:border-brand-500 hover:bg-brand-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                <Phone className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="text-[11px] font-semibold text-ink-tertiary">전화 문의</div>
                <div className="text-[15px] font-bold text-ink-primary">{CONTACT.phone}</div>
              </div>
            </a>
          </li>
          <li>
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-3 rounded-xl border border-divider bg-white px-4 py-3.5 transition-colors hover:border-brand-500 hover:bg-brand-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                <Mail className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="text-[11px] font-semibold text-ink-tertiary">이메일 문의</div>
                <div className="text-[14px] font-bold text-ink-primary">{CONTACT.email}</div>
              </div>
            </a>
          </li>
        </ul>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-ink-tertiary">
          카카오톡 채널 등 SNS 문의는 추후 연결 예정입니다.
        </p>
      </div>
    </div>
  );
}
