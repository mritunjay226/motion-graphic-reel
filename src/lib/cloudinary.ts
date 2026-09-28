import crypto from "crypto";

/**
 * Cloudinary Media Storage Upload Helper.
 * Uploads audio/video binary buffers or Base64 strings to Cloudinary CDN storage
 * using configured credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).
 */
export async function uploadAudioToCloudinary(
  bufferOrBase64: Buffer | string,
  fileName: string,
  folder: string = "vox-reels/audio"
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const publicId = fileName.replace(/\.[^/.]+$/, "");
  
  // Format payload: data URL or Base64 string with accurate MIME type
  let fileData: string;
  if (Buffer.isBuffer(bufferOrBase64)) {
    const isWav = fileName.toLowerCase().endsWith(".wav") || bufferOrBase64.subarray(0, 4).toString("ascii") === "RIFF";
    const mimeType = isWav ? "audio/wav" : "audio/mp3";
    fileData = `data:${mimeType};base64,${bufferOrBase64.toString("base64")}`;
  } else if (bufferOrBase64.startsWith("data:")) {
    fileData = bufferOrBase64;
  } else {
    const isWav = fileName.toLowerCase().endsWith(".wav") || bufferOrBase64.startsWith("UklGR");
    const mimeType = isWav ? "audio/wav" : "audio/mp3";
    fileData = `data:${mimeType};base64,${bufferOrBase64}`;
  }

  // Create SHA-1 signature for Cloudinary signed upload
  // Signature parameters must be sorted alphabetically by key: folder, public_id, timestamp
  const signatureParams = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(signatureParams).digest("hex");

  const formData = new FormData();
  formData.append("file", fileData);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("signature", signature);


  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

  console.log(`[Cloudinary] Uploading audio file "${fileName}" to folder "${folder}"...`);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Cloudinary Upload Error ${response.status}]`, errorText);
    throw new Error(`Cloudinary upload failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const secureUrl = data.secure_url || data.url;

  if (!secureUrl) {
    throw new Error("Cloudinary upload succeeded but no secure_url was returned.");
  }

  console.log(`[Cloudinary] ✅ Audio file uploaded successfully: ${secureUrl}`);
  return secureUrl;
}
