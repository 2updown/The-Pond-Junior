"use client";

import { Mail, Phone, User2, CalendarDays, School } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StudentStatusBadge } from "./status-badges";
import { Button } from "@/components/ui/button";
import { initials, formatDate } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { ClassRoom, Student } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student;
  classRoom?: ClassRoom;
  onEdit?: () => void;
}

export function StudentDetailDrawer({
  open,
  onOpenChange,
  student,
  classRoom,
  onEdit,
}: Props) {
  const { t, locale } = useI18n();
  if (!student) return null;

  const genderLabel =
    student.gender === "female"
      ? t("students.gender.female")
      : student.gender === "male"
      ? t("students.gender.male")
      : t("students.gender.other");

  const relLabel = student.parent?.relationship
    ? t(`students.relationship.${student.parent.relationship}`)
    : t("students.form.parentSection");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent side="right" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("students.detail.title")}</DialogTitle>
          <DialogDescription>{t("students.detail.desc")}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex items-center gap-4">
          <Avatar
            src={student.profile_image}
            alt={student.name}
            fallback={initials(student.name)}
            size={56}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="truncate text-base font-semibold">
                {student.name}
              </div>
              <StudentStatusBadge status={student.status} />
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {classRoom?.name ?? "—"} · {classRoom?.age_group ?? ""}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <dl className="space-y-3 text-sm">
          <Field icon={User2} label={t("students.form.gender")}>
            {genderLabel}
          </Field>
          <Field icon={CalendarDays} label={t("students.form.birthDate")}>
            {student.birth_date
              ? formatDate(student.birth_date, "long", locale)
              : "—"}
          </Field>
          <Field icon={School} label={t("students.col.class")}>
            {classRoom?.name ?? "—"}
          </Field>
        </dl>

        <Separator className="my-4" />

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("students.form.parentSection")}
          </div>
          <div className="mt-3 space-y-3 text-sm">
            <Field icon={User2} label={relLabel}>
              {student.parent?.parent_name ?? "—"}
            </Field>
            <Field icon={Phone} label={t("students.form.parentPhone")}>
              {student.parent?.parent_phone ?? "—"}
            </Field>
            <Field icon={Mail} label={t("students.form.parentEmail")}>
              {student.parent?.parent_email ?? "—"}
            </Field>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mt-auto flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.close")}
          </Button>
          {onEdit ? (
            <Button onClick={onEdit}>{t("students.detail.editBtn")}</Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 truncate text-sm text-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}
