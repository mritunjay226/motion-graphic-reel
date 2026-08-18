import { NextResponse } from "next/server";
import { getZernioAccounts } from "@/lib/zernio";

/**
 * GET /api/social/accounts
 *
 * Fetches connected YouTube, Instagram, and other social accounts from Zernio.
 */
export async function GET() {
  try {
    if (!process.env.ZERNIO_API_KEY) {
      return NextResponse.json(
        {
          error: "ZERNIO_API_KEY is not configured.",
          accounts: [],
        },
        { status: 503 }
      );
    }

    const accounts = await getZernioAccounts();
    return NextResponse.json({ accounts }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/social/accounts] Error:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch social accounts from Zernio.",
        accounts: [],
      },
      { status: 500 }
    );
  }
}
