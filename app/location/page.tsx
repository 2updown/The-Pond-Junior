import { LandingShell } from "@/components/pond/landing/landing-shell";
import { PageHero } from "@/components/pond/landing/page-hero";
import { Location } from "@/components/pond/landing/location";

export default function LocationPage() {
  return (
    <LandingShell>
      <PageHero
        eyebrow="Location"
        title="오시는 길"
        description="레티튜초등학교 위치 및 운영 시간 안내입니다."
      />
      <Location />
    </LandingShell>
  );
}
