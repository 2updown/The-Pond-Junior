"use client";

import * as React from "react";
import {
  ImagePlus,
  Upload,
  X,
  ImageIcon as ImageEmpty,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/teacher/page-header";
import { Button } from "@/components/ui/button";
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
import { EmptyState } from "@/components/ui/empty-state";
import { PhotoVisibilityBadge } from "@/components/teacher/status-badges";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";
import {
  currentTeacher,
  mockClasses,
  mockPhotos,
  mockStudents,
} from "@/lib/mock-data";
import type { Photo, PhotoVisibility } from "@/types";
import { cn, formatDate, todayISO } from "@/lib/utils";

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1525324226010-1ce7eaf60d09?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1543269664-7eef42226a21?auto=format&fit=crop&w=800&q=70",
];

export default function PhotosPage() {
  const teacher = currentTeacher;
  const { toast } = useToast();
  const { t, locale } = useI18n();

  const branchClasses = mockClasses.filter(
    (c) => c.branch_id === teacher.branch_id && c.status === "active"
  );

  const [photos, setPhotos] = React.useState<Photo[]>(
    mockPhotos.filter((p) => p.branch_id === teacher.branch_id)
  );
  const [classFilter, setClassFilter] = React.useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = React.useState<string>("all");

  const [pending, setPending] = React.useState<string[]>([]);
  const [uploadClassId, setUploadClassId] = React.useState(
    branchClasses[0]?.id ?? ""
  );
  const [studentTags, setStudentTags] = React.useState<string[]>([]);
  const [caption, setCaption] = React.useState("");
  const [visibility, setVisibility] =
    React.useState<PhotoVisibility>("shared");
  const [dragOver, setDragOver] = React.useState(false);

  const classStudents = mockStudents.filter(
    (s) =>
      s.branch_id === teacher.branch_id &&
      s.class_id === uploadClassId &&
      s.status === "active"
  );

  const filtered = photos.filter((p) => {
    if (classFilter !== "all" && p.class_id !== classFilter) return false;
    if (visibilityFilter !== "all" && p.visibility_status !== visibilityFilter)
      return false;
    return true;
  });

  const handleAddSample = () => {
    const next = SAMPLE_IMAGES[pending.length % SAMPLE_IMAGES.length];
    setPending((p) => [...p, next]);
  };

  const removePending = (idx: number) =>
    setPending((p) => p.filter((_, i) => i !== idx));

  const toggleTag = (id: string) => {
    setStudentTags((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  const upload = () => {
    if (pending.length === 0 || !uploadClassId) {
      toast({
        title: t("photos.toast.empty"),
        description: t("photos.toast.emptyDesc"),
        variant: "error",
      });
      return;
    }
    const now = new Date().toISOString();
    const newPhotos: Photo[] = pending.map((url, idx) => ({
      id: `photo-${Date.now()}-${idx}`,
      branch_id: teacher.branch_id,
      class_id: uploadClassId,
      student_ids: [...studentTags],
      uploaded_by: teacher.id,
      date: todayISO(),
      image_url: url,
      caption: caption || undefined,
      visibility_status: visibility,
      created_at: now,
      updated_at: now,
    }));
    setPhotos((p) => [...newPhotos, ...p]);
    setPending([]);
    setStudentTags([]);
    setCaption("");
    toast({
      title:
        newPhotos.length === 1
          ? t("photos.toast.addedOne", { count: newPhotos.length })
          : t("photos.toast.added", { count: newPhotos.length }),
      description:
        visibility === "shared"
          ? t("photos.toast.shared")
          : visibility === "private"
          ? t("photos.toast.private")
          : t("photos.toast.archivedDesc"),
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title={t("photos.title")}
        description={t("photos.subtitle")}
      />

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>{t("photos.upload")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleAddSample();
            }}
            onClick={handleAddSample}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-6 py-8 text-center transition-colors sm:py-10",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/20 hover:bg-muted/40 active:bg-muted/40"
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium">{t("photos.dropArea")}</div>
            <div className="text-xs text-muted-foreground">
              {t("photos.dropHint")}
            </div>
          </div>

          {pending.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {pending.map((url, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-square overflow-hidden rounded-md border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removePending(idx)}
                    className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label>{t("photos.class")}</Label>
              <Select value={uploadClassId} onValueChange={setUploadClassId}>
                <SelectTrigger>
                  <SelectValue />
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
            <div className="grid gap-2">
              <Label>{t("photos.visibility")}</Label>
              <Select
                value={visibility}
                onValueChange={(v) => setVisibility(v as PhotoVisibility)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shared">
                    {t("photos.visibility.shared")}
                  </SelectItem>
                  <SelectItem value="private">
                    {t("photos.visibility.private")}
                  </SelectItem>
                  <SelectItem value="archived">
                    {t("photos.visibility.archived")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>
              {t("photos.tag")}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                {t("photos.tagHint")}
              </span>
            </Label>
            <div className="flex flex-wrap gap-2 rounded-md border border-border p-3">
              {classStudents.length === 0 ? (
                <div className="text-xs text-muted-foreground">
                  {t("photos.tagEmpty")}
                </div>
              ) : (
                classStudents.map((s) => {
                  const on = studentTags.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleTag(s.id)}
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

          <div className="grid gap-2">
            <Label htmlFor="caption">{t("photos.caption")}</Label>
            <Textarea
              id="caption"
              rows={2}
              placeholder={t("photos.captionPh")}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={upload} className="w-full sm:w-auto">
              <Upload className="h-4 w-4" />
              {t("photos.uploadBtn")}
              {pending.length > 0 ? ` (${pending.length})` : ""}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="text-sm font-medium">{t("photos.album")}</div>
          <div className="grid grid-cols-2 gap-2 sm:ml-auto sm:flex sm:flex-wrap">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder={t("photos.class")} />
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
            <Select
              value={visibilityFilter}
              onValueChange={setVisibilityFilter}
            >
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder={t("photos.visibility")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("common.allVisibilities")}
                </SelectItem>
                <SelectItem value="shared">{t("status.shared")}</SelectItem>
                <SelectItem value="private">{t("status.private")}</SelectItem>
                <SelectItem value="archived">{t("status.archived")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ImageEmpty}
          title={t("photos.empty.title")}
          description={t("photos.empty.desc")}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {filtered.map((p) => {
            const cls = branchClasses.find((c) => c.id === p.class_id);
            const tagged = mockStudents.filter((s) =>
              p.student_ids.includes(s.id)
            );
            return (
              <Card key={p.id} className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image_url}
                    alt={p.caption || "Class photo"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2 p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground">
                      {formatDate(p.date, "short", locale)} ·{" "}
                      {cls?.name ?? "—"}
                    </div>
                    <PhotoVisibilityBadge status={p.visibility_status} />
                  </div>
                  {p.caption ? (
                    <div className="text-sm">{p.caption}</div>
                  ) : null}
                  {tagged.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      {tagged.map((s) => (
                        <Badge key={s.id} variant="secondary">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      {t("photos.classWide")}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
