import { NextResponse } from "next/server";
import { getZernioConnectUrl } from "@/lib/zernio";

/**
 * GET /api/social/connect?platform=youtube|instagram
 *
 * Generates an OAuth connect URL to link YouTube or Instagram to Zernio.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get("platform");

    if (!platform) {
      return NextResponse.json(
        { error: "Platform query parameter is required (e.g. 'youtube' or 'instagram')" },
        { status: 400 }
      );
    }

    const authUrl = await getZernioConnectUrl(platform);
    return NextResponse.json({ authUrl }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/social/connect] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to generate connection URL" },
      { status: 500 }
    );
  }
}
