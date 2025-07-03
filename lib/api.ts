export async function fetchEpisodes() {
  try {
    const res = await fetch(
      "https://listen-api-test.listennotes.com/api/v2/search?type=episode&page_size=20&len_min=10'",
      {
        // headers: { "X-ListenAPI-Key": process.env.LISTEN_NOTES_API_KEY! },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch episodes:", error);
    return null;
  }
}
