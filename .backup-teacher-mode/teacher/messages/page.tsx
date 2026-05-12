"use client";

import * as React from "react";
import {
  Search,
  Send,
  MessagesSquare,
  Check,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/teacher/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";
import {
  currentTeacher,
  mockConversations,
  mockMessages,
} from "@/lib/mock-data";
import type { Conversation, Message } from "@/types";
import { cn, formatDate, initials } from "@/lib/utils";

export default function MessagesPage() {
  const teacher = currentTeacher;
  const { t, locale } = useI18n();

  const [conversations, setConversations] = React.useState<Conversation[]>(
    mockConversations.filter((c) => c.branch_id === teacher.branch_id)
  );
  const [messagesByConv, setMessagesByConv] = React.useState<
    Record<string, Message[]>
  >(mockMessages);

  const [search, setSearch] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");

  const filteredConvs = conversations.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.student_name.toLowerCase().includes(q) ||
      c.parent_name.toLowerCase().includes(q)
    );
  });

  const active = conversations.find((c) => c.id === activeId);
  const messages = activeId ? messagesByConv[activeId] ?? [] : [];

  const selectConv = (id: string) => {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread_count: 0 } : c))
    );
    setMessagesByConv((prev) => {
      const list = prev[id] ?? [];
      const now = new Date().toISOString();
      return {
        ...prev,
        [id]: list.map((m) =>
          m.sender_role === "parent" && !m.read_at ? { ...m, read_at: now } : m
        ),
      };
    });
  };

  const send = () => {
    if (!draft.trim() || !activeId) return;
    const now = new Date().toISOString();
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: activeId,
      sender_id: teacher.id,
      sender_role: "teacher",
      message: draft.trim(),
      created_at: now,
    };
    setMessagesByConv((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMsg],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              last_message: draft.trim(),
              last_message_at: now,
              updated_at: now,
            }
          : c
      )
    );
    setDraft("");
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader title={t("messages.title")} description={t("messages.subtitle")} />

      <Card className="overflow-hidden">
        <div className="grid h-[calc(100vh-15rem)] min-h-[540px] grid-cols-1 lg:grid-cols-[320px_1fr]">
          {/* Conversation list */}
          <div
            className={cn(
              "flex flex-col border-r border-border",
              activeId ? "hidden lg:flex" : "flex"
            )}
          >
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={t("messages.searchPh")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={MessagesSquare}
                    title={t("messages.empty.list")}
                    description={t("messages.empty.listDesc")}
                  />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {filteredConvs.map((c) => {
                    const isActive = c.id === activeId;
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => selectConv(c.id)}
                          className={cn(
                            "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                            isActive
                              ? "bg-primary/5"
                              : "hover:bg-muted/40 active:bg-muted/40"
                          )}
                        >
                          <Avatar
                            fallback={initials(c.student_name)}
                            size={40}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="truncate text-sm font-medium">
                                {c.student_name}
                              </div>
                              <div className="shrink-0 text-xs text-muted-foreground">
                                {formatDate(c.last_message_at, "time", locale)}
                              </div>
                            </div>
                            <div className="mt-0.5 truncate text-xs text-muted-foreground">
                              {t("messages.parent")}: {c.parent_name}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="line-clamp-1 flex-1 text-xs text-muted-foreground">
                                {c.last_message}
                              </div>
                              {c.unread_count > 0 ? (
                                <Badge variant="destructive">
                                  {c.unread_count}
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Chat window */}
          <div
            className={cn(
              "flex min-h-0 flex-col",
              !activeId && "hidden lg:flex"
            )}
          >
            {active ? (
              <>
                <div className="flex items-center gap-2 border-b border-border px-3 py-3 sm:px-5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 lg:hidden"
                    onClick={() => setActiveId(null)}
                    aria-label={t("common.close")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar fallback={initials(active.student_name)} size={36} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {active.student_name}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {t("messages.parent")}: {active.parent_name}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-muted/20 px-3 py-4 sm:px-5">
                  {messages.length === 0 ? (
                    <EmptyState
                      icon={MessagesSquare}
                      title={t("messages.empty.thread")}
                      description={t("messages.empty.threadDesc")}
                    />
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => {
                        const isMe = m.sender_role === "teacher";
                        return (
                          <div
                            key={m.id}
                            className={cn(
                              "flex",
                              isMe ? "justify-end" : "justify-start"
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                                isMe
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background border border-border"
                              )}
                            >
                              <div className="whitespace-pre-wrap break-words">
                                {m.message}
                              </div>
                              <div
                                className={cn(
                                  "mt-1 flex items-center gap-1 text-[10px]",
                                  isMe
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                )}
                              >
                                {formatDate(m.created_at, "time", locale)}
                                {isMe ? (
                                  m.read_at ? (
                                    <CheckCheck className="h-3 w-3" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Separator />
                <div className="flex items-end gap-2 p-3 sm:p-4">
                  <Textarea
                    rows={2}
                    placeholder={t("messages.composePh")}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                  />
                  <Button onClick={send} disabled={!draft.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {t("common.send")}
                    </span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden items-center justify-center p-8 lg:flex">
                <EmptyState
                  icon={MessagesSquare}
                  title={t("messages.empty.select")}
                  description={t("messages.empty.selectDesc")}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
