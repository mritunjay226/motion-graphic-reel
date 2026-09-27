import { NextRequest, NextResponse } from "next/server";
import { uploadImageToImageKit } from "@/lib/imagekit";

export { uploadImageToImageKit };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, fileName, folder = "/vox-reels", removeBg = true } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl parameter is required" },
        { status: 400 }
      );
    }

    const result = await uploadImageToImageKit({
      imageUrl,
      fileName,
      folder,
      removeBg,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("ImageKit Upload Route Exception:", error);
    return NextResponse.json({
      success: true,
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1400'><rect width='100%' height='100%' fill='%23111'/></svg>",
      fallback: true,
      error: error.message,
    });
  }
}
