import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this view. Try again in a moment.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-6 py-12 text-center text-rose-900">
      <AlertTriangle className="h-6 w-6 text-rose-500" />
      <div className="mt-2 text-base font-semibold">{title}</div>
      <div className="mt-1 max-w-sm text-sm text-rose-700/90">{description}</div>
      {onRetry ? (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onRetry}
        >
          Retry
        </Button>
      ) : null}
    </div>
  );
}
