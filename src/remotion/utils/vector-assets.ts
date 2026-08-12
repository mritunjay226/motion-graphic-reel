/**
 * Authentic Vox 2.5D Paper Cutout Sticker Vector Engine.
 *
 * Generates instant, 0-latency Base64 SVG Data URLs styled as authentic Vox 2.5D documentary subject cutouts
 * with white die-cut contour borders, paper texture overlays, angled yellow tape badges, and crisp typography.
 * Completely transparent background with ZERO star placeholders or prompt text leakage.
 */

/**
 * Generates an SVG Vector Cutout Sticker Data URL from a visual prompt description.
 */
export function generateSvgVectorStickerUrl(prompt: string, category = "DOCUMENTARY EVIDENCE"): string {
  // Precision prompt sanitization to extract ONLY the clean subject name
  let cleanSubject = prompt
    .replace(/^(single subject|portrait|photo|cutout|illustration|sticker|image|picture|archival photo)\s*(cutout|photo|sticker|of|for)*\s*/gi, "")
    .replace(/^cutout of\s*/gi, "")
    .replace(/,.*$/g, "")
    .replace(/\s*(isolated|png|white background|documentary|high quality).*/gi, "")
    .trim();

  if (!cleanSubject || cleanSubject.length < 2) {
    cleanSubject = "KEY EVIDENCE";
  }

  const displayTitle = cleanSubject.toUpperCase().slice(0, 22);
  const displayCategory = category.toUpperCase().slice(0, 22);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="650" viewBox="0 0 600 650">
  <defs>
    <linearGradient id="voxYellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE600"/>
      <stop offset="100%" stop-color="#FACC15"/>
    </linearGradient>
    <linearGradient id="paperBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FAFAFA"/>
      <stop offset="100%" stop-color="#E5E5E5"/>
    </linearGradient>
    <filter id="voxShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <g filter="url(#voxShadow)">
    <!-- 1. Outer White Die-Cut Paper Contour Shape -->
    <path d="M 60,70 Q 300,30 540,70 Q 570,300 540,540 Q 300,580 60,540 Q 30,300 60,70 Z" fill="#FFFFFF" />

    <!-- 2. Inner Studio Neutral Paper Card -->
    <path d="M 72,82 Q 300,44 528,82 Q 556,300 528,528 Q 300,566 72,528 Q 44,300 72,82 Z" fill="url(#paperBgGrad)" stroke="#111111" stroke-width="4"/>

    <!-- 3. Fine Technical Infographic Grid Background -->
    <line x1="100" y1="120" x2="500" y2="120" stroke="#111111" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.25"/>
    <line x1="100" y1="260" x2="500" y2="260" stroke="#111111" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.25"/>
    <line x1="100" y1="400" x2="500" y2="400" stroke="#111111" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.25"/>
    <line x1="300" y1="80" x2="300" y2="480" stroke="#111111" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.25"/>

    <!-- 4. Top Category Stamp Badge -->
    <rect x="85" y="95" width="180" height="28" rx="4" fill="#111111"/>
    <text x="175" y="114" font-family="'Space Grotesk', sans-serif, monospace" font-size="11" font-weight="900" fill="#FFE600" text-anchor="middle" letter-spacing="1.5">
      ● ${displayCategory}
    </text>

    <!-- 5. Subject Vector Silhouette Contour (Documentary Figure) -->
    <g transform="translate(180, 130)">
      <!-- Head / Hair Silhouette -->
      <circle cx="120" cy="90" r="55" fill="#111111"/>
      <path d="M 75 80 Q 120 40 165 80 Z" fill="#1A1A1A"/>
      
      <!-- Collared Suit / Blazer Silhouette -->
      <path d="M 30 250 L 60 160 Q 120 145 180 160 L 210 250 Z" fill="#111111"/>
      <!-- Inner Shirt & Tie Accent -->
      <polygon points="120,150 105,190 120,240 135,190" fill="#FFE600"/>
      <polygon points="120,150 100,165 140,165" fill="#FFFFFF"/>
    </g>

    <!-- 6. Angled Vox Yellow Paper Tape Badge at Bottom -->
    <g transform="rotate(-2, 300, 480)">
      <rect x="90" y="445" width="420" height="68" rx="6" fill="url(#voxYellowGrad)" stroke="#111111" stroke-width="4" filter="url(#voxShadow)"/>
      
      <!-- Tape Corner Tabs -->
      <rect x="75" y="460" width="30" height="38" fill="#111111" opacity="0.85" transform="rotate(12, 90, 479)"/>
      <rect x="495" y="460" width="30" height="38" fill="#111111" opacity="0.85" transform="rotate(-12, 510, 479)"/>

      <text x="300" y="490" font-family="'Bebas Neue', 'Space Grotesk', sans-serif" font-size="28" font-weight="normal" fill="#111111" text-anchor="middle" letter-spacing="2">
        ${displayTitle}
      </text>
    </g>

    <!-- 7. Document Reference Code Seal -->
    <text x="500" y="114" font-family="monospace" font-size="10" font-weight="bold" fill="#666666" text-anchor="end">
      FILE REF-2.5D
    </text>
  </g>
</svg>`;

  const base64Svg = typeof Buffer !== "undefined"
    ? Buffer.from(svgContent).toString("base64")
    : typeof btoa !== "undefined"
    ? btoa(unescape(encodeURIComponent(svgContent)))
    : "";
  return `data:image/svg+xml;base64,${base64Svg}`;
}
