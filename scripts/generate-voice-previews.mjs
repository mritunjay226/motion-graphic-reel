import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, '..', 'public', 'voice_previews');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const voices = [
  { name: 'Puck', lang: 'en', sample: 'Hello! This is Puck, an energetic and modern narrator voice powered by Gemini 3.8.' },
  { name: 'Charon', lang: 'en', sample: 'This is Charon, a deep and authoritative baritone voice for investigative documentaries.' },
  { name: 'Kore', lang: 'en', sample: 'Hello, this is Kore, delivering crisp, focused, and balanced documentary narration.' },
  { name: 'Fenrir', lang: 'en', sample: 'This is Fenrir. A bold, resonant, and high-impact documentary voice.' },
  { name: 'Aoede', lang: 'en', sample: 'Welcome. This is Aoede, offering polished, sophisticated cinematic studio delivery.' },
  { name: 'Leda', lang: 'en', sample: 'Hello! This is Leda, a warm, bright, and expressive narrator for your reels.' },
  { name: 'Orus', lang: 'en', sample: 'This is Orus, a firm, steady, and clear voice designed for informative breakdowns.' },
  { name: 'Zephyr', lang: 'en', sample: 'Hello, this is Zephyr, an engaging and thoughtful voice for compelling storytelling.' },
  { name: 'Fola', lang: 'en', sample: 'Hello, this is Fola, a warm, charismatic storyteller crafted for high-retention reels.' },
  // Hindi samples
  { name: 'Fola', lang: 'hi', id: 'fola_hi', sample: 'नमस्ते, यह जेमिनी 3.8 का हिंदी वॉइसओवर है। यह आपकी रील्स को एक नया रूप देगा।' },
  { name: 'Charon', lang: 'hi', id: 'charon_hi', sample: 'यह चारोन की आवाज़ है, जो गंभीर और रहस्यमयी डॉक्यूमेंट्री के लिए एकदम सही है।' },
  { name: 'Puck', lang: 'hi', id: 'puck_hi', sample: 'नमस्ते! यह पक की तेज़ और रोमांचक आवाज़ है, जो टेक और वायरल स्टोरीज़ के लिए बेहतरीन है।' },
];

function parseMimeType(mimeType) {
  const [fileType, ...params] = mimeType.split(';').map((s) => s.trim());
  const options = { numChannels: 1, sampleRate: 24000, bitsPerSample: 16 };
  for (const param of params) {
    const [key, value] = param.split('=').map((s) => s.trim());
    if (key === 'rate') {
      const parsedRate = parseInt(value, 10);
      if (!isNaN(parsedRate)) options.sampleRate = parsedRate;
    }
  }
  return options;
}

function createWavHeader(dataLength, options) {
  const { numChannels, sampleRate, bitsPerSample } = options;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = Buffer.alloc(44);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);
  return buffer;
}

async function run() {
  for (const v of voices) {
    const fileBase = v.id || `${v.name.toLowerCase()}_${v.lang}`;
    const filePath = path.join(dir, `${fileBase}.wav`);
    if (fs.existsSync(filePath)) {
      console.log(`Already exists: ${fileBase}.wav`);
      continue;
    }
    console.log(`Generating preview for ${v.name} (${v.lang})...`);
    try {
      const response = await ai.models.generateContentStream({
        model: 'gemini-3.8-flash-tts',
        config: {
          responseModalities: ['audio'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: v.name },
            },
          },
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: v.sample }],
          },
        ],
      });
      const chunks = [];
      let mimeType = 'audio/l16; rate=24000; channels=1';
      for await (const chunk of response) {
        if (chunk.candidates?.[0]?.content?.parts) {
          for (const p of chunk.candidates[0].content.parts) {
            if (p.inlineData?.data) {
              if (p.inlineData.mimeType) mimeType = p.inlineData.mimeType;
              chunks.push(Buffer.from(p.inlineData.data, 'base64'));
            }
          }
        }
      }
      if (chunks.length > 0) {
        const pcm = Buffer.concat(chunks);
        const header = createWavHeader(pcm.length, parseMimeType(mimeType));
        fs.writeFileSync(filePath, Buffer.concat([header, pcm]));
        console.log(`✅ Saved ${fileBase}.wav (${pcm.length} bytes)`);
      }
      // 1s delay to respect API quota
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`❌ Failed ${v.name}:`, err.message);
    }
  }
}

run();
