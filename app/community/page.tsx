"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Chip } from "@/components/pond/chip";
import { InfoBox } from "@/components/pond/info-box";
import { usePosts, removePost, type Post } from "@/lib/posts-store";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type Tab = "schedule" | "notice";

export default function CommunityPage() {
  const sp = useSearchParams();
  const initial = (sp?.get("tab") as Tab) || "schedule";
  const [tab, setTab] = React.useState<Tab>(initial);
  const { toast } = useToast();

  React.useEffect(() => {
    if (sp?.get("tab")) setTab(sp.get("tab") as Tab);
  }, [sp]);

  const schedule = usePosts("schedule");
  const notices = usePosts("notice");

  const handleDelete = (p: Post) => {
    if (confirm(`"${p.title}" 게시글을 삭제할까요?`)) {
      removePost(p.id);
      toast({ message: "게시글이 삭제되었습니다." });
    }
  };

  return (
    <>
      <Topbar title="커뮤니티" writeKind={tab === "notice" ? "notice" : "schedule"} />
      <AppShell hideBottomNav>
        <div className="flex border-b border-divider">
          {(["schedule", "notice"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 border-b-2 py-3 text-sm font-semibold -mb-px transition-colors",
                tab === t ? "border-brand-500 text-brand-500" : "border-transparent text-ink-tertiary"
              )}
            >
              {t === "schedule" ? "학원 일정" : "공지사항"}
            </button>
          ))}
        </div>

        {tab === "schedule" ? (
          <div className="flex flex-col gap-3.5">
            <div className="px-1 pt-1 text-xs font-semibold text-ink-tertiary">
              학원 일정 {schedule.length}개
            </div>
            {schedule.length === 0 && (
              <InfoBox>등록된 일정이 없어요. 우상단 글쓰기로 추가해보세요.</InfoBox>
            )}
            {schedule.map((ev) => (
              <div key={ev.id} className="pond-card group flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{ev.date}</span>
                  <div className="flex items-center gap-2">
                    {ev.tag && (
                      <Chip
                        variant={
                          ev.tag === "휴원" ? "warning" : ev.tag === "행사" ? "scheduled" : "scheduled"
                        }
                      >
                        {ev.tag}
                      </Chip>
                    )}
                    <button
                      onClick={() => handleDelete(ev)}
                      className="rounded p-1 text-ink-tertiary opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                      aria-label="삭제"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="font-medium text-ink-primary">{ev.title}</div>
                {ev.content && (
                  <div className="text-xs leading-relaxed text-ink-secondary">{ev.content}</div>
                )}
              </div>
            ))}
            <InfoBox>학부모 어플과 메인 홈페이지에 자동으로 노출됩니다.</InfoBox>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <div className="px-1 pt-1 text-xs font-semibold text-ink-tertiary">
              공지사항 {notices.length}개
            </div>
            {notices.length === 0 && (
              <InfoBox>등록된 공지가 없어요. 우상단 글쓰기로 추가해보세요.</InfoBox>
            )}
            {notices.map((n) => (
              <div key={n.id} className="pond-card group flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  {n.pinned && <Chip variant="scheduled">필독</Chip>}
                  {n.tag && !n.pinned && <Chip variant="muted">{n.tag}</Chip>}
                  <span className="text-[11px] text-ink-tertiary">{n.date}</span>
                  {n.author && (
                    <span className="text-[11px] text-ink-tertiary">· {n.author}</span>
                  )}
                  <button
                    onClick={() => handleDelete(n)}
                    className="ml-auto rounded p-1 text-ink-tertiary opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                    aria-label="삭제"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="font-semibold text-ink-primary">{n.title}</div>
                {n.content && (
                  <div className="text-xs leading-relaxed text-ink-secondary">{n.content}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </AppShell>
    </>
  );
}
