"use client";

import * as React from "react";
import { Save, ClipboardCheck, Pencil } from "lucide-react";
import { PageHeader } from "@/components/teacher/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { AttendanceStatusBadge } from "@/components/teacher/status-badges";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";
import {
  currentTeacher,
  mockAttendance,
  mockClasses,
  mockStudents,
} from "@/lib/mock-data";
import type { AttendanceStatus, Student } from "@/types";
import { initials, todayISO } from "@/lib/utils";

interface RowState {
  status: AttendanceStatus;
  check_in_time: string;
  check_out_time: string;
  memo: string;
  dirty: boolean;
}

export default function AttendancePage() {
  const teacher = currentTeacher;
  const { toast } = useToast();
  const { t } = useI18n();

  const STATUS_OPTIONS: { value: AttendanceStatus; key: string }[] = [
    { value: "present", key: "attendance.status.present" },
    { value: "late", key: "attendance.status.late" },
    { value: "early_leave", key: "attendance.status.early_leave" },
    { value: "sick", key: "attendance.status.sick" },
    { value: "absent", key: "attendance.status.absent" },
  ];

  const branchClasses = mockClasses.filter(
    (c) => c.branch_id === teacher.branch_id && c.status === "active"
  );

  const [date, setDate] = React.useState(todayISO());
  const [classId, setClassId] = React.useState(branchClasses[0]?.id ?? "");
  const [saving, setSaving] = React.useState(false);

  const classStudents: Student[] = mockStudents.filter(
    (s) =>
      s.branch_id === teacher.branch_id &&
      s.class_id === classId &&
      s.status === "active"
  );

  const buildInitial = React.useCallback((): Record<string, RowState> => {
    const map: Record<string, RowState> = {};
    classStudents.forEach((s) => {
      const existing = mockAttendance.find(
        (a) => a.student_id === s.id && a.date === date
      );
      map[s.id] = {
        status: existing?.status ?? "present",
        check_in_time: existing?.check_in_time ?? "",
        check_out_time: existing?.check_out_time ?? "",
        memo: existing?.memo ?? "",
        dirty: false,
      };
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, date]);

  const [rows, setRows] = React.useState<Record<string, RowState>>(
    buildInitial()
  );

  React.useEffect(() => {
    setRows(buildInitial());
  }, [buildInitial]);

  const dirtyCount = Object.values(rows).filter((r) => r.dirty).length;

  const update = (id: string, patch: Partial<RowState>) => {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch, dirty: true },
    }));
  };

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const changed = dirtyCount;
      setRows((prev) => {
        const next: Record<string, RowState> = {};
        Object.entries(prev).forEach(([id, r]) => {
          next[id] = { ...r, dirty: false };
        });
        return next;
      });
      toast({
        title: t("attendance.toast.saved"),
        description: t("attendance.toast.savedDesc", {
          count: changed,
          date,
        }),
      });
    }, 600);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title={t("attendance.title")}
        description={t("attendance.subtitle")}
        actions={
          <Button
            onClick={save}
            disabled={dirtyCount === 0 || saving}
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4" />
            {saving
              ? t("attendance.savingBtn")
              : `${t("attendance.saveBtn")}${
                  dirtyCount ? ` (${dirtyCount})` : ""
                }`}
          </Button>
        }
      />

      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-1 sm:gap-3">
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
          {dirtyCount > 0 ? (
            <Badge variant="warning" className="self-start sm:ml-auto">
              <Pencil className="mr-1 h-3 w-3" />
              {dirtyCount === 1
                ? t("attendance.unsavedOne", { count: dirtyCount })
                : t("attendance.unsaved", { count: dirtyCount })}
            </Badge>
          ) : null}
        </div>
      </Card>

      {classStudents.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title={t("attendance.empty.title")}
          description={t("attendance.empty.desc")}
        />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {classStudents.map((s) => {
              const row = rows[s.id];
              if (!row) return null;
              return (
                <Card
                  key={s.id}
                  className={`p-3 ${row.dirty ? "ring-2 ring-amber-200" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={s.profile_image}
                      alt={s.name}
                      fallback={initials(s.name)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{s.name}</span>
                        <AttendanceStatusBadge status={row.status} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    <Select
                      value={row.status}
                      onValueChange={(v) =>
                        update(s.id, { status: v as AttendanceStatus })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {t(o.key)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="time"
                        value={row.check_in_time}
                        onChange={(e) =>
                          update(s.id, { check_in_time: e.target.value })
                        }
                        disabled={row.status === "absent"}
                        placeholder={t("attendance.col.checkIn")}
                      />
                      <Input
                        type="time"
                        value={row.check_out_time}
                        onChange={(e) =>
                          update(s.id, { check_out_time: e.target.value })
                        }
                        disabled={row.status === "absent"}
                        placeholder={t("attendance.col.checkOut")}
                      />
                    </div>
                    <Input
                      value={row.memo}
                      placeholder={t("attendance.memoPh")}
                      onChange={(e) =>
                        update(s.id, { memo: e.target.value })
                      }
                    />
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
                  <TableHead>{t("attendance.col.student")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead>{t("attendance.col.checkIn")}</TableHead>
                  <TableHead>{t("attendance.col.checkOut")}</TableHead>
                  <TableHead>{t("attendance.col.memo")}</TableHead>
                  <TableHead>{t("attendance.col.current")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.map((s) => {
                  const row = rows[s.id];
                  if (!row) return null;
                  return (
                    <TableRow
                      key={s.id}
                      className={row.dirty ? "bg-amber-50/50" : undefined}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={s.profile_image}
                            alt={s.name}
                            fallback={initials(s.name)}
                          />
                          <div className="font-medium">{s.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[160px]">
                        <Select
                          value={row.status}
                          onValueChange={(v) =>
                            update(s.id, {
                              status: v as AttendanceStatus,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {t(o.key)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="min-w-[110px]">
                        <Input
                          type="time"
                          value={row.check_in_time}
                          onChange={(e) =>
                            update(s.id, { check_in_time: e.target.value })
                          }
                          disabled={row.status === "absent"}
                        />
                      </TableCell>
                      <TableCell className="min-w-[110px]">
                        <Input
                          type="time"
                          value={row.check_out_time}
                          onChange={(e) =>
                            update(s.id, { check_out_time: e.target.value })
                          }
                          disabled={row.status === "absent"}
                        />
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <Input
                          value={row.memo}
                          placeholder={t("attendance.memoPh")}
                          onChange={(e) =>
                            update(s.id, { memo: e.target.value })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <AttendanceStatusBadge status={row.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}
