import { NextResponse } from "next/server";
import { mockYouTubeVideos } from "@/data/testimonialsData";

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    // Return cached/mock curated videos gracefully
    return NextResponse.json({
      success: true,
      source: "curated_fallback",
      videos: mockYouTubeVideos
    });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6&type=video`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`YouTube API error: ${res.statusText}`);
    }

    const data = await res.json();
    interface YouTubeApiItem {
      id: { videoId: string };
      snippet: {
        title: string;
        thumbnails: { high?: { url: string }; medium?: { url: string } };
        publishedAt: string;
      };
    }
    const videos = data.items.map((item: YouTubeApiItem) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
      views: "Recent",
      duration: "Decoded Lesson",
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      category: "Coding"
    }));

    return NextResponse.json({
      success: true,
      source: "youtube_api",
      videos
    });
  } catch (error) {
    console.error("YouTube fetch error, using fallback:", error);
    return NextResponse.json({
      success: true,
      source: "curated_fallback",
      videos: mockYouTubeVideos
    });
  }
}
