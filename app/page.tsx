import Episode from "@/components/EpisodeList";
import HeroSection from "@/components/HeroSection";

export default async function Home() {
  return (
    <div className="p-5">
      <HeroSection />
      <Episode />
    </div>
  );
}
