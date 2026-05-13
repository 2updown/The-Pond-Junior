import { LandingShell } from "@/components/pond/landing/landing-shell";
import { PageHero } from "@/components/pond/landing/page-hero";
import { Gallery } from "@/components/pond/landing/gallery";

export default function GalleryPage() {
  return (
    <LandingShell>
      <PageHero
        eyebrow="Gallery"
        title="갤러리"
        description="아이들의 즐거운 수업 모습과 다양한 활동을 확인해보세요."
      />
      <Gallery />
    </LandingShell>
  );
}
