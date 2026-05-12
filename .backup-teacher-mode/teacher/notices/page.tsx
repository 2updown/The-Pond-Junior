"use client";

import * as React from "react";
import { Megaphone, Plus, Eye, Send, Save, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/teacher/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { NoticeStatusBadge } from "@/components/teacher/status-badges";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";
import {
  currentTeacher,
  mockClasses,
  mockNotices,
  mockStudents,
} from "@/lib/mock-data";
import type { Notice, NoticeTarget } from "@/types";
import { cn, formatDate } from "@/lib/utils";

export default function NoticesPage() {
  const teacher = currentTeacher;
  const { toast } = useToast();
  const { t, locale } = useI18n();
  const branchClasses = mockClasses.filter(
    (c) => c.branch_id === teacher.branch_id
  );

  const [notices, setNotices] = React.useState<Notice[]>(
    mockNotices.filter((n) => n.branch_id === teacher.branch_id)
  );
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Notice | undefined>(undefined);

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [target, setTarget] = React.useState<NoticeTarget>("all_branch");
  const [classId, setClassId] = React.useState<string>(
    branchClasses[0]?.id ?? ""
  );
  const [studentIds, setStudentIds] = React.useState<string[]>([]);

  const studentsInClass = mockStudents.filter(
    (s) => s.class_id === classId && s.status === "active"
  );

  const open = (n?: Notice) => {
    setEditing(n);
    setTitle(n?.title ?? "");
    setContent(n?.content ?? "");
    setTarget(n?.target_type ?? "all_branch");
    setClassId(n?.class_id ?? branchClasses[0]?.id ?? "");
    setStudentIds(n?.target_student_ids ?? []);
    setEditorOpen(true);
  };

  const close = () => setEditorOpen(false);

  const upsert = (status: Notice["status"], successKey: string) => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: t("notices.toast.titleRequired"),
        variant: "error",
      });
      return;
    }
    const now = new Date().toISOString();
    if (editing) {
      setNotices((prev) =>
        prev.map((n) =>
          n.id === editing.id
            ? {
                ...n,
                title,
                content,
                target_type: target,
                class_id: target === "all_branch" ? undefined : classId,
                target_student_ids:
                  target === "selected_students" ? studentIds : undefined,
                status,
                published_at:
                  status === "published"
                    ? n.published_at ?? now
                    : n.published_at,
                updated_at: now,
              }
            : n
        )
      );
    } else {
      const created: Notice = {
        id: `notice-${Date.now()}`,
        branch_id: teacher.branch_id,
        class_id: target === "all_branch" ? undefined : classId,
        target_type: target,
        target_student_ids:
          target === "selected_students" ? studentIds : undefined,
        title,
        content,
        status,
        published_at: status === "published" ? now : undefined,
        created_by: teacher.id,
        created_at: now,
        updated_at: now,
      };
      setNotices((prev) => [created, ...prev]);
    }
    toast({ title: t(successKey) });
    close();
  };

  const targetSummary = (n: Notice) => {
    if (n.target_type === "all_branch")
      return t("notices.target.allBranchSummary");
    if (n.target_type === "class") {
      const c = branchClasses.find((x) => x.id === n.class_id);
      return t("notices.target.classSummary", { name: c?.name ?? "—" });
    }
    const count = n.target_student_ids?.length ?? 0;
    return count === 1
      ? t("notices.target.selectedSummaryOne", { count })
      : t("notices.target.selectedSummary", { count });
  };

  const toggleStudent = (id: string) =>
    setStudentIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title={t("notices.title")}
        description={t("notices.subtitle")}
        actions={
          <Button onClick={() => open()} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" /> {t("notices.createBtn")}
          </Button>
        }
      />

      {notices.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={t("notices.empty.title")}
          description={t("notices.empty.desc")}
          action={
            <Button onClick={() => open()}>
              <Plus className="h-4 w-4" /> {t("notices.createBtn")}
            </Button>
          }
        />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {notices.map((n) => (
              <Card
                key={n.id}
                className="cursor-pointer p-3 active:bg-muted/40"
                onClick={() => open(n)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-medium">{n.title}</span>
                      <NoticeStatusBadge status={n.status} />
                    </div>
                    <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {n.content}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {targetSummary(n)} · {formatDate(n.updated_at, "short", locale)}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop table */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("notices.col.title")}</TableHead>
                  <TableHead>{t("notices.col.target")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead>{t("common.updated")}</TableHead>
                  <TableHead className="text-right">
                    {t("common.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell>
                      <div className="font-medium">{n.title}</div>
                      <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {n.content}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {targetSummary(n)}
                    </TableCell>
                    <TableCell>
                      <NoticeStatusBadge status={n.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(n.updated_at, "short", locale)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => open(n)}
                      >
                        {t("common.edit")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? t("notices.editTitle") : t("notices.createTitle")}
            </DialogTitle>
            <DialogDescription>{t("notices.editDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="notice_title">{t("notices.field.title")}</Label>
              <Input
                id="notice_title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("notices.field.titlePh")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notice_content">{t("notices.field.content")}</Label>
              <Textarea
                id="notice_content"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("notices.field.contentPh")}
              />
            </div>

            <div className="grid gap-2">
              <Label>{t("notices.field.target")}</Label>
              <Select
                value={target}
                onValueChange={(v) => setTarget(v as NoticeTarget)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_branch">
                    {t("notices.target.allBranch")}
                  </SelectItem>
                  <SelectItem value="class">
                    {t("notices.target.class")}
                  </SelectItem>
                  <SelectItem value="selected_students">
                    {t("notices.target.selectedStudents")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {target !== "all_branch" ? (
              <div className="grid gap-2">
                <Label>{t("notices.field.targetClass")}</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branchClasses
                      .filter((c) => c.status === "active")
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {target === "selected_students" ? (
              <div className="grid gap-2">
                <Label>{t("notices.field.targetStudents")}</Label>
                <div className="flex flex-wrap gap-2 rounded-md border border-border p-3">
                  {studentsInClass.length === 0 ? (
                    <div className="text-xs text-muted-foreground">
                      {t("notices.studentsEmpty")}
                    </div>
                  ) : (
                    studentsInClass.map((s) => {
                      const on = studentIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleStudent(s.id)}
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-xs transition-colors",
                            on
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          )}
                        >
                          {s.name}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <Separator />
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="ghost"
              onClick={() => setPreviewOpen(true)}
              className="sm:mr-auto"
            >
              <Eye className="h-4 w-4" /> {t("common.preview")}
            </Button>
            <div className="hidden flex-1 sm:block" />
            <Button
              variant="outline"
              onClick={() => upsert("draft", "notices.toast.draft")}
            >
              <Save className="h-4 w-4" /> {t("common.saveDraft")}
            </Button>
            <Button
              onClick={() => upsert("published", "notices.toast.published")}
            >
              <Send className="h-4 w-4" /> {t("common.publish")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("notices.preview.title")}</DialogTitle>
            <DialogDescription>{t("notices.preview.desc")}</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <Badge variant="info" className="mb-2">
              {t("notices.preview.tag")}
            </Badge>
            <div className="text-base font-semibold">
              {title || t("notices.preview.untitled")}
            </div>
            <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
              {content || t("notices.preview.placeholder")}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewOpen(false)}>
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
