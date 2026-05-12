"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, Bell, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils";
import { currentTeacher } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";
import { MobileDrawer } from "./mobile-drawer";

export function Header() {
  const teacher = currentTeacher;
  const { t } = useI18n();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:h-16 sm:px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("common.menu")}
            className="h-9 w-9 lg:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-sm">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate font-medium text-foreground">
              {teacher.branch_name}
            </span>
          </div>
          <Badge variant="info" className="hidden lg:inline-flex">
            {t("brand.mode")}
          </Badge>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          {teacher.hasAdminPermission ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link href="/teacher/admin-mode">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden md:inline">{t("nav.adminMode")}</span>
              </Link>
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("common.notifications")}
            className="hidden h-9 w-9 sm:inline-flex"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 pl-1">
            <Avatar
              src={teacher.profile_image}
              alt={teacher.name}
              fallback={initials(teacher.name)}
              size={32}
            />
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium leading-none">
                {teacher.name}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {teacher.email}
              </div>
            </div>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
