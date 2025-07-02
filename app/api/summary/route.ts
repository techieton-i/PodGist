import { connectDB } from "@/lib/db";
import { getSummaryFromGemini } from "@/lib/llm";
import { handleApiError } from "@/lib/utils";
import Summary from "@/models/summaryModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { episodeId, audioUrl } = await req.json();
    await connectDB();

    const existingSummary = await Summary.findOne({ episodeId });
    if (existingSummary) {
      return NextResponse.json({ summary: existingSummary.summary });
    }

    const summaryResponse = await getSummaryFromGemini(audioUrl);

    await Summary.create({ episodeId, summary: summaryResponse });

    return NextResponse.json({ summary: summaryResponse });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
