"use client";

import * as React from "react";
import { Plus, School, Users } from "lucide-react";
import { PageHeader } from "@/components/teacher/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { ClassStatusBadge } from "@/components/teacher/status-badges";
import { ClassFormDialog } from "@/components/teacher/class-form-dialog";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";
import {
  currentTeacher,
  mockClasses,
  mockStudents,
} from "@/lib/mock-data";
import type { ClassRoom } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ClassesPage() {
  const teacher = currentTeacher;
  const { toast } = useToast();
  const { t, locale } = useI18n();

  const [classes, setClasses] = React.useState<ClassRoom[]>(
    mockClasses
      .filter((c) => c.branch_id === teacher.branch_id)
      .map((c) => ({
        ...c,
        student_count: mockStudents.filter(
          (s) => s.class_id === c.id && s.status === "active"
        ).length,
      }))
  );

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ClassRoom | undefined>(
    undefined
  );

  const openAdd = () => {
    setEditing(undefined);
    setOpen(true);
  };
  const openEdit = (c: ClassRoom) => {
    setEditing(c);
    setOpen(true);
  };

  const deactivate = (c: ClassRoom) => {
    setClasses((prev) =>
      prev.map((x) =>
        x.id === c.id
          ? { ...x, status: "inactive", updated_at: new Date().toISOString() }
          : x
      )
    );
    toast({
      title: t("classes.toast.deactivated"),
      description: t("classes.toast.deactivatedDesc", { name: c.name }),
    });
  };

  const onSave = (data: Partial<ClassRoom>) => {
    if (editing) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? { ...c, ...data, updated_at: new Date().toISOString() }
            : c
        )
      );
    } else {
      const id = `class-${Date.now()}`;
      const now = new Date().toISOString();
      setClasses((prev) => [
        {
          id,
          branch_id: teacher.branch_id,
          name: data.name ?? "Untitled",
          teacher_id: data.teacher_id ?? teacher.id,
          teacher_name: data.teacher_name,
          age_group: data.age_group ?? "",
          description: data.description,
          status: data.status ?? "active",
          student_count: 0,
          created_at: now,
          updated_at: now,
        } as ClassRoom,
        ...prev,
      ]);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title={t("classes.title")}
        description={t("classes.subtitle")}
        actions={
          <Button onClick={openAdd} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" /> {t("classes.addBtn")}
          </Button>
        }
      />

      {classes.length === 0 ? (
        <EmptyState
          icon={School}
          title={t("classes.empty.title")}
          description={t("classes.empty.desc")}
          action={
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4" /> {t("classes.addBtn")}
            </Button>
          }
        />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {classes.map((c) => {
              const hasStudents = (c.student_count ?? 0) > 0;
              return (
                <Card key={c.id} className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-medium">{c.name}</span>
                        <ClassStatusBadge status={c.status} />
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {c.age_group || "—"} · {c.teacher_name ?? "—"}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">
                          {c.student_count ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEdit(c)}
                    >
                      {t("common.edit")}
                    </Button>
                    {c.status === "active" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => {
                          if (hasStudents) {
                            toast({
                              title: t("classes.toast.hasStudents"),
                              description: t("classes.toast.hasStudentsDesc"),
                              variant: "info",
                            });
                          }
                          deactivate(c);
                        }}
                      >
                        {t("common.deactivate")}
                      </Button>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Desktop table */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("classes.col.class")}</TableHead>
                  <TableHead>{t("classes.col.ageGroup")}</TableHead>
                  <TableHead>{t("classes.col.teacher")}</TableHead>
                  <TableHead>{t("classes.col.students")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead>{t("common.updated")}</TableHead>
                  <TableHead className="text-right">
                    {t("common.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((c) => {
                  const hasStudents = (c.student_count ?? 0) > 0;
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="font-medium">{c.name}</div>
                        {c.description ? (
                          <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {c.description}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.age_group || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {c.teacher_name ?? "—"}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {c.student_count ?? 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ClassStatusBadge status={c.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(c.updated_at, "short", locale)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(c)}
                          >
                            {t("common.edit")}
                          </Button>
                          {c.status === "active" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={() => {
                                if (hasStudents) {
                                  toast({
                                    title: t("classes.toast.hasStudents"),
                                    description: t(
                                      "classes.toast.hasStudentsDesc"
                                    ),
                                    variant: "info",
                                  });
                                }
                                deactivate(c);
                              }}
                            >
                              {t("common.deactivate")}
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      <ClassFormDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSave={onSave}
      />
    </div>
  );
}
