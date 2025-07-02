import Episode from "@/components/EpisodeList";
import HeroSection from "@/components/HeroSection";
import { fetchEpisodes } from "@/lib/api";

interface RawEpisode {
  id: string;
  title_original: string;
  description_original: string;
  thumbnail: string;
  audio: string;
  podcast: {
    publisher_original: string;
  };
}

export default async function Home() {
  const episodes = await fetchEpisodes();

  const modifiedResponse = episodes.results.map((item: RawEpisode) => ({
    id: item.id,
    title: item.title_original,
    description: item.description_original,
    thumbnail: item.thumbnail,
    audio: item.audio,
    publisher: item.podcast.publisher_original,
  }));

  return (
    <div className="p-5">
      <HeroSection />
      <Episode episodes={modifiedResponse} />
    </div>
  );
}
