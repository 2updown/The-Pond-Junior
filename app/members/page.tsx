"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Avatar } from "@/components/pond/avatar";
import { Chip } from "@/components/pond/chip";
import { Segment } from "@/components/pond/segment";
import { InfoBox } from "@/components/pond/info-box";
import { TEACHERS, STUDENTS, ATTENDANCE_TODAY } from "@/lib/mock-data";

type Tab = "teacher" | "student" | "attendance";

export default function MembersPage() {
  const sp = useSearchParams();
  const initialTab = (sp?.get("tab") as Tab) || "teacher";
  const [tab, setTab] = React.useState<Tab>(initialTab);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (sp?.get("tab")) setTab(sp.get("tab") as Tab);
  }, [sp]);

  const filteredStudents = STUDENTS.filter(
    (s) =>
      !query || s.name.includes(query) || s.grade.includes(query) || s.subject.includes(query)
  );
  const present = ATTENDANCE_TODAY.filter((a) => a.status === "present").length;
  const late = ATTENDANCE_TODAY.filter((a) => a.status === "late").length;
  const absent = ATTENDANCE_TODAY.filter((a) => a.status === "absent").length;

  return (
    <>
      <Topbar title="회원관리" />
      <AppShell hideBottomNav>
        <div className="flex border-b border-divider">
          {(["teacher", "student", "attendance"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "flex-1 border-b-2 py-3 text-sm font-semibold transition-colors -mb-px " +
                (tab === t
                  ? "border-brand-500 text-brand-500"
                  : "border-transparent text-ink-tertiary")
              }
            >
              {t === "teacher" ? "교사" : t === "student" ? "학생" : "출결"}
            </button>
          ))}
        </div>

        {tab === "teacher" && (
          <div className="flex flex-col gap-3.5">
            <Segment
              options={[
                { value: "active", label: "정규 교사 (5)" },
                { value: "resigned", label: "퇴사 교사 (2)" },
              ]}
              value="active"
              onChange={() => {}}
            />
            <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
              {TEACHERS.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2.5 border-b border-divider px-4 py-3 last:border-b-0"
                >
                  <Avatar initial={t.initial} color={t.color} size="sm" />
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{t.name}</div>
                    <div className="text-[11px] text-ink-secondary">
                      {t.subject} · {t.phone}
                    </div>
                  </div>
                  <Chip variant={t.role === "director" ? "scheduled" : "role"}>
                    {t.role === "director" ? "원장" : "강사"}
                  </Chip>
                </div>
              ))}
            </div>
            <InfoBox>교사 등록·수정·퇴사 처리는 PC에서 진행해주세요.</InfoBox>
          </div>
        )}

        {tab === "student" && (
          <div className="flex flex-col gap-3.5">
            <Segment
              options={[
                { value: "active", label: "정규 (24)" },
                { value: "paused", label: "정지 (2)" },
                { value: "withdrawn", label: "탈퇴 (5)" },
              ]}
              value="active"
              onChange={() => {}}
            />
            <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 shadow-elev1">
              <Search className="h-4 w-4 text-ink-tertiary" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="이름·학년·연락처로 검색"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-tertiary"
              />
            </div>
            <div className="flex flex-col gap-3">
              {filteredStudents.map((s) => (
                <div key={s.id} className="pond-card flex items-center gap-3.5">
                  <Avatar initial={s.initial} color={s.color} />
                  <div className="flex-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-ink-secondary">
                      {s.grade} · {s.subject} · {s.phone}
                    </div>
                  </div>
                  <Chip variant="scheduled">정규</Chip>
                </div>
              ))}
            </div>
            <InfoBox>학생 개별 등록 / 엑셀 일괄 등록은 PC에서 진행해주세요.</InfoBox>
          </div>
        )}

        {tab === "attendance" && (
          <div className="flex flex-col gap-3.5">
            <div className="pond-card flex flex-col gap-2">
              <div className="text-xs font-semibold text-ink-tertiary">2026년 5월 12일 (화)</div>
              <div className="mt-1 flex gap-3.5">
                <Stat label="출석" value={present} color="text-success" />
                <Stat label="지각" value={late} color="text-warning" />
                <Stat label="결석" value={absent} color="text-danger" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
              {ATTENDANCE_TODAY.map((a) => (
                <div
                  key={a.studentId}
                  className="flex items-center gap-2.5 border-b border-divider px-4 py-3 last:border-b-0"
                >
                  <Avatar initial={a.initial} color={a.color} size="sm" />
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{a.studentName}</div>
                    <div className="text-[11px] text-ink-secondary">
                      {a.time || (a.alimtalkSent ? "학부모 알림톡 자동 발송됨" : "")}
                    </div>
                  </div>
                  <Chip
                    variant={
                      a.status === "present" ? "done" : a.status === "late" ? "warning" : "canceled"
                    }
                  >
                    {a.status === "present" ? "출석" : a.status === "late" ? "지각" : "결석"}
                  </Chip>
                </div>
              ))}
            </div>
            <InfoBox>
              자동 출결: NFC 카드 태깅 시 자동 처리. 학부모 알림톡 자동 발송 연동.
            </InfoBox>
          </div>
        )}
      </AppShell>
    </>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex-1">
      <div className="text-[11px] text-ink-secondary">{label}</div>
      <div className={"text-xl font-bold " + color}>{value}</div>
    </div>
  );
}
