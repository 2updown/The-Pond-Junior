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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClassRoom } from "@/types";
import { teachersById } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ClassRoom;
  onSave: (data: Partial<ClassRoom>) => void;
}

export function ClassFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: Props) {
  const { toast } = useToast();
  const { t } = useI18n();
  const isEdit = Boolean(initial);

  const [name, setName] = React.useState(initial?.name ?? "");
  const [ageGroup, setAgeGroup] = React.useState(initial?.age_group ?? "");
  const [description, setDescription] = React.useState(
    initial?.description ?? ""
  );
  const [teacherId, setTeacherId] = React.useState(
    initial?.teacher_id ?? "teacher-001"
  );
  const [status, setStatus] = React.useState<ClassRoom["status"]>(
    initial?.status ?? "active"
  );

  React.useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setAgeGroup(initial?.age_group ?? "");
    setDescription(initial?.description ?? "");
    setTeacherId(initial?.teacher_id ?? "teacher-001");
    setStatus(initial?.status ?? "active");
  }, [open, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: t("classes.form.nameRequired"),
        variant: "error",
      });
      return;
    }
    onSave({
      name: name.trim(),
      age_group: ageGroup,
      description,
      teacher_id: teacherId,
      teacher_name: teachersById[teacherId]?.name,
      status,
    });
    toast({
      title: isEdit ? t("classes.toast.updated") : t("classes.toast.created"),
      description: isEdit
        ? t("classes.toast.updatedDesc", { name })
        : t("classes.toast.createdDesc", { name }),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? t("classes.form.editTitle") : t("classes.form.addTitle")}
            </DialogTitle>
            <DialogDescription>{t("classes.form.desc")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="class_name">{t("classes.form.name")}</Label>
              <Input
                id="class_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("classes.form.namePh")}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="age_group">{t("classes.form.ageGroup")}</Label>
                <Input
                  id="age_group"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  placeholder={t("classes.form.ageGroupPh")}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t("classes.form.teacher")}</Label>
                <Select value={teacherId} onValueChange={setTeacherId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(teachersById).map((tch) => (
                      <SelectItem key={tch.id} value={tch.id}>
                        {tch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="class_desc">{t("classes.form.description")}</Label>
              <Textarea
                id="class_desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>{t("common.status")}</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as ClassRoom["status"])}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit">
              {isEdit ? t("common.saveChanges") : t("classes.addBtn")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
