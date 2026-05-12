"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { ClassRoom, Student } from "@/types";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes: ClassRoom[];
  initial?: Student;
  onSave: (data: Partial<Student>) => void;
}

export function StudentFormDialog({
  open,
  onOpenChange,
  classes,
  initial,
  onSave,
}: Props) {
  const { toast } = useToast();
  const { t } = useI18n();
  const isEdit = Boolean(initial);

  const [name, setName] = React.useState(initial?.name ?? "");
  const [classId, setClassId] = React.useState(
    initial?.class_id ?? classes[0]?.id ?? ""
  );
  const [birthDate, setBirthDate] = React.useState(initial?.birth_date ?? "");
  const [gender, setGender] = React.useState<Student["gender"]>(
    initial?.gender ?? "female"
  );
  const [status, setStatus] = React.useState<Student["status"]>(
    initial?.status ?? "active"
  );
  const [parentName, setParentName] = React.useState(
    initial?.parent?.parent_name ?? ""
  );
  const [parentPhone, setParentPhone] = React.useState(
    initial?.parent?.parent_phone ?? ""
  );
  const [parentEmail, setParentEmail] = React.useState(
    initial?.parent?.parent_email ?? ""
  );
  const [relationship, setRelationship] = React.useState<
    NonNullable<Student["parent"]>["relationship"]
  >(initial?.parent?.relationship ?? "mother");

  React.useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setClassId(initial?.class_id ?? classes[0]?.id ?? "");
    setBirthDate(initial?.birth_date ?? "");
    setGender(initial?.gender ?? "female");
    setStatus(initial?.status ?? "active");
    setParentName(initial?.parent?.parent_name ?? "");
    setParentPhone(initial?.parent?.parent_phone ?? "");
    setParentEmail(initial?.parent?.parent_email ?? "");
    setRelationship(initial?.parent?.relationship ?? "mother");
  }, [open, initial, classes]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !classId) {
      toast({
        title: t("students.form.missing"),
        description: t("students.form.missingDesc"),
        variant: "error",
      });
      return;
    }
    onSave({
      name: name.trim(),
      class_id: classId,
      birth_date: birthDate,
      gender,
      status,
      parent: {
        parent_id: initial?.parent?.parent_id ?? `parent-${Date.now()}`,
        parent_name: parentName,
        parent_phone: parentPhone,
        parent_email: parentEmail,
        relationship,
      },
    });
    toast({
      title: isEdit ? t("students.toast.updated") : t("students.toast.added"),
      description: isEdit
        ? t("students.toast.updatedDesc", { name })
        : t("students.toast.addedDesc", { name }),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? t("students.form.editTitle") : t("students.form.addTitle")}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? t("students.form.editDesc")
                : t("students.form.addDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("students.form.fullName")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("students.form.fullNamePh")}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>{t("students.col.class")}</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes
                      .filter((c) => c.status === "active")
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birth_date">
                  {t("students.form.birthDate")}
                </Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>{t("students.form.gender")}</Label>
                <Select
                  value={gender}
                  onValueChange={(v) => setGender(v as Student["gender"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">
                      {t("students.gender.female")}
                    </SelectItem>
                    <SelectItem value="male">
                      {t("students.gender.male")}
                    </SelectItem>
                    <SelectItem value="other">
                      {t("students.gender.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{t("common.status")}</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as Student["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("status.active")}</SelectItem>
                    <SelectItem value="inactive">
                      {t("status.inactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />
            <div className="text-sm font-medium">
              {t("students.form.parentSection")}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="parent_name">
                  {t("students.form.parentName")}
                </Label>
                <Input
                  id="parent_name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t("students.form.relationship")}</Label>
                <Select
                  value={relationship}
                  onValueChange={(v) =>
                    setRelationship(
                      v as NonNullable<Student["parent"]>["relationship"]
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mother">
                      {t("students.relationship.mother")}
                    </SelectItem>
                    <SelectItem value="father">
                      {t("students.relationship.father")}
                    </SelectItem>
                    <SelectItem value="guardian">
                      {t("students.relationship.guardian")}
                    </SelectItem>
                    <SelectItem value="other">
                      {t("students.relationship.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="parent_phone">
                  {t("students.form.parentPhone")}
                </Label>
                <Input
                  id="parent_phone"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent_email">
                  {t("students.form.parentEmail")}
                </Label>
                <Input
                  id="parent_email"
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit">
              {isEdit ? t("common.saveChanges") : t("students.addBtn")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
