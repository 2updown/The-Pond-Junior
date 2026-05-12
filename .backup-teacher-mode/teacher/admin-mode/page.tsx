"use client";

import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/teacher/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { useI18n } from "@/lib/i18n";

export default function AdminModePage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <PageHeader title={t("admin.title")} description={t("admin.subtitle")} />
      <EmptyState
        icon={ShieldCheck}
        title={t("admin.empty.title")}
        description={t("admin.empty.desc")}
      />
    </div>
  );
}
