"use client";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import type {
  AttendanceStatus,
  ClassStatus,
  NoteVisibility,
  NoticeStatus,
  PhotoVisibility,
  StudentStatus,
} from "@/types";

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const { t } = useI18n();
  return (
    <Badge variant={status === "active" ? "success" : "muted"}>
      {status === "active" ? t("status.active") : t("status.inactive")}
    </Badge>
  );
}

export function ClassStatusBadge({ status }: { status: ClassStatus }) {
  const { t } = useI18n();
  return (
    <Badge variant={status === "active" ? "success" : "muted"}>
      {status === "active" ? t("status.active") : t("status.inactive")}
    </Badge>
  );
}

export function AttendanceStatusBadge({
  status,
}: {
  status: AttendanceStatus;
}) {
  const { t } = useI18n();
  const map: Record<AttendanceStatus, { key: string; variant: any }> = {
    present: { key: "attendance.status.present", variant: "success" },
    absent: { key: "attendance.status.absent", variant: "destructive" },
    late: { key: "attendance.status.late", variant: "warning" },
    early_leave: { key: "attendance.status.early_leave", variant: "info" },
    sick: { key: "attendance.status.sick", variant: "rose" },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{t(cfg.key)}</Badge>;
}

export function NoteVisibilityBadge({ status }: { status: NoteVisibility }) {
  const { t } = useI18n();
  const map: Record<NoteVisibility, { key: string; variant: any }> = {
    draft: { key: "common.draft", variant: "warning" },
    published: { key: "status.published", variant: "success" },
    hidden: { key: "status.hidden", variant: "muted" },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{t(cfg.key)}</Badge>;
}

export function PhotoVisibilityBadge({ status }: { status: PhotoVisibility }) {
  const { t } = useI18n();
  const map: Record<PhotoVisibility, { key: string; variant: any }> = {
    private: { key: "status.private", variant: "muted" },
    shared: { key: "status.shared", variant: "success" },
    archived: { key: "status.archived", variant: "secondary" },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{t(cfg.key)}</Badge>;
}

export function NoticeStatusBadge({ status }: { status: NoticeStatus }) {
  const { t } = useI18n();
  const map: Record<NoticeStatus, { key: string; variant: any }> = {
    draft: { key: "common.draft", variant: "warning" },
    published: { key: "status.published", variant: "success" },
    scheduled: { key: "status.scheduled", variant: "info" },
    archived: { key: "status.archived", variant: "muted" },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{t(cfg.key)}</Badge>;
}
