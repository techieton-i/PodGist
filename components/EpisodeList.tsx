import { formatTime, removeHtml } from "@/lib/utils";
import React from "react";
import { fetchEpisodes } from "@/lib/api";
import EpisodeItem from "./EpisodeItem";

interface RawEpisode {
  id: string;
  title_original: string;
  description_original: string;
  thumbnail: string;
  audio: string;
  audio_length_sec: number;
  podcast: {
    publisher_original: string;
  };
}

const EpisodeList: React.FC = async () => {
  const episodes = await fetchEpisodes();

  if (!episodes) {
    return (
      <div className="max-w-7xl mx-auto">
        <h2 className="font-semibold text-3xl text-gray-900 dark:text-gray-100 max-w-7xl mx-auto px-4 border-b-4 border-gray-500 pb-2 mb-6 rounded">
          Podcast Episodes
        </h2>
        <div className="p-6 text-center text-red-600">
          Failed to load episodes. Please try again later.
        </div>
      </div>
    );
  }

  const modifiedResponse = episodes.results.map((item: RawEpisode) => ({
    id: item.id,
    title: item.title_original,
    description: removeHtml(item.description_original),
    thumbnail: item.thumbnail,
    audio: item.audio,
    publisher: item.podcast.publisher_original,
    audioLength: formatTime(item.audio_length_sec),
  }));

  return (
    <div className="max-w-7xl mx-auto scroll-mt-24" id="episodes">
      <h2 className="font-semibold text-3xl text-gray-900 dark:text-gray-100 max-w-7xl mx-auto px-4 border-b-4 border-gray-500 pb-2 mb-6 rounded">
        Podcast Episodes
      </h2>
      <div className=" grid  grid-cols-1 gap-4 md:auto-row-[18rem] lg:grid-cols-3">
        {/* {modifiedResponse?.map((episode: EpisodeItemType) => ( */}
        <EpisodeItem episodesData={modifiedResponse} />
        {/* ))} */}
      </div>
    </div>
  );
};

export default EpisodeList;
