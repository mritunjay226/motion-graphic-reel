import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Automatically load .env.local if running standalone node script
if (!process.env.GEMINI_API_KEY && !process.env.GEMINI_IMAGEGEN_API_KEY) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim();
            process.env[key] = val;
          }
        }
      });
    }
  } catch (err) {
    console.warn('Could not auto-load .env.local:', err.message);
  }
}

/**
 * Generates an image using Google AI Studio Gemini API (`gemini-2.5-flash-image`) and saves it locally.
 * 
 * @param {string} prompt - The prompt describing the image.
 * @param {string} outputPath - The local file path to save the generated image.
 * @param {string} apiKey - Your Google AI Studio API key.
 */
export async function generateImage(prompt, outputPath, apiKey) {
  const key = apiKey || process.env.GEMINI_IMAGEGEN_API_KEY || process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error('GEMINI_IMAGEGEN_API_KEY or GEMINI_API_KEY environment variable is not defined.');
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });

    console.log(`Generating image for: "${prompt}"...`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        responseModalities: ['image'],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('No candidates returned from the API.');
    }

    const parts = candidates[0].content.parts;
    let imageSaved = false;

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        if (outputPath) {
          fs.writeFileSync(outputPath, buffer);
          console.log(`Success! Image saved to: ${outputPath}`);
        }
        imageSaved = true;
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }

    if (!imageSaved) {
      console.log('API responded, but no image data was found in the output.');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

// Execute test run if called directly
const isDirectExecution = process.argv[1] && process.argv[1].endsWith('image-gen-test.js');
if (isDirectExecution) {
  generateImage(
    'A netflix office building', 
    'netflix.png'
  );
}