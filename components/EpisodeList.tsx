import { cn, formatTime, removeHtml } from "@/lib/utils";
import React from "react";
import GetSummary from "./GetSummary";
import { EpisodeItem } from "@/lib/types";
import MotionWrapper from "./MotionWrapper";
import { fetchEpisodes } from "@/lib/api";

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
    description: item.description_original,
    thumbnail: item.thumbnail,
    audio: item.audio,
    publisher: item.podcast.publisher_original,
    audioLength: formatTime(item.audio_length_sec),
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="font-semibold text-3xl text-gray-900 dark:text-gray-100 max-w-7xl mx-auto px-4 border-b-4 border-gray-500 pb-2 mb-6 rounded">
        Podcast Episodes
      </h2>
      <div className=" grid  grid-cols-1 gap-4 md:auto-row-[18rem] lg:grid-cols-3">
        {modifiedResponse?.map(
          ({
            title,
            description,
            thumbnail,
            id,
            publisher,
            audio,
            audioLength,
          }: EpisodeItem) => (
            <MotionWrapper
              key={id}
              className={cn(
                "group/card shadow-input row-span-1 lg:w-[300px] xl:w-[400px] grid grid-cols-[100px_1fr] sm:grid-cols-[200px_1fr] gap-4 lg:flex flex-col justify-between space-y-4 rounded-xl border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none h-fit"
              )}
            >
              <div className="relative lg:w-full h-auto">
                <img
                  src={thumbnail}
                  alt="thumbnail"
                  style={{ width: "100%", height: "auto" }}
                  className="object-cover rounded-md"
                />
              </div>
              <div className="transition duration-200 group-hover/card:translate-x-2 truncate">
                <div className="mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
                  {title}
                </div>
                <div className="prose max-w-none text-sm font-sans font-normal text-neutral-600 dark:text-neutral-300 truncate">
                  {removeHtml(description)}
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Publisher: {publisher}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Length: {audioLength}
                </p>

                <GetSummary episodeId={id} audioUrl={audio} title={title} />
              </div>
            </MotionWrapper>
          )
        )}
      </div>
    </div>
  );
};

export default EpisodeList;
