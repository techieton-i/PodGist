import { connectDB } from "@/lib/db";
import { getSummaryFromGemini } from "@/lib/llm";
import { handleApiError } from "@/lib/utils";
import Summary from "@/models/summaryModel";
import { NextResponse } from "next/server";

function handleStreamResponse(
  stream: ReadableStream<Uint8Array>
): NextResponse {
  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { episodeId, audioUrl } = await req.json();
    if (!episodeId || !audioUrl) {
      return NextResponse.json(
        { error: "episodeId and audioUrl is required" },
        { status: 400 }
      );
    }
    await connectDB();
    const existingSummary = await Summary.findOne({ episodeId });
    if (existingSummary) {
      return NextResponse.json({ summary: existingSummary.summary });
    }

    const summaryResponse = await getSummaryFromGemini(audioUrl);

    const { readable, writable } = new TransformStream();
    const textStream = readable.pipeThrough(new TextEncoderStream());
    const writer = writable.getWriter();
    const chunks: string[] = [];

    (async () => {
      for await (const chunk of summaryResponse) {
        const text = (chunk as { text?: string })?.text || "";
        chunks.push(text);
        await writer.write(text);
      }
      await writer.close();
      await Summary.create({ episodeId, summary: chunks.join("") });
    })();
    return handleStreamResponse(textStream);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
