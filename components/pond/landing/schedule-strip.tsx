"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePosts } from "@/lib/posts-store";

function formatScheduleDate(d: string) {
  // d is YYYY-MM-DD
  const [, m, day] = d.split("-");
  return `${parseInt(m || "0", 10)}/${parseInt(day || "0", 10)}`;
}

function getDayLabel(d: string) {
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `(${days[date.getDay()]})`;
}

export function ScheduleStrip() {
  const events = usePosts("schedule").slice(0, 5);

  return (
    <section className="bg-white py-12 md:py-16" id="schedule">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-500">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Schedule</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">학원 일정표</h2>
          </div>
          <div className="hidden text-xs text-ink-tertiary md:block">
            선생님이 등록한 학사 · 행사 · 휴원 일정
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-divider bg-[#FAFBFD] py-12 text-center text-sm text-ink-tertiary">
            등록된 일정이 없어요.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col gap-1.5 rounded-2xl border border-divider bg-white p-4 transition-shadow hover:shadow-elev2"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-brand-500">
                    {formatScheduleDate(ev.date)}
                  </span>
                  <span className="text-[11px] text-ink-tertiary">{getDayLabel(ev.date)}</span>
                </div>
                {ev.tag && (
                  <span
                    className={cn(
                      "self-start rounded-pill px-2 py-0.5 text-[10px] font-semibold",
                      ev.tag === "휴원"
                        ? "bg-rose-50 text-rose-600"
                        : ev.tag === "행사"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-brand-50 text-brand-600"
                    )}
                  >
                    {ev.tag}
                  </span>
                )}
                <div className="text-sm font-semibold text-ink-primary">{ev.title}</div>
                {ev.content && (
                  <div className="text-[11px] leading-snug text-ink-secondary">{ev.content}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
