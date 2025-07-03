"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 text-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4 max-w-md">
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          We could not load this page. Please try again or go back home.
        </p>
        <div className="flex gap-3 mt-4">
          <Button variant="default" onClick={reset}>
            Retry
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-sm"
          >
            Go Home
          </Button>
        </div>
        <pre className="text-xs text-red-500 opacity-60 mt-4 whitespace-pre-wrap max-w-full overflow-x-auto">
          {error?.message}
        </pre>
      </div>
    </div>
  );
}
