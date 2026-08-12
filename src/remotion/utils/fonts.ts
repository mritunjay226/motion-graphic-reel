import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSyne } from "@remotion/google-fonts/Syne";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadPlayfairDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadPermanentMarker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadNotoSansDevanagari } from "@remotion/google-fonts/NotoSansDevanagari";
import { loadFont as loadTeko } from "@remotion/google-fonts/Teko";

// Preload and register Google Fonts into Remotion document head with warning suppression
const fontOptions = { ignoreTooManyRequestsWarning: true };

// Bebas Neue and Permanent Marker only have weight '400' in Google Fonts.
// Calling loadFont with weight 700 or passing weights array for Bebas Neue throws an Error.
const bebasNeue = (() => {
  try {
    return loadBebasNeue();
  } catch (e) {
    console.warn("Failed to load BebasNeue font face, falling back to system declaration:", e);
    return { fontFamily: "Bebas Neue" };
  }
})();

const montserrat = loadMontserrat("normal", fontOptions);
const inter = loadInter("normal", fontOptions);
const syne = loadSyne("normal", fontOptions);
const spaceGrotesk = loadSpaceGrotesk("normal", fontOptions);
const outfit = loadOutfit("normal", fontOptions);
const playfairDisplay = loadPlayfairDisplay("normal", fontOptions);
const oswald = loadOswald("normal", fontOptions);
const cinzel = loadCinzel("normal", fontOptions);
const permanentMarker = (() => {
  try {
    return loadPermanentMarker();
  } catch (e) {
    return { fontFamily: "Permanent Marker" };
  }
})();
const notoSansDevanagari = loadNotoSansDevanagari("normal", fontOptions);
const teko = loadTeko("normal", fontOptions);

export const FONTS = {
  bebasNeue: `${bebasNeue.fontFamily}, ${teko.fontFamily}, sans-serif`,
  montserrat: `${montserrat.fontFamily}, ${notoSansDevanagari.fontFamily}, sans-serif`,
  inter: `${inter.fontFamily}, ${notoSansDevanagari.fontFamily}, sans-serif`,
  syne: `${syne.fontFamily}, ${teko.fontFamily}, sans-serif`,
  spaceGrotesk: `${spaceGrotesk.fontFamily}, ${notoSansDevanagari.fontFamily}, sans-serif`,
  outfit: `${outfit.fontFamily}, ${notoSansDevanagari.fontFamily}, sans-serif`,
  playfairDisplay: `${playfairDisplay.fontFamily}, ${notoSansDevanagari.fontFamily}, serif`,
  oswald: `${oswald.fontFamily}, ${teko.fontFamily}, sans-serif`,
  cinzel: `${cinzel.fontFamily}, ${teko.fontFamily}, serif`,
  permanentMarker: `${permanentMarker.fontFamily}, ${teko.fontFamily}, sans-serif`,
  notoSansDevanagari: notoSansDevanagari.fontFamily,
  teko: teko.fontFamily,
} as const;

export function getFontFamily(fontName?: string, textSample?: string): string {
  // If sample text contains Devanagari characters, prioritize Devanagari fonts
  if (textSample && /[\u0900-\u097F]/.test(textSample)) {
    return `${FONTS.teko}, ${FONTS.notoSansDevanagari}, sans-serif`;
  }

  if (!fontName) return FONTS.bebasNeue;
  
  const lower = fontName.toLowerCase();
  if (lower.includes("hindi") || lower.includes("devanagari")) return `${FONTS.teko}, ${FONTS.notoSansDevanagari}, sans-serif`;
  if (lower.includes("bebas")) return FONTS.bebasNeue;
  if (lower.includes("montserrat")) return FONTS.montserrat;
  if (lower.includes("syne")) return FONTS.syne;
  if (lower.includes("space")) return FONTS.spaceGrotesk;
  if (lower.includes("outfit")) return FONTS.outfit;
  if (lower.includes("playfair")) return FONTS.playfairDisplay;
  if (lower.includes("oswald")) return FONTS.oswald;
  if (lower.includes("cinzel")) return FONTS.cinzel;
  if (lower.includes("marker") || lower.includes("hand")) return FONTS.permanentMarker;
  if (lower.includes("inter") || lower.includes("sans")) return FONTS.inter;
  
  return `${fontName}, ${FONTS.notoSansDevanagari}, sans-serif`;
}
