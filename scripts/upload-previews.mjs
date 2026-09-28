import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const dir = path.join(__dirname, '..', 'public', 'voice_previews');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.wav'));

async function uploadFile(fileName) {
  const filePath = path.join(dir, fileName);
  const buf = fs.readFileSync(filePath);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = 'vox-reels/gemini_previews';
  const publicId = fileName.replace(/\.[^/.]+$/, '');

  const fileData = `data:audio/wav;base64,${buf.toString('base64')}`;

  const signatureParams = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(signatureParams).digest('hex');

  const formData = new FormData();
  formData.append('file', fileData);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('signature', signature);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.secure_url || data.url;
}

async function main() {
  const mapping = {};
  for (const f of files) {
    try {
      const url = await uploadFile(f);
      mapping[f] = url;
      console.log(`✅ ${f} -> ${url}`);
    } catch (e) {
      console.error(`❌ ${f}:`, e.message);
    }
  }
  console.log('\nFINAL_MAPPING:', JSON.stringify(mapping, null, 2));
}

main();
