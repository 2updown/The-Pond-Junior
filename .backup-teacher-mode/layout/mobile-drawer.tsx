"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, X, ShieldCheck } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { NAV_ITEMS } from "./nav-items";
import { currentTeacher } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/utils";

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ open, onOpenChange }: MobileDrawerProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const teacher = currentTeacher;

  // Close on route change
  const initial = React.useRef(pathname);
  React.useEffect(() => {
    if (pathname !== initial.current) {
      onOpenChange(false);
      initial.current = pathname;
    }
  }, [pathname, onOpenChange]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 lg:hidden" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r bg-background shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left lg:hidden"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">
            {t("common.menu")}
          </DialogPrimitive.Title>
          <div className="flex h-16 items-center justify-between gap-2 border-b border-border px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">
                  {t("brand.name")}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {t("brand.mode")}
                </div>
              </div>
            </div>
            <DialogPrimitive.Close
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
              aria-label={t("common.close")}
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Avatar
              src={teacher.profile_image}
              alt={teacher.name}
              fallback={initials(teacher.name)}
              size={36}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{teacher.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {teacher.branch_name}
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(item.labelKey)}
                </Link>
              );
            })}

            {teacher.hasAdminPermission ? (
              <>
                <div className="my-2 h-px bg-border" />
                <Link
                  href="/teacher/admin-mode"
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {t("nav.adminMode")}
                </Link>
              </>
            ) : null}
          </nav>

          <div className="border-t border-border p-4">
            <Badge variant="info">{t("brand.mode")}</Badge>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
