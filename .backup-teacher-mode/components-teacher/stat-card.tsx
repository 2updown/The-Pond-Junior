import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  helper?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "default" | "success" | "warning" | "info";
}) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warning"
      ? "bg-amber-50 text-amber-700"
      : tone === "info"
      ? "bg-sky-50 text-sky-700"
      : "bg-primary/10 text-primary";

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        {Icon ? (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              toneClass
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 truncate text-2xl font-semibold">{value}</div>
          {helper ? (
            <div className="mt-0.5 text-xs text-muted-foreground">
              {helper}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
