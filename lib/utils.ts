import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeHtml(html: string): string {
  if (typeof window === "undefined") {
    return html.replace(/<[^>]+>/g, "");
  }
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export async function streamToBase64(response: Response): Promise<string> {
  const chunks: Buffer[] = [];
  const reader = response.body?.getReader();

  if (!reader) throw new Error("response.body is empty");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value && value.length > 0) {
      chunks.push(Buffer.from(value));
    }
  }

  return Buffer.concat(chunks).toString("base64");
}

export function handleApiError(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error("error: ", error);
  }
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Something went wrong";

  return NextResponse.json({ error: message }, { status: 500 });
}
