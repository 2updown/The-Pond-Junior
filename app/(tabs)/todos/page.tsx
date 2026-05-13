"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Segment } from "@/components/pond/segment";
import { PcOnlyModal } from "@/components/pond/pc-only-modal";
import { TODOS_ACTIVE, TODOS_DONE } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tab = "active" | "done";

export default function TodosPage() {
  const [tab, setTab] = React.useState<Tab>("active");
  const [modalOpen, setModalOpen] = React.useState(false);

  const list = tab === "active" ? TODOS_ACTIVE : TODOS_DONE;

  return (
    <>
      <Topbar
        title="할일 목록"
        right={
          <button
            onClick={() => setModalOpen(true)}
            aria-label="할일 발행"
            className="flex h-10 w-10 items-center justify-center text-ink-primary"
          >
            <Plus className="h-[22px] w-[22px]" />
          </button>
        }
      />
      <AppShell>
        <Segment<Tab>
          options={[
            { value: "active", label: "진행중" },
            { value: "done", label: "완료" },
          ]}
          value={tab}
          onChange={setTab}
        />

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((todo) => {
            const ratio = todo.total > 0 ? (todo.submitted / todo.total) * 100 : 0;
            const fullyDone = todo.submitted === todo.total && todo.total > 0;
            return (
              <Link
                key={todo.id}
                href={`/todo/${todo.id}`}
                className={cn("pond-card flex flex-col gap-1.5", tab === "done" && "opacity-85")}
              >
                <div className="font-semibold text-ink-primary">{todo.title}</div>
                <div className="text-xs text-ink-secondary">
                  {todo.classOrStudent}
                  {tab === "active" && ` · D-${todo.daysLeft}`}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full transition-all",
                        fullyDone ? "bg-success" : "bg-brand-500"
                      )}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[11px]",
                      fullyDone ? "font-semibold text-success" : "text-ink-secondary"
                    )}
                  >
                    {todo.submitted}/{todo.total} 제출됨
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </AppShell>

      <PcOnlyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        message={
          <>
            할일 발행은 PC에서 작업하면
            <br />
            훨씬 빠르게 끝낼 수 있어요.
          </>
        }
      />
    </>
  );
}
