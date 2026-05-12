import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string,
  fmt: "short" | "long" | "time" = "short",
  locale: string = "en-US"
) {
  const d = typeof date === "string" ? new Date(date) : date;
  const loc = locale === "ko" ? "ko-KR" : "en-US";
  if (fmt === "time") {
    return d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" });
  }
  if (fmt === "long") {
    return d.toLocaleDateString(loc, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return d.toLocaleDateString(loc, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
