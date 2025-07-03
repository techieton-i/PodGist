"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";
import { AlertTriangle, Loader2 } from "lucide-react";

interface SummaryDrawerProps {
  summary: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const SummaryDrawer: React.FC<SummaryDrawerProps> = ({
  summary,
  open,
  setOpen,
  title,
  loading,
  error,
  onRetry,
}) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent
        className="max-h-[90vh] rounded-t-2xl border bg-white shadow-xl px-6 pb-8
                                dark:bg-gray-900 dark:border-gray-700 dark:shadow-black/40"
      >
        <DrawerHeader className="text-left space-y-1 pt-6">
          <DrawerTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            🎙️ {title}
          </DrawerTitle>
          <DrawerDescription className="text-gray-600 text-sm dark:text-gray-400">
            AI-generated summary of this episode.
          </DrawerDescription>
        </DrawerHeader>
        <div
          className="mt-5 bg-gray-50 rounded-lg p-5 text-gray-800 text-sm leading-relaxed tracking-wide border shadow-inner max-h-[70%] overflow-y-auto
    dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:shadow-none"
        >
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600 animate-pulse dark:text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating summary...
            </div>
          ) : error ? (
            <div className="flex flex-col gap-3 text-red-600 dark:text-red-400">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                <p className="text-sm">Failed to generate summary: {error}</p>
              </div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="self-start bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition"
                >
                  Retry
                </button>
              )}
            </div>
          ) : summary ? (
            <p className="whitespace-pre-wrap">
              {summary}
              <span className="animate-pulse">|</span>
            </p>
          ) : (
            <p className="italic text-gray-400 dark:text-gray-500">
              No summary available.
            </p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SummaryDrawer;
