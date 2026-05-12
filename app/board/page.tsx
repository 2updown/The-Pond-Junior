import * as React from "react";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Chip } from "@/components/pond/chip";
import { BOARD_POSTS } from "@/lib/mock-data";

export default function BoardPage() {
  return (
    <>
      <Topbar title="본사 공지사항" />
      <AppShell hideBottomNav>
        {BOARD_POSTS.map((p) => (
          <div
            key={p.id}
            className="pond-card flex flex-col gap-1"
            style={p.pinned ? { border: "1px solid hsl(var(--brand-100))" } : undefined}
          >
            <div className="flex items-center gap-2">
              {p.pinned && <Chip variant="scheduled">필독</Chip>}
              <span className="text-[11px] text-ink-tertiary">{p.date}</span>
            </div>
            <div className="mt-1.5 font-bold">{p.title}</div>
            <div className="text-xs text-ink-secondary">{p.excerpt}</div>
          </div>
        ))}
      </AppShell>
    </>
  );
}
