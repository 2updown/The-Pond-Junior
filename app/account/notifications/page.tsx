"use client";

import * as React from "react";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { cn } from "@/lib/utils";

interface Setting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  group: string;
}

const INITIAL: Setting[] = [
  { id: "1", group: "상담", label: "상담 30분 전 알림", description: "예정된 상담 30분 전에 푸시", enabled: true },
  { id: "2", group: "상담", label: "상담 취소·변경 알림", description: "학생이 일정을 변경했을 때", enabled: true },
  { id: "3", group: "할일", label: "제출 알림", description: "학생이 할일을 제출했을 때", enabled: true },
  { id: "4", group: "할일", label: "마감 임박 알림", description: "마감 1일 전 미제출 알림", enabled: false },
  { id: "5", group: "기타", label: "공지·업데이트 알림", description: "서비스 공지사항", enabled: false },
];

export default function NotificationsPage() {
  const [items, setItems] = React.useState<Setting[]>(INITIAL);
  const toggle = (id: string) =>
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));

  const groups = Array.from(new Set(items.map((s) => s.group)));

  return (
    <>
      <Topbar title="알림 설정" variant="back" />
      <AppShell hideBottomNav>
        {groups.map((g) => (
          <React.Fragment key={g}>
            <div className="px-1 pt-2 text-xs font-semibold text-ink-tertiary">{g}</div>
            {items
              .filter((s) => s.group === g)
              .map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3.5 rounded-md bg-white px-4 py-3.5 shadow-elev1"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-xs text-ink-secondary">{s.description}</div>
                  </div>
                  <button
                    onClick={() => toggle(s.id)}
                    className={cn(
                      "relative h-[26px] w-11 flex-none rounded-full transition-colors",
                      s.enabled ? "bg-brand-500" : "bg-muted"
                    )}
                    aria-pressed={s.enabled}
                  >
                    <span
                      className={cn(
                        "absolute top-[3px] block h-5 w-5 rounded-full bg-white transition-transform",
                        s.enabled ? "translate-x-[22px]" : "translate-x-[3px]"
                      )}
                      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}
                    />
                  </button>
                </div>
              ))}
          </React.Fragment>
        ))}
      </AppShell>
    </>
  );
}
