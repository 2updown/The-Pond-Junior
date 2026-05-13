import { LandingShell } from "@/components/pond/landing/landing-shell";
import { PageHero } from "@/components/pond/landing/page-hero";
import { NoticeBoard } from "@/components/pond/landing/notice-board";
import { ScheduleStrip } from "@/components/pond/landing/schedule-strip";

export default function NoticesPage() {
  return (
    <LandingShell>
      <PageHero
        eyebrow="Notices"
        title="공지사항"
        description="학원의 최신 소식과 중요한 안내를 한곳에서 확인하세요."
      />
      <NoticeBoard />
      <ScheduleStrip />
    </LandingShell>
  );
}
