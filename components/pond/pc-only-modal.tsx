"use client";

import * as React from "react";
import { Monitor } from "lucide-react";

interface PcOnlyModalProps {
  open: boolean;
  onClose: () => void;
  message: React.ReactNode;
}

export function PcOnlyModal({ open, onClose, message }: PcOnlyModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[340px] rounded-2xl bg-white p-6 text-center shadow-elev2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          <Monitor className="h-7 w-7" />
        </div>
        <h4 className="mb-2 text-base font-bold">PC에서 더 편하게 진행할 수 있어요</h4>
        <p className="mb-5 text-[13px] leading-[1.55] text-ink-secondary">{message}</p>
        <button
          onClick={onClose}
          className="h-12 w-full rounded-md bg-brand-500 font-semibold text-white hover:bg-brand-600"
        >
          확인
        </button>
      </div>
    </div>
  );
}
