import { HeroSection } from "@/components/home/HeroSection";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { RoadmapPreview } from "@/components/home/RoadmapPreview";
import { FeaturedResources } from "@/components/home/FeaturedResources";
import { UpdatesTimeline } from "@/components/home/UpdatesTimeline";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero with decode moment & quiet code panel */}
      <HeroSection />

      {/* 2. Latest from YouTube (3 video cards) */}
      <VideoShowcase />

      {/* 3. Start with a roadmap (3 roadmap cards) */}
      <RoadmapPreview />

      {/* 4. New resources (filterable strip, 6 cards) */}
      <FeaturedResources />

      {/* 5. Updates timeline (last 5 posts) */}
      <UpdatesTimeline />

      {/* 6. Get updates: email field + Subscribe */}
      <NewsletterBanner />
    </div>
  );
}
