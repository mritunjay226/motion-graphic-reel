import { NextRequest, NextResponse } from "next/server";
import { searchStockVideos } from "@/lib/video-fetcher";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || searchParams.get("query") || "cinematic documentary";
    const perPage = Math.min(20, Math.max(1, parseInt(searchParams.get("perPage") || "10", 10)));

    const videos = await searchStockVideos(query, perPage);
    return NextResponse.json({ success: true, count: videos.length, videos });
  } catch (err: any) {
    console.error("[Stock Videos API GET Error]", err);
    return NextResponse.json({ success: false, error: err.message, videos: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const query = body.query || body.q || "cinematic documentary";
    const perPage = Math.min(20, Math.max(1, body.perPage || 10));

    const videos = await searchStockVideos(query, perPage);
    return NextResponse.json({ success: true, count: videos.length, videos });
  } catch (err: any) {
    console.error("[Stock Videos API POST Error]", err);
    return NextResponse.json({ success: false, error: err.message, videos: [] }, { status: 500 });
  }
}
