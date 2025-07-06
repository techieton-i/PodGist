import { GoogleGenAI } from "@google/genai";
import { streamToBase64 } from "./utils";

const ai = new GoogleGenAI({});

export async function getSummaryFromGemini(
  audioUrl: string
): Promise<AsyncGenerator<unknown, void, unknown>> {
  try {
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok || !audioRes.body) {
      throw new Error("Failed to fetch audio stream");
    }

    const base64AudioFile = await streamToBase64(audioRes);
    console.info("done streaming");

    const contents = [
      {
        text: `Please listen to the attached audio and provide a comprehensive and structured summary.

Context:
- The audio is a podcast on a certain topic.

Instructions:
- Start with a 2-3 sentence high-level summary.
- Then provide a more detailed summary organized by sections or themes.
- Highlight important points, insights, names, dates, or statistics mentioned.
- If there is any dialogue or interview format, identify the speakers and summarize their viewpoints separately.
- Limit the total response to **300–400 words**.

Be clear, concise, and maintain the logical flow of the original audio.`,
      },
      {
        inlineData: {
          mimeType: "audio/mp3",
          data: base64AudioFile,
        },
      },
    ];

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });
    console.info("content response returned from gemini");
    return response;
  } catch (error: any) {
    console.error("Gemini stream error:", error);
    throw new Error(error?.message || "Failed to generate summary from Gemini");
  }
}
