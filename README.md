## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🎙️ Podcast Summarizer App

Overview

The Podcast Summarizer is a web-based application designed to generate AI-powered summaries of podcast episodes from a simple audio URL. It uses Google Gemini 2.5 Flash for fast, high-quality summarization and streams the generated content in real-time to the user interface.

- **Input**: Podcast episode audio URL
- **Output**: Real-time streamed summary
- **Stack**:

  - **Next.js (App Router)** + TypeScript
  - **Google GenAI SDK (Gemini)**
  - **MongoDB** for persistent caching
  - **Tailwind CSS + Shadcn UI** for styling
  - **ReadableStream** APIs for streaming UX

---

### Thought Process & Architecture

#### Goals

- Minimal user friction (click to summarize)
- Real-time feedback via streaming
- Prevent duplicate LLM calls via DB cache
- Ensure mobile-first responsiveness

#### Architecture

```
Frontend (React)
  ⬇ POST /api/summary
Backend API Route
  ⬇ Connect to DB → Check for existing summary
  ⬇ If not found → Fetch & encode audio
  ⬇ Call Gemini → Stream response
  ⬇ Save full summary to MongoDB
  ⬅ Stream summary back to client
```

#### Flow

1. User clicks **"Get Summary"**
2. Client sends `audioUrl` + `episodeId` to `/api/summary`
3. If summary exists in MongoDB → return as JSON
4. If not → audio is fetched, converted to base64, sent to Gemini
5. Gemini streams the summary → streamed back to UI with typewriter effect
6. Final result is cached

---

### Challenges & Trade-offs

| Challenge                       | Solution / Trade-off                                              |
| ------------------------------- | ----------------------------------------------------------------- |
| Slow audio fetching             | Used `streamToBase64()` with streaming buffer handling            |
| Streaming delay in UI           | Character-by-character rendering + `TextDecoder` chunk management |
| Handling LLM timeouts           | `AbortController` + manual timeout setup (30s cap)                |
| Streaming cancel on modal close | Hooked into modal close event to abort fetch                      |
| Cross-device design             | Custom `useDeviceType()` hook to differentiate mobile/desktop     |

---

### Known Limitations

| Limitation                 | Notes                                                             |
| -------------------------- | ----------------------------------------------------------------- | --- |
| Large audio files          | Streaming or converting huge MP3s can break memory/timeout limits |     |
| Gemini accuracy dependency | Output depends on model's interpretation of input                 |
| Only supports MP3 links    | No file uploads or WAV support yet                                |
| No multi-user history      | Summaries are stored per `episodeId` without user linkage         |
