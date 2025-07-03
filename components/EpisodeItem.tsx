"use client";

import React, { useCallback, useState } from "react";
import MotionWrapper from "./MotionWrapper";
import { cn } from "@/lib/utils";
import { EpisodeItemType } from "@/lib/types";
import SummaryDrawer from "./SummaryDrawer";

const EpisodeItem: React.FC<{ episodesData: EpisodeItemType[] }> = ({
  episodesData,
}) => {
  const [{ open: openDrawer, selectedEpisode }, setOpenSummaryModal] =
    useState<{
      open: boolean;
      selectedEpisode?: EpisodeItemType | null;
    }>({ open: false, selectedEpisode: null });

  const handleClick = useCallback((episode: EpisodeItemType) => {
    console.log("object");
    setOpenSummaryModal((prev) =>
      episode ? { open: !prev.open, selectedEpisode: episode } : { open: true }
    );
  }, []);

  return (
    <>
      {episodesData?.map((episode: EpisodeItemType) => (
        <MotionWrapper
          key={episode.id}
          className={cn(
            "group/card shadow-input row-span-1 lg:w-[300px] xl:w-[400px] grid grid-cols-[100px_1fr] sm:grid-cols-[200px_1fr] gap-4 lg:flex flex-col justify-between space-y-4 rounded-xl border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none h-fit cursor-pointer"
          )}
          onClick={() => handleClick(episode)}
        >
          <div className="relative lg:w-full h-auto ">
            <img
              src={episode.thumbnail}
              alt="thumbnail"
              style={{ width: "100%", height: "auto" }}
              className="object-cover rounded-md group-hover/card:scale-102 transition"
            />
          </div>
          <div className="transition duration-200 group-hover/card:translate-x-2 truncate">
            <div className="mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
              {episode.title}
            </div>
            <div className="prose max-w-none text-sm font-sans font-normal text-neutral-600 dark:text-neutral-300 truncate">
              {episode.description}
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Publisher: {episode.publisher}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Length: {episode.audioLength}
            </p>
          </div>
        </MotionWrapper>
      ))}

      <SummaryDrawer
        open={openDrawer}
        setOpen={setOpenSummaryModal}
        {...selectedEpisode}
      />
    </>
  );
};

export default EpisodeItem;
