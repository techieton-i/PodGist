"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import SummaryDrawer from "./SummaryDrawer";

interface GetSummaryProps {
  episodeId: string;
  audioUrl: string;
  title: string;
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const GetSummary: React.FC<GetSummaryProps> = ({
  episodeId,
  audioUrl,
  title,
}) => {
  const [summary, setSummary] = useState<string>("");
  const [openModal, setOpenSummaryModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!openModal && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, [openModal]);

  const handleGetSummary = async (): Promise<void> => {
    setOpenSummaryModal(true);
    setLoading(true);
    setSummary("");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId,
          audioUrl,
        }),
        signal: controller.signal,
      });

      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        const responseData = await response.json();
        setSummary(responseData.summary);
        setLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            for (const char of chunk) {
              setSummary((prev) => prev + char);
              await sleep(10);
            }
          }
          setLoading(false);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Streaming aborted");
      } else {
        console.error("Streaming error:", error);
        setError("Something went Wrong");
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
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
        error={error}
        onRetry={handleGetSummary}
      />
    </>
  );
};

export default GetSummary;
