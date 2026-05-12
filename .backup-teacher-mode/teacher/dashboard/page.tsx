"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  NotebookPen,
  ImageIcon,
  MessageCircle,
  Megaphone,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/teacher/page-header";
import { StatCard } from "@/components/teacher/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NoticeStatusBadge } from "@/components/teacher/status-badges";
import { formatDate } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import {
  currentTeacher,
  mockAttendance,
  mockConversations,
  mockDailyNotes,
  mockNotices,
  mockPhotos,
  mockStudents,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const teacher = currentTeacher;
  const { t, locale } = useI18n();
  const today = new Date().toISOString().slice(0, 10);

  const myStudents = mockStudents.filter(
    (s) => s.branch_id === teacher.branch_id && s.status === "active"
  );

  const todayAttendance = mockAttendance.filter((a) => a.date === today);
  const attendanceTotal = myStudents.filter(
    (s) => s.class_id === "class-001"
  ).length;
  const attendanceMarked = todayAttendance.length;

  const todayNotes = mockDailyNotes.filter((n) => n.date === today);
  const notesPublished = todayNotes.filter(
    (n) => n.visibility_status === "published"
  ).length;
  const draftCount = todayNotes.length - notesPublished;

  const todayPhotos = mockPhotos.filter((p) => p.date === today);

  const unreadMessages = mockConversations.reduce(
    (sum, c) => sum + c.unread_count,
    0
  );

  const recentNotices = [...mockNotices]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 4);

  const displayName = teacher.name.replace("Ms. ", "").replace("Mr. ", "");

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title={t("dashboard.greeting", { name: displayName })}
        description={t("dashboard.subtitle", {
          date: formatDate(today, "long", locale),
        })}
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("dashboard.attendance")}
          value={`${attendanceMarked}/${attendanceTotal}`}
          helper={
            attendanceMarked === attendanceTotal && attendanceTotal > 0
              ? t("dashboard.attendanceAllMarked")
              : t("dashboard.attendanceRemaining", {
                  count: attendanceTotal - attendanceMarked,
                })
          }
          icon={ClipboardCheck}
          tone={
            attendanceMarked === attendanceTotal ? "success" : "warning"
          }
        />
        <StatCard
          label={t("dashboard.dailyNotes")}
          value={`${notesPublished}/${attendanceTotal}`}
          helper={
            draftCount === 1
              ? t("dashboard.draftPending", { count: draftCount })
              : t("dashboard.draftsPending", { count: draftCount })
          }
          icon={NotebookPen}
          tone="info"
        />
        <StatCard
          label={t("dashboard.photos")}
          value={todayPhotos.length}
          helper={t("dashboard.photosShared", {
            count: todayPhotos.filter((p) => p.visibility_status === "shared")
              .length,
          })}
          icon={ImageIcon}
          tone="default"
        />
        <StatCard
          label={t("dashboard.unread")}
          value={unreadMessages}
          helper={
            unreadMessages > 0
              ? t("dashboard.unreadCta")
              : t("dashboard.unreadAllClear")
          }
          icon={MessageCircle}
          tone={unreadMessages > 0 ? "warning" : "success"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("dashboard.quickActions")}</CardTitle>
            <CardDescription>{t("dashboard.quickActionsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <QuickAction
              href="/teacher/attendance"
              icon={ClipboardCheck}
              title={t("dashboard.quick.attendance")}
              description={t("dashboard.quick.attendanceDesc")}
            />
            <QuickAction
              href="/teacher/daily-notes"
              icon={NotebookPen}
              title={t("dashboard.quick.note")}
              description={t("dashboard.quick.noteDesc")}
            />
            <QuickAction
              href="/teacher/photos"
              icon={ImageIcon}
              title={t("dashboard.quick.photos")}
              description={t("dashboard.quick.photosDesc")}
            />
            <QuickAction
              href="/teacher/notices"
              icon={Megaphone}
              title={t("dashboard.quick.notice")}
              description={t("dashboard.quick.noticeDesc")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentNotices")}</CardTitle>
            <CardDescription>
              {t("dashboard.recentNoticesDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {recentNotices.map((n) => (
              <Link
                key={n.id}
                href="/teacher/notices"
                className="flex items-start justify-between gap-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/30 active:bg-muted/40"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {n.title}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <NoticeStatusBadge status={n.status} />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(n.updated_at, "short", locale)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href="/teacher/notices">
                {t("dashboard.viewAllNotices")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-md border border-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5 active:bg-primary/10"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
