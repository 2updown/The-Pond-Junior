import * as React from "react";
import { MessageSquare } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-16 text-center">
      <div className="empty-illustration mb-6">
        {icon || <MessageSquare className="h-9 w-9 text-brand-500" strokeWidth={2} />}
      </div>
      <h3 className="text-[17px] font-bold tracking-tight text-brand-500">{title}</h3>
      {description && (
        <p className="mt-2 text-[13px] leading-[1.55] text-ink-secondary">{description}</p>
      )}
    </div>
  );
}
