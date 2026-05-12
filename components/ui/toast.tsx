"use client";

import * as React from "react";
import { Check, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (params: { message: string; variant?: ToastVariant }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback<ToastContextValue["toast"]>(
    ({ message, variant = "success" }) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2800);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[200] flex justify-center px-5"
        aria-live="polite"
      >
        <div className="flex flex-col gap-2">
          {toasts.map((t) => (
            <div key={t.id} className="pond-toast animate-toast-in">
              <span
                className={cn(
                  "flex h-5 w-5 flex-none items-center justify-center rounded-full",
                  t.variant === "success" && "bg-success",
                  t.variant === "error" && "bg-danger",
                  t.variant === "info" && "bg-brand-500"
                )}
              >
                {t.variant === "success" ? (
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                ) : t.variant === "error" ? (
                  <AlertCircle className="h-3 w-3 text-white" />
                ) : (
                  <Info className="h-3 w-3 text-white" />
                )}
              </span>
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
