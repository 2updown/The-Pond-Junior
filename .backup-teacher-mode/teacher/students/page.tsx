"use client";

import * as React from "react";
import { Plus, Search, UserRound, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/teacher/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StudentStatusBadge } from "@/components/teacher/status-badges";
import { StudentFormDialog } from "@/components/teacher/student-form-dialog";
import { StudentDetailDrawer } from "@/components/teacher/student-detail-drawer";
import { useI18n } from "@/lib/i18n";
import {
  currentTeacher,
  mockClasses,
  mockStudents,
} from "@/lib/mock-data";
import type { Student } from "@/types";
import { initials } from "@/lib/utils";

export default function StudentsPage() {
  const teacher = currentTeacher;
  const { t } = useI18n();
  const branchClasses = mockClasses.filter(
    (c) => c.branch_id === teacher.branch_id
  );

  const [students, setStudents] = React.useState<Student[]>(
    mockStudents.filter((s) => s.branch_id === teacher.branch_id)
  );
  const [search, setSearch] = React.useState("");
  const [classFilter, setClassFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Student | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [active, setActive] = React.useState<Student | undefined>(undefined);

  const filtered = students.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (classFilter !== "all" && s.class_id !== classFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  const openAdd = () => {
    setEditing(undefined);
    setFormOpen(true);
  };
  const openEdit = (s: Student) => {
    setEditing(s);
    setFormOpen(true);
    setDrawerOpen(false);
  };
  const openDetail = (s: Student) => {
    setActive(s);
    setDrawerOpen(true);
  };

  const genderLabel = (g: Student["gender"]) =>
    g === "female"
      ? t("students.gender.female")
      : g === "male"
      ? t("students.gender.male")
      : t("students.gender.other");

  const handleSave = (data: Partial<Student>) => {
    if (editing) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editing.id
            ? {
                ...s,
                ...data,
                parent: data.parent
                  ? { ...s.parent!, ...data.parent }
                  : s.parent,
                updated_at: new Date().toISOString(),
              }
            : s
        )
      );
    } else {
      const id = `student-${Date.now()}`;
      const now = new Date().toISOString();
      setStudents((prev) => [
        {
          id,
          branch_id: teacher.branch_id,
          class_id: data.class_id ?? branchClasses[0]?.id ?? "",
          name: data.name ?? "Untitled",
          birth_date: data.birth_date ?? "",
          gender: data.gender ?? "female",
          status: data.status ?? "active",
          parent_id: data.parent?.parent_id ?? `parent-${Date.now()}`,
          parent: data.parent,
          created_at: now,
          updated_at: now,
        } as Student,
        ...prev,
      ]);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title={t("students.title")}
        description={t("students.subtitle", { branch: teacher.branch_name })}
        actions={
          <Button onClick={openAdd} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" /> {t("students.addBtn")}
          </Button>
        }
      />

      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("students.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-1">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder={t("students.classFilter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.allClasses")}</SelectItem>
                {branchClasses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="sm:w-40">
                <SelectValue placeholder={t("students.statusFilter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.allStatuses")}</SelectItem>
                <SelectItem value="active">{t("status.active")}</SelectItem>
                <SelectItem value="inactive">{t("status.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title={t("students.empty.title")}
          description={t("students.empty.desc")}
          action={
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4" /> {t("students.addBtn")}
            </Button>
          }
        />
      ) : (
        <>
          {/* Mobile card list */}
          <div className="space-y-2 md:hidden">
            {filtered.map((s) => {
              const c = branchClasses.find((x) => x.id === s.class_id);
              return (
                <Card
                  key={s.id}
                  className="cursor-pointer p-3 transition active:bg-muted/40"
                  onClick={() => openDetail(s)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={s.profile_image}
                      alt={s.name}
                      fallback={initials(s.name)}
                      size={44}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{s.name}</span>
                        <StudentStatusBadge status={s.status} />
                      </div>
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">
                        {c?.name ?? "—"} · {genderLabel(s.gender)}
                      </div>
                      <div className="mt-1 truncate text-xs text-muted-foreground">
                        {s.parent?.parent_name} · {s.parent?.parent_phone}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Tablet/desktop table */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("students.col.student")}</TableHead>
                  <TableHead>{t("students.col.class")}</TableHead>
                  <TableHead>{t("students.col.parent")}</TableHead>
                  <TableHead>{t("students.col.contact")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead className="text-right">
                    {t("common.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => {
                  const c = branchClasses.find((x) => x.id === s.class_id);
                  return (
                    <TableRow
                      key={s.id}
                      className="cursor-pointer"
                      onClick={() => openDetail(s)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={s.profile_image}
                            alt={s.name}
                            fallback={initials(s.name)}
                          />
                          <div>
                            <div className="font-medium">{s.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {genderLabel(s.gender)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{c?.name ?? "—"}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {s.parent?.parent_name ?? "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {s.parent?.relationship
                            ? t(
                                `students.relationship.${s.parent.relationship}`
                              )
                            : ""}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {s.parent?.parent_phone ?? "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {s.parent?.parent_email ?? ""}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StudentStatusBadge status={s.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(s);
                          }}
                        >
                          {t("common.edit")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      <StudentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        classes={branchClasses}
        initial={editing}
        onSave={handleSave}
      />

      <StudentDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        student={active}
        classRoom={branchClasses.find((c) => c.id === active?.class_id)}
        onEdit={() => active && openEdit(active)}
      />
    </div>
  );
}
