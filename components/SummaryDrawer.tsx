"use client";

import { useDeviceType } from "@/lib/hooks";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";
import { AlertTriangle, Copy, Loader2 } from "lucide-react";
import { cn, sleep } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface SummaryDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<any>>;
  title?: string;
  id?: string;
  audio?: string;
  description?: string;
}

const SummaryDrawer: React.FC<SummaryDrawerProps> = ({
  open,
  setOpen,
  title,
  id: episodeId,
  audio: audioUrl,
  description: desc,
}) => {
  const { isMobile } = useDeviceType();
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, [open]);

  const handleGetSummary = useCallback(async (): Promise<void> => {
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
  }, [audioUrl, episodeId]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        setSummary("");
      }}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent
        className={cn(
          " rounded-t-2xl border bg-white shadow-xl px-6 pb-8 dark:bg-gray-900 dark:border-gray-700 dark:shadow-black/40",
          !isMobile ? "h-screen !max-w-[40vw]" : "max-h-[90vh]"
        )}
      >
        <DrawerHeader className="text-left space-y-1 pt-6">
          <DrawerTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            🎙️ {title}
          </DrawerTitle>
          <DrawerDescription
            className={cn(
              "text-gray-600 text-sm dark:text-gray-400 !max-h-[10rem] overflow-y-auto"
            )}
          >
            {desc}
          </DrawerDescription>
          <Button
            variant="outline"
            className="dark:bg-gray-800 dark:text-gray-400 border--gray-400 dark:border-gray-400 rounded-xl md:w-fit cursor-pointer mt-1"
            onClick={handleGetSummary}
            disabled={!!summary}
          >
            Generate Summary
          </Button>
        </DrawerHeader>
        <SummaryContent
          summary={summary}
          loading={loading}
          retry={handleGetSummary}
          error={error}
        />
      </DrawerContent>
    </Drawer>
  );
};

interface SummaryContentProps {
  summary: string;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

function SummaryContent({
  summary,
  error,
  loading,
  retry,
}: SummaryContentProps) {
  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      toast("copied");
    } catch {
      console.error("unable to copy");
    }
  }
  return (
    <div
      className="mt-1 bg-gray-50 rounded-lg px-5 pb-5 text-sm text-gray-800 leading-relaxed tracking-wide border shadow-inner max-h-[80%] overflow-y-auto
      dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:shadow-none relative"
    >
      <div className="flex justify-between items-center mb-5 sticky top-0 bg-inherit">
        <p className="opacity-50">AI-generated summary</p>
        <Button
          onClick={copySummary}
          aria-label="Copy summary"
          className="p-2 rounded-md bg-transparent border-none shadow-none text-gray-600 dark:text-gray-300 opacity-60 hover:opacity-100 hover:text-black dark:hover:text-white transition duration-200 cursor-copy"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600 animate-pulse dark:text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating summary...
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col gap-3 text-red-600 dark:text-red-400">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            <p className="text-sm">Failed to generate summary: {error}</p>
          </div>
          <Button
            onClick={retry}
            variant="destructive"
            size="sm"
            className="self-start text-xs"
          >
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && summary && (
        <p className="whitespace-pre-wrap">
          {summary}
          <span className="animate-pulse">|</span>
        </p>
      )}

      {!loading && !error && !summary && (
        <p className="italic text-gray-400 dark:text-gray-500">
          No summary available.
        </p>
      )}
    </div>
  );
}

export default SummaryDrawer;
