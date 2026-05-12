"use client";

import * as React from "react";
import { NotebookPen, Send, Save, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/teacher/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { NoteVisibilityBadge } from "@/components/teacher/status-badges";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";
import {
  currentTeacher,
  mockClasses,
  mockDailyNotes,
  mockStudents,
} from "@/lib/mock-data";
import type {
  DailyNote,
  MealStatus,
  Mood,
  NapStatus,
  NoteVisibility,
  Student,
} from "@/types";
import { initials, todayISO, cn } from "@/lib/utils";

export default function DailyNotesPage() {
  const teacher = currentTeacher;
  const { toast } = useToast();
  const { t } = useI18n();

  const MOOD_OPTIONS: { value: Mood; key: string }[] = [
    { value: "happy", key: "notes.mood.happy" },
    { value: "excited", key: "notes.mood.excited" },
    { value: "neutral", key: "notes.mood.neutral" },
    { value: "tired", key: "notes.mood.tired" },
    { value: "sad", key: "notes.mood.sad" },
  ];
  const MEAL_OPTIONS: { value: MealStatus; key: string }[] = [
    { value: "all", key: "notes.meal.all" },
    { value: "most", key: "notes.meal.most" },
    { value: "some", key: "notes.meal.some" },
    { value: "none", key: "notes.meal.none" },
  ];
  const NAP_OPTIONS: { value: NapStatus; key: string }[] = [
    { value: "well", key: "notes.nap.well" },
    { value: "short", key: "notes.nap.short" },
    { value: "none", key: "notes.nap.none" },
  ];

  const branchClasses = mockClasses.filter(
    (c) => c.branch_id === teacher.branch_id && c.status === "active"
  );

  const [date, setDate] = React.useState(todayISO());
  const [classId, setClassId] = React.useState(branchClasses[0]?.id ?? "");
  const [notes, setNotes] = React.useState<DailyNote[]>(mockDailyNotes);
  const [studentListOpen, setStudentListOpen] = React.useState(false);

  const classStudents: Student[] = mockStudents.filter(
    (s) =>
      s.branch_id === teacher.branch_id &&
      s.class_id === classId &&
      s.status === "active"
  );

  const [activeStudentId, setActiveStudentId] = React.useState<string | null>(
    classStudents[0]?.id ?? null
  );

  React.useEffect(() => {
    setActiveStudentId(classStudents[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const noteFor = (studentId: string) =>
    notes.find((n) => n.student_id === studentId && n.date === date);

  const activeStudent = classStudents.find((s) => s.id === activeStudentId);
  const existingNote = activeStudent ? noteFor(activeStudent.id) : undefined;

  const [form, setForm] = React.useState({
    mood: "happy" as Mood,
    meal: "all" as MealStatus,
    nap: "well" as NapStatus,
    health: "",
    activity_summary: "",
    teacher_comment: "",
  });

  React.useEffect(() => {
    if (existingNote) {
      setForm({
        mood: existingNote.mood,
        meal: existingNote.meal,
        nap: existingNote.nap,
        health: existingNote.health,
        activity_summary: existingNote.activity_summary,
        teacher_comment: existingNote.teacher_comment,
      });
    } else {
      setForm({
        mood: "happy",
        meal: "all",
        nap: "well",
        health: "",
        activity_summary: "",
        teacher_comment: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingNote?.id, activeStudentId]);

  const upsertNote = (visibility: NoteVisibility, successKey: string): void => {
    if (!activeStudent) return;
    const now = new Date().toISOString();

    setNotes((prev) => {
      const idx = prev.findIndex(
        (n) => n.student_id === activeStudent.id && n.date === date
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          ...form,
          visibility_status: visibility,
          published_at:
            visibility === "published"
              ? updated[idx].published_at ?? now
              : updated[idx].published_at,
          updated_at: now,
        };
        return updated;
      }
      const created: DailyNote = {
        id: `note-${Date.now()}`,
        student_id: activeStudent.id,
        branch_id: teacher.branch_id,
        class_id: activeStudent.class_id,
        date,
        ...form,
        visibility_status: visibility,
        published_at: visibility === "published" ? now : undefined,
        created_by: teacher.id,
        created_at: now,
        updated_at: now,
      };
      return [created, ...prev];
    });

    toast({ title: t(successKey) });
  };

  const status = (s: Student): NoteVisibility | "not_started" => {
    const n = noteFor(s.id);
    if (!n) return "not_started";
    return n.visibility_status;
  };

  const StudentListItems = () => (
    <ul className="divide-y divide-border">
      {classStudents.map((s) => {
        const st = status(s);
        const isActive = s.id === activeStudentId;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => {
                setActiveStudentId(s.id);
                setStudentListOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                isActive ? "bg-primary/5" : "hover:bg-muted/40 active:bg-muted/40"
              )}
            >
              <Avatar
                src={s.profile_image}
                alt={s.name}
                fallback={initials(s.name)}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{s.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {st === "not_started" ? (
                    <Badge variant="muted">{t("notes.notStarted")}</Badge>
                  ) : (
                    <NoteVisibilityBadge status={st} />
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title={t("notes.title")}
        description={t("notes.subtitle")}
      />

      <Card className="p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="sm:w-44"
            aria-label={t("attendance.date")}
          />
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder={t("attendance.class")} />
            </SelectTrigger>
            <SelectContent>
              {branchClasses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {classStudents.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title={t("notes.empty.title")}
          description={t("notes.empty.desc")}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          {/* Mobile student switcher */}
          <Card className="overflow-hidden lg:hidden">
            <button
              type="button"
              onClick={() => setStudentListOpen((p) => !p)}
              className="flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                {activeStudent ? (
                  <Avatar
                    src={activeStudent.profile_image}
                    alt={activeStudent.name}
                    fallback={initials(activeStudent.name)}
                  />
                ) : null}
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t("notes.studentList")}
                  </div>
                  <div className="text-sm font-medium">
                    {activeStudent?.name ?? "—"}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                  studentListOpen && "rotate-180"
                )}
              />
            </button>
            {studentListOpen ? <StudentListItems /> : null}
          </Card>

          {/* Desktop student list */}
          <Card className="hidden overflow-hidden lg:block">
            <div className="border-b border-border px-4 py-3 text-sm font-medium">
              {t("notes.studentList")}
            </div>
            <StudentListItems />
          </Card>

          {activeStudent ? (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4 p-4 sm:p-6">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base sm:text-lg">
                    {activeStudent.name}
                  </CardTitle>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {t("notes.subtitleFor", { date })}
                  </div>
                </div>
                {existingNote ? (
                  <NoteVisibilityBadge
                    status={existingNote.visibility_status}
                  />
                ) : (
                  <Badge variant="muted">{t("notes.notStarted")}</Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
                <div className="grid gap-3 grid-cols-3">
                  <div className="grid gap-2">
                    <Label>{t("notes.field.mood")}</Label>
                    <Select
                      value={form.mood}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, mood: v as Mood }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MOOD_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {t(o.key)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("notes.field.meal")}</Label>
                    <Select
                      value={form.meal}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, meal: v as MealStatus }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MEAL_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {t(o.key)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("notes.field.nap")}</Label>
                    <Select
                      value={form.nap}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, nap: v as NapStatus }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NAP_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {t(o.key)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="health">{t("notes.field.health")}</Label>
                  <Input
                    id="health"
                    placeholder={t("notes.field.healthPh")}
                    value={form.health}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, health: e.target.value }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="activity">{t("notes.field.activity")}</Label>
                  <Textarea
                    id="activity"
                    rows={3}
                    placeholder={t("notes.field.activityPh")}
                    value={form.activity_summary}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        activity_summary: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="comment">{t("notes.field.comment")}</Label>
                  <Textarea
                    id="comment"
                    rows={4}
                    placeholder={t("notes.field.commentPh")}
                    value={form.teacher_comment}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        teacher_comment: e.target.value,
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => upsertNote("draft", "notes.toast.draft")}
                  >
                    <Save className="h-4 w-4" />
                    {t("common.saveDraft")}
                  </Button>
                  <Button
                    onClick={() =>
                      upsertNote(
                        "published",
                        existingNote?.visibility_status === "published"
                          ? "notes.toast.updated"
                          : "notes.toast.published"
                      )
                    }
                  >
                    <Send className="h-4 w-4" />
                    {existingNote?.visibility_status === "published"
                      ? t("notes.updatePublished")
                      : t("notes.publish")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
