import * as React from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-background pb-4 sm:flex-row sm:items-center sm:justify-between sm:pb-5">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap gap-2 sm:flex-shrink-0">{actions}</div>
      ) : null}
    </div>
  );
}
