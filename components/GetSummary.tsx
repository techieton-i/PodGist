"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import SummaryDrawer from "./SummaryDrawer";

const GetSummary: React.FC<{
  episodeId: string;
  audioUrl: string;
  title: string;
}> = ({ episodeId, audioUrl, title }) => {
  const [summary, setSummary] = useState<string>("");
  const [openModal, setOpenSummaryModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetSummary = async () => {
    setOpenSummaryModal(true);
    setLoading(true);
    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        body: JSON.stringify({
          episodeId,
          audioUrl,
        }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("failed with error=>", error);
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        variant="secondary"
        className="text-xs w-fit !ml-auto block cursor-pointer"
        onClick={handleGetSummary}
      >
        Get Summary
      </Button>
      <SummaryDrawer
        open={openModal}
        setOpen={setOpenSummaryModal}
        summary={summary}
        title={title}
        loading={loading}
      />
    </>
  );
};

export default GetSummary;
