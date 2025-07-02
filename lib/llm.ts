import { GoogleGenAI } from "@google/genai";
import { streamToBase64 } from "./utils";

const ai = new GoogleGenAI({});

export async function getSummaryFromGemini(audioUrl: string): Promise<string> {
  console.log(Date.now());
  const audioRes = await fetch(audioUrl);
  const base64AudioFile = await streamToBase64(audioRes);
  console.log("done", Date.now());
  const contents = [
    { text: "Please summarize the audio." },
    {
      inlineData: {
        mimeType: "audio/mp3",
        data: base64AudioFile,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });
  return response.text as string;
}
