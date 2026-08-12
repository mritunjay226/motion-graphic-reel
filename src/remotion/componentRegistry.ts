// ─── Agent Component Registry & Catalog ─────────────────────────────────────
// Strongly-typed catalog for AI Video Agent component selection.

export interface ComponentMetadata {
  id: string;
  name: string;
  npmPackage: string;
  category: "typography" | "data_viz" | "documentary" | "containers" | "overlays" | "transitions" | "filters";
  subCategory: string;
  vibe: "premium" | "tech" | "data" | "clean" | "playful" | "paper" | "cinematic";
  naturalLengthFrames: number;
  fps: number;
  propsSchema: Record<string, { type: string; default?: any; required?: boolean; description?: string }>;
  useWhen: string[];
  dontUseWhen: string[];
  pairedExits?: string[];
  componentPath: string;
}

export const AGENT_COMPONENT_CATALOG: Record<string, ComponentMetadata> = {
  "soft-blur-in": {
    id: "soft-blur-in",
    name: "SoftBlurIn",
    npmPackage: "@remocn/soft-blur-in",
    category: "typography",
    subCategory: "Soft / Premium Entrance",
    vibe: "premium",
    naturalLengthFrames: 60,
    fps: 30,
    componentPath: "@/components/remocn/soft-blur-in",
    propsSchema: {
      text: { type: "string", required: true, description: "Headline text to reveal" },
      blur: { type: "number", default: 12, description: "Initial blur radius in px, animates down to 0" },
      fontSize: { type: "number", default: 72, description: "Font size in pixels" },
      fontWeight: { type: "number", default: 600, description: "CSS font weight" },
      color: { type: "string", default: "#171717", description: "Text color CSS string" },
      className: { type: "string", description: "Optional extra CSS classes" }
    },
    useWhen: [
      "Hero headline needing Apple-style per-character soft blur reveal (premium, airy, cinematic).",
      "Text is longer, where per-character blur stagger reads faster than word-by-word.",
      "Clean, bright, elegant scene backgrounds."
    ],
    dontUseWhen: [
      "Vibe is tech, glitchy, gritty, or high-energy (use rgb-glitch-text or tracking-in).",
      "Requires an entrance + exit in one (this is entrance only, pair with blur-out-up).",
      "Text swapping sequence (use shared-axis-z or shared-axis-y)."
    ],
    pairedExits: ["blur-out-up"]
  },
  "handwrite": {
    id: "handwrite",
    name: "Handwrite",
    npmPackage: "@remocn/handwrite",
    category: "typography",
    subCategory: "Paper / Stop-Motion Handwriting",
    vibe: "paper",
    naturalLengthFrames: 120,
    fps: 30,
    componentPath: "@/components/remocn/handwrite",
    propsSchema: {
      text: { type: "string", required: true, description: "Text to write out; supports newlines" },
      fontSize: { type: "number", default: 54, description: "Font size in pixels" },
      color: { type: "string", default: "#26242c", description: "Ink color CSS string" },
      delay: { type: "number", default: 0, description: "Frame delay before writing begins" },
      perStep: { type: "number", default: 1.6, description: "Letters laid down per stop-motion pose" },
      weight: { type: "string", default: "600", description: "Pen weight: 400 | 500 | 600 | 700" },
      align: { type: "string", default: "center", description: "Alignment: left | center" },
      step: { type: "number", default: 3, description: "Frames per stop-motion pose (tempo control)" }
    },
    useWhen: [
      "Captions, labels, annotations, or evidence notes on paper/documentary scenes.",
      "Vox paper scrapbook themes, newspaper cutouts, and vintage memo scenes.",
      "Scene ticks on stop-motion clock and text needs matching physical feel."
    ],
    dontUseWhen: [
      "Simulating terminal or code typing (use typewriter).",
      "Smooth 30fps glossy tech scenes (use soft-blur-in or per-character-rise).",
      "Futuristic / Cyberpunk style scenes."
    ],
    pairedExits: ["paper-wobble"]
  },
  "rgb-glitch-text": {
    id: "rgb-glitch-text",
    name: "RGBGlitchText",
    npmPackage: "@remocn/rgb-glitch-text",
    category: "typography",
    subCategory: "Tech / Cyberpunk Glitch Effect",
    vibe: "tech",
    naturalLengthFrames: 90,
    fps: 30,
    componentPath: "@/components/remocn/rgb-glitch-text",
    propsSchema: {
      text: { type: "string", required: true, description: "Text to display and glitch" },
      fontSize: { type: "number", default: 96, description: "Font size in pixels" },
      color: { type: "string", default: "#171717", description: "Base text color" },
      fontWeight: { type: "number", default: 700, description: "CSS font weight" },
      glitchAt: { type: "number", default: 20, description: "Frame at which the glitch starts" },
      glitchDuration: { type: "number", default: 8, description: "Glitch duration in frames" },
      intensity: { type: "number", default: 6, description: "Max offset in pixels for RGB copies" },
      seed: { type: "string", default: "glitch", description: "Deterministic random seed" },
      speed: { type: "number", default: 1, description: "Playback speed multiplier" }
    },
    useWhen: [
      "Tech, hacker, developer, or cyberpunk scene needing digital chromatic aberration corruption on a title.",
      "Deterministic mid-scene disruption on short words/phrases (1-3 words).",
      "Brief high-impact visual distortion after headline entrance."
    ],
    dontUseWhen: [
      "Full text entrance animation (use tracking-in or soft-blur-in first).",
      "Clean, luxury, or corporate scenes (use shimmer-sweep instead).",
      "Long paragraphs or multi-line text blocks (illegible during glitch window).",
      "Full scene cut transitions (use glitch-cut instead)."
    ]
  },
  "rolling-number": {
    id: "rolling-number",
    name: "RollingNumber",
    npmPackage: "@remocn/rolling-number",
    category: "data_viz",
    subCategory: "Independent Digit Odometer",
    vibe: "data",
    naturalLengthFrames: 150,
    fps: 30,
    componentPath: "@/components/remocn/rolling-number",
    propsSchema: {
      from: { type: "number", default: 0, description: "Starting integer value" },
      to: { type: "number", default: 24813, description: "Target integer value" },
      fontSize: { type: "number", default: 120, description: "Font size in pixels" },
      color: { type: "string", default: "#171717", description: "Text color CSS string" },
      speed: { type: "number", default: 1, description: "Speed multiplier" }
    },
    useWhen: [
      "Animating large integer metrics on stats/milestone slides (revenue, signups, impressions, users).",
      "Independent digit place spinning where digits settle pixel-exact.",
      "Pure numeric count-up with no currency symbols or letter units."
    ],
    dontUseWhen: [
      "Value includes symbols/units like $99 or 1.2M (use slot-machine-roll).",
      "Hand-crafted paper/scrapbook scenes (use hand-count).",
      "Small integers or counting down (use number-wheel)."
    ],
    pairedExits: ["confetti"]
  },
  "kinetic-center-build": {
    id: "kinetic-center-build",
    name: "KineticCenterBuild",
    npmPackage: "@remocn/kinetic-center-build",
    category: "typography",
    subCategory: "Word-by-word Centered Kinetic Push",
    vibe: "premium",
    naturalLengthFrames: 60,
    fps: 30,
    componentPath: "@/components/remocn/kinetic-center-build",
    propsSchema: {
      text: { type: "string", required: true, description: "Short 3-6 word phrase to build" },
      entryOffset: { type: "number", default: 88, description: "Entry offset in px for incoming word" },
      fontSize: { type: "number", default: 72, description: "Font size in pixels" },
      fontWeight: { type: "number", default: 600, description: "CSS font weight" },
      color: { type: "string", default: "#171717", description: "Text color CSS string" }
    },
    useWhen: [
      "Short hero headlines (3-6 words) building word-by-word with kinetic momentum.",
      "High-impact brand statements or chapter titles locking centered.",
      "Hero reveal moment where kinetic text push carries visual weight."
    ],
    dontUseWhen: [
      "Long text (7+ words) where line re-balance is distracting (use line-by-line-slide).",
      "Calm or quiet reveals (use micro-scale-fade or mask-reveal-up).",
      "Sequential vertical drift reveals (use per-word-crossfade)."
    ]
  },
  "typewriter": {
    id: "typewriter",
    name: "Typewriter",
    npmPackage: "@remocn/typewriter",
    category: "typography",
    subCategory: "Character-by-character Typewriter with Cursor",
    vibe: "clean",
    naturalLengthFrames: 120,
    fps: 30,
    componentPath: "@/components/remocn/typewriter",
    propsSchema: {
      text: { type: "string", required: true, description: "Text to type out" },
      cursor: { type: "boolean", default: true, description: "Render blinking cursor block" },
      charsPerSecond: { type: "number", default: 22, description: "Typing speed in characters/sec" },
      fontSize: { type: "number", default: 48, description: "Font size in pixels" },
      fontWeight: { type: "number", default: 600, description: "CSS font weight" },
      color: { type: "string", default: "#171717", description: "Text color CSS string" },
      cursorColor: { type: "string", default: "#171717", description: "Blinking cursor block color" }
    },
    useWhen: [
      "Simulating a command typed into a terminal, search bar, or input field.",
      "Titles that should feel live-authored by a human or AI agent.",
      "Deterministic timing scaled by charactersPerSecond."
    ],
    dontUseWhen: [
      "Long paragraphs or multi-line text blocks (use staggered-fade-up or line-by-line-slide).",
      "Stop-motion paper handwriting (use handwrite).",
      "High-energy weighted hero headlines (use tracking-in or kinetic-center-build)."
    ],
    pairedExits: ["terminal-simulator", "caret"]
  },
  "marker-highlight": {
    id: "marker-highlight",
    name: "MarkerHighlight",
    npmPackage: "@remocn/marker-highlight",
    category: "typography",
    subCategory: "Hand-drawn Marker Block Highlight",
    vibe: "playful",
    naturalLengthFrames: 90,
    fps: 30,
    componentPath: "@/components/remocn/marker-highlight",
    propsSchema: {
      before: { type: "string", default: "", description: "Text before the highlight" },
      highlight: { type: "string", required: true, description: "Phrase the marker draws behind" },
      after: { type: "string", default: "", description: "Text after the highlight" },
      markerColor: { type: "string", default: "#facc15", description: "Marker background fill color" },
      baseColor: { type: "string", default: "#171717", description: "Base surrounding text color" },
      highlightedTextColor: { type: "string", default: "#171717", description: "Color of highlighted phrase" },
      fontSize: { type: "number", default: 72 },
      fontWeight: { type: "number", default: 600 },
      speed: { type: "number", default: 1 }
    },
    useWhen: [
      "Highlighting a key phrase inside a sentence with a physical hand-drawn marker stroke.",
      "Vox paper scrapbook, editorial, or educational video scenes.",
      "Drawing attention using brand colors as a physical background stroke."
    ],
    dontUseWhen: [
      "Subtle color-only emphasis with no background block (use inline-highlight).",
      "Full sentence entrance animation (this is an inline emphasis tool).",
      "Minimal or sleek corporate scenes where bold paint clashes (use inline-highlight)."
    ],
    pairedExits: ["handwrite", "ink-underline"]
  },
  "strikethrough-replace": {
    id: "strikethrough-replace",
    name: "StrikethroughReplace",
    npmPackage: "@remocn/strikethrough-replace",
    category: "typography",
    subCategory: "Problem-Solution / Pricing Strike Replace",
    vibe: "clean",
    naturalLengthFrames: 120,
    fps: 30,
    componentPath: "@/components/remocn/strikethrough-replace",
    propsSchema: {
      from: { type: "string", required: true, description: "Old text to strike through" },
      to: { type: "string", required: true, description: "Replacement text revealed below" },
      lineColor: { type: "string", default: "#ff5e3a", description: "Color of the strike line" },
      fontSize: { type: "number", default: 48 },
      color: { type: "string", default: "#171717" },
      fontWeight: { type: "number", default: 600 },
      speed: { type: "number", default: 1 }
    },
    useWhen: [
      "Showing a problem being replaced by a solution (e.g., Manual editing -> Automated export).",
      "Pricing discount or plan comparison (striking out old price, revealing new price below).",
      "Editorial correction before/after narrative beats."
    ],
    dontUseWhen: [
      "No old text to cross out (use soft-blur-in or staggered-fade-up).",
      "Smooth spatial slide-deck swap (use shared-axis-y or shared-axis-z).",
      "Long multi-line sentences (keep strings short and punchy)."
    ]
  },
  "line-by-line-slide": {
    id: "line-by-line-slide",
    name: "LineByLineSlide",
    npmPackage: "@remocn/line-by-line-slide",
    category: "typography",
    subCategory: "Line-by-Line Flowing Entrance & Exit",
    vibe: "clean",
    naturalLengthFrames: 90,
    fps: 30,
    componentPath: "@/components/remocn/line-by-line-slide",
    propsSchema: {
      text: { type: "string", required: true, description: "Text split on \\n into lines" },
      distance: { type: "number", default: 48, description: "Horizontal slide distance in px" },
      fontSize: { type: "number", default: 72 },
      fontWeight: { type: "number", default: 600 },
      color: { type: "string", default: "#171717" }
    },
    useWhen: [
      "Multi-line headlines, short paragraphs, or key quotes split by newline (\\n).",
      "Horizontal reading rhythm scenes (slides in from left, exits to right).",
      "Self-contained multi-line text entrance + exit animation in a single component."
    ],
    dontUseWhen: [
      "Single-line short phrases (use mask-reveal-up or per-character-rise).",
      "Text that must hold on screen with no exit (use mask-reveal-up).",
      "Upward vertical motion (use mask-reveal-up or blur-out-up)."
    ]
  },
  "shared-axis-y": {
    id: "shared-axis-y",
    name: "SharedAxisY",
    npmPackage: "@remocn/shared-axis-y",
    category: "typography",
    subCategory: "Staircase Hard-Cut Text Swap (A → B → C)",
    vibe: "clean",
    naturalLengthFrames: 90,
    fps: 30,
    componentPath: "@/components/remocn/shared-axis-y",
    propsSchema: {
      fromText: { type: "string", required: true, description: "Outgoing phrase" },
      toText: { type: "string", required: true, description: "Incoming phrase" },
      fontSize: { type: "number", default: 72 },
      fontWeight: { type: "number", default: 600 },
      color: { type: "string", default: "#171717" }
    },
    useWhen: [
      "Swapping phrases in editorial slide-deck sequences (A → B → C chained in Sequence).",
      "Sharp, confident per-word staircase swap without blur or scale.",
      "Sequential narrative steps (Step 1 → Step 2, Old way → New way)."
    ],
    dontUseWhen: [
      "Initial entrance with no outgoing text (use short-slide-down or staggered-fade-up).",
      "Depth zoom-in narrative (use shared-axis-z).",
      "Playful spring bounce (use spring-scale-in)."
    ]
  },
  "matrix-decode": {
    id: "matrix-decode",
    name: "MatrixDecode",
    npmPackage: "@remocn/matrix-decode",
    category: "typography",
    subCategory: "Scramble Glyph Matrix Decode",
    vibe: "tech",
    naturalLengthFrames: 90,
    fps: 30,
    componentPath: "@/components/remocn/matrix-decode",
    propsSchema: {
      text: { type: "string", required: true, description: "Final target text to decode into" },
      charset: { type: "string", default: "!@#$%^&*()_+-=<>?/\\|", description: "Scramble glyph pool" },
      fontSize: { type: "number", default: 72 },
      color: { type: "string", default: "#22c55e", description: "Text color CSS string" },
      fontWeight: { type: "number", default: 600 },
      revealDuration: { type: "number", default: 60, description: "Frames to decode full text" },
      speed: { type: "number", default: 1 }
    },
    useWhen: [
      "Hacker, terminal, security, or cyberpunk scenes requiring glyph scramble decryption.",
      "Deciphering short codes, API tokens, passwords, or technical labels in real time.",
      "Procedural data-driven tech reveals."
    ],
    dontUseWhen: [
      "General human sentences or marketing copy (use typewriter).",
      "Premium or editorial scenes (use focus-blur-resolve or soft-blur-in).",
      "Long paragraphs (keep text short, under 15 chars)."
    ]
  },
  "paper-sticker": {
    id: "paper-sticker",
    name: "PaperSticker",
    npmPackage: "@remocn/paper-sticker",
    category: "documentary",
    subCategory: "Taped Paper Sticker Callout Prop",
    vibe: "paper",
    naturalLengthFrames: 120,
    fps: 30,
    componentPath: "@/components/remocn/paper-sticker",
    propsSchema: {
      children: { type: "ReactNode", required: true, description: "Contents inside paper chip" },
      at: { type: "number", default: 0, description: "Frame the slap animation starts" },
      seed: { type: "string", default: "sticker", description: "Seed for fixed tilt and wobble" },
      padding: { type: "string", default: "10px 16px" },
      background: { type: "string", default: "#fbfaf6", description: "Paper background color" },
      borderColor: { type: "string", default: "rgba(38,36,44,0.55)" },
      maxTilt: { type: "number", default: 2.6, description: "Max tilt in degrees (0 for straight row)" },
      step: { type: "number", default: 3, description: "Frames per stop-motion pose" }
    },
    useWhen: [
      "Short labels, chips, tech tags, or callout notes as physical taped paper in paper/documentary scenes.",
      "Staggering multiple tags landing one after another by mapping at={i * 6} with unique seeds.",
      "Vox documentary paper scrapbook layouts."
    ],
    dontUseWhen: [
      "Wrapping in paper-wobble (wobble is already built-in, double-wrapping shakes twice).",
      "Full media frame with handwritten caption (use polaroid).",
      "Interactive digital UI simulation (this is a physical paper prop)."
    ]
  },
  "check-list": {
    id: "check-list",
    name: "CheckList",
    npmPackage: "@remocn/check-list",
    category: "documentary",
    subCategory: "Handwritten Checklist with Check & Strike-through",
    vibe: "paper",
    naturalLengthFrames: 123,
    fps: 30,
    componentPath: "@/components/remocn/check-list",
    propsSchema: {
      items: { type: "array", required: true, description: "(string | { text: string; checked?: boolean })[]" },
      width: { type: "number", required: true, description: "Explicit width in pixels required" },
      fontSize: { type: "number", default: 40 },
      color: { type: "string", default: "#26242c" },
      boxColor: { type: "string", default: "#26242c" },
      tickColor: { type: "string", default: "#6f7f35", description: "Green ink for ticks and strike lines" },
      delay: { type: "number", default: 0 },
      itemGap: { type: "number", description: "Frames between item starts while writing" },
      closeGap: { type: "number", description: "Frames between ticks in phase 2" },
      strokeWidth: { type: "number", default: 3 },
      step: { type: "number", default: 3 }
    },
    useWhen: [
      "Feature announcements, done-item checklists, product roadmap updates on paper/scrapbook scenes.",
      "Showing completed tasks with green tick marks & line-strike payoff.",
      "Feature comparisons where checked items get struck and unchecked items remain clean."
    ],
    dontUseWhen: [
      "Live progress indicator / CI-CD pipeline (use progress-steps).",
      "Multi-line wrapping per item (one label per line).",
      "Digital corporate UI dashboard (use progress-steps)."
    ],
    pairedExits: ["paper-wobble", "handwrite"]
  },
  "reel": {
    id: "reel",
    name: "Reel",
    npmPackage: "@remocn/reel",
    category: "containers",
    subCategory: "Center-out Mask Stacked Image Reel",
    vibe: "clean",
    naturalLengthFrames: 160,
    fps: 30,
    componentPath: "@/components/remocn/reel",
    propsSchema: {
      images: { type: "array", required: true, description: "Ordered image URLs to bloom in sequence" },
      width: { type: "number", default: 1180, description: "Card width in pixels" },
      height: { type: "number", default: 676, description: "Card height in pixels" },
      radius: { type: "number", default: 16, description: "Corner radius in pixels" },
      step: { type: "number", default: 20, description: "Frames between successive reveals" },
      reveal: { type: "number", default: 13, description: "Frames for mask to open" },
      objectPosition: { type: "string", default: "top" },
      background: { type: "string", default: "#050506" }
    },
    useWhen: [
      "Showing a sequence of screenshots or product shots blooming open over one another.",
      "Product showcase feature view montage inside a sleek centered frame.",
      "Rhythmic visual B-roll image stacks."
    ],
    dontUseWhen: [
      "Single framed photo (use polaroid).",
      "Infinite scrolling wall or strip (use infinite-marquee or perspective-marquee)."
    ]
  },
  "animated-bar-chart": {
    id: "animated-bar-chart",
    name: "AnimatedBarChart",
    npmPackage: "@remocn/animated-bar-chart",
    category: "data_viz",
    subCategory: "Staggered Baseline Spring Bar Chart",
    vibe: "data",
    naturalLengthFrames: 90,
    fps: 30,
    componentPath: "@/components/remocn/animated-bar-chart",
    propsSchema: {
      data: { type: "array", default: [35, 60, 45, 80, 55, 70, 90, 65], description: "Bar values auto-scaled to available height" },
      labels: { type: "array", description: "Optional strings under each bar" },
      width: { type: "number", default: 1000, description: "Chart width in pixels" },
      height: { type: "number", default: 500, description: "Chart height in pixels" },
      barColor: { type: "string", default: "#0ea5e9", description: "Bar fill color" },
      gap: { type: "number", default: 16, description: "Gap between bars in pixels" },
      staggerFrames: { type: "number", default: 6, description: "Stagger delay per bar entrance in frames" }
    },
    useWhen: [
      "Showing comparative categorical metrics (feature usage, benchmark scores, plan distribution).",
      "Business KPI & data reveal beats.",
      "Datasets with a clear winner bar where staggered spring draws focus to the tallest bar."
    ],
    dontUseWhen: [
      "Continuous time-series trend line (use animated-line-chart).",
      "Sequential workflow or pipeline stages (use progress-steps).",
      "Single metric counter (use rolling-number or number-wheel)."
    ]
  },
  "slide-swap": {
    id: "slide-swap",
    name: "SlideSwapScenes",
    npmPackage: "@remocn/slide-swap",
    category: "transitions",
    subCategory: "Shove & Spring Scene-to-Scene Sequencer",
    vibe: "clean",
    naturalLengthFrames: 210,
    fps: 30,
    componentPath: "@/components/remocn/slide-swap",
    propsSchema: {
      scenes: { type: "array", required: true, description: "Array of { name, durationInFrames, content }" },
      axis: { type: "string", default: "x", description: "x for horizontal shove, y for vertical push" },
      bg: { type: "string", description: "Constant canvas background color" },
      loop: { type: "boolean", default: false, description: "Whether scenes loop continuously" }
    },
    useWhen: [
      "Scene-to-scene transitions with zero overlap where outgoing scene is pushed off before incoming scene springs in.",
      "Constant canvas color across a run of short claim/feature scenes.",
      "Horizontal (axis=x) or vertical (axis=y) directional momentum across multiple scenes."
    ],
    dontUseWhen: [
      "Background color changes between scenes (use spring-settle).",
      "Dropping inside Remotion TransitionSeries (use whip-pan or push-through).",
      "Swapping single text phrase instead of full scene (use shared-axis-y)."
    ]
  },
  "displacement": {
    id: "displacement",
    name: "displacement",
    npmPackage: "@remocn/displacement",
    category: "transitions",
    subCategory: "Canvas Grid Shear & Chromatic Aberration Tile Displacement",
    vibe: "tech",
    naturalLengthFrames: 18,
    fps: 30,
    componentPath: "@/components/remocn/displacement",
    propsSchema: {
      grid: { type: "number", default: 60, description: "Cells spanning width of frame" },
      cellAspect: { type: "number", default: 1, description: "Width-to-height ratio of cells" },
      shift: { type: "number", default: 1, description: "Peak shear travel distance in cells" },
      aberration: { type: "number", default: 1, description: "RGB color separation on displaced cells" },
      grain: { type: "number", default: 0.5, description: "Film grain opacity over displaced cells" },
      stagger: { type: "number", default: 0.45, description: "Stagger timing between cell shears" }
    },
    useWhen: [
      "High-energy tech, code, terminal, or hardware interface transitions where picture is knocked out of register.",
      "Fast 18-frame cuts between technical or cyberpunk graphic scenes."
    ],
    dontUseWhen: [
      "Tearing concentrated in horizontal bands with a hard cut (use glitch-cut).",
      "Calm, editorial, or luxury scenes (use zoom-blur)."
    ]
  },
  "page-turn": {
    id: "page-turn",
    name: "pageTurn",
    npmPackage: "@remocn/page-turn",
    category: "documentary",
    subCategory: "Stop-Motion Notebook Page Turn Transition",
    vibe: "paper",
    naturalLengthFrames: 128,
    fps: 30,
    componentPath: "@/components/remocn/page-turn",
    propsSchema: {
      angle: { type: "number", default: -7, description: "Rotation in deg at full lift" },
      origin: { type: "string", default: "18% 100%", description: "CSS transform-origin pivot" },
      poses: { type: "number", default: 8, description: "Discrete stop-motion poses" }
    },
    useWhen: [
      "Act breaks in paper or scrapbook stop-motion videos where current page lifts to reveal scene underneath.",
      "Vox paper documentary notebook page flips."
    ],
    dontUseWhen: [
      "Smooth digital UI cuts (use whip-pan or push-through).",
      "Entering scene needing its own separate entrance animation."
    ],
    pairedExits: ["paper-wobble", "handwrite", "check-list"]
  },
  "whip-pan": {
    id: "whip-pan",
    name: "whipPan",
    npmPackage: "@remocn/whip-pan",
    category: "transitions",
    subCategory: "Camera Whip Pan with Velocity Motion Blur",
    vibe: "playful",
    naturalLengthFrames: 26,
    fps: 30,
    componentPath: "@/components/remocn/whip-pan",
    propsSchema: {
      direction: { type: "string", default: "left", description: "Whip direction: left, right, up, or down" },
      blur: { type: "number", default: 24, description: "Peak velocity motion blur in px" }
    },
    useWhen: [
      "Workhorse default kinetic directional cut for fast feature-to-feature jumps, montages, and tech demos.",
      "Peer scenes in a sequence moving sideways or vertically."
    ],
    dontUseWhen: [
      "Calm or contemplative moments (use focus-pull).",
      "More than 3 identical whips in a row (alternate directions or use fade-through)."
    ]
  },
  "spring-settle": {
    id: "spring-settle",
    name: "SpringSettleScenes",
    npmPackage: "@remocn/spring-settle",
    category: "transitions",
    subCategory: "Background-Crossfading Spring Settle Sequencer",
    vibe: "premium",
    naturalLengthFrames: 213,
    fps: 30,
    componentPath: "@/components/remocn/spring-settle",
    propsSchema: {
      scenes: { type: "array", required: true, description: "Array of { name, bg, durationInFrames, content }" },
      loop: { type: "boolean", default: false, description: "Whether scene sequence loops" }
    },
    useWhen: [
      "Background color changes from scene to scene cleanly inside empty gap frame.",
      "Pitch deck or claim scenes where items land in sequence via SpringSettleItem.",
      "Apple-style premium presentation transitions."
    ],
    dontUseWhen: [
      "Directional shoving momentum between scenes (use slide-swap).",
      "Dropping inside Remotion TransitionSeries (use push-through or zoom-blur)."
    ]
  },
  "glitch-cut": {
    id: "glitch-cut",
    name: "glitchCut",
    npmPackage: "@remocn/glitch-cut",
    category: "transitions",
    subCategory: "Torn Glitch Artifact Hard Cut with Channel Split",
    vibe: "tech",
    naturalLengthFrames: 12,
    fps: 30,
    componentPath: "@/components/remocn/glitch-cut",
    propsSchema: {
      intensity: { type: "number", default: 1, description: "Scales horizontal slice/block displacement" },
      slices: { type: "number", default: 24, description: "Horizontal slice count" },
      rgbSplit: { type: "number", default: 1, description: "Chromatic red/cyan separation" },
      blockNoise: { type: "number", default: 0.6, description: "Corrupted block leak share" }
    },
    useWhen: [
      "Fast 8 to 14 frame cuts in tech, developer, terminal, or hardware video demos reading as broadcast artifacts.",
      "Hard cuts between visually unrelated technical scenes requiring a punchy glitch tear."
    ],
    dontUseWhen: [
      "Only a headline should glitch while background stays intact (use rgb-glitch-text).",
      "Calm or general-purpose cuts (use zoom-blur)."
    ]
  },
  "particle-dissolve": {
    id: "particle-dissolve",
    name: "particleDissolve",
    npmPackage: "@remocn/particle-dissolve",
    category: "transitions",
    subCategory: "Luminance-Driven Particle Dust Shader Dissolve",
    vibe: "tech",
    naturalLengthFrames: 36,
    fps: 30,
    componentPath: "@/components/remocn/particle-dissolve",
    propsSchema: {
      particleSize: { type: "number", default: 4, description: "Dust grain size in pixels" },
      scatter: { type: "number", default: 0.08, description: "Max wander distance as fraction of frame" },
      shimmer: { type: "number", default: 0.6, description: "Airborne speck light catch jitter" },
      aberration: { type: "number", default: 0.5, description: "RGB color separation on specks" },
      direction: { type: "string", default: "reveal", description: "reveal, up, down, left, or right" },
      stagger: { type: "number", default: 0.55, description: "Stagger delay across dust specks" }
    },
    useWhen: [
      "Technical, AI, sci-fi, or logo reveals where scene disintegrates into dust and reassembles.",
      "Bright text/logos on dark backgrounds where highlights disintegrate first."
    ],
    dontUseWhen: [
      "Texture over plain crossfade (use grain-dissolve).",
      "Organic liquid/smoke flow breakup (use perlin-dissolve)."
    ]
  },
  "paper-wobble": {
    id: "paper-wobble",
    name: "PaperWobble",
    npmPackage: "@remocn/paper-wobble",
    category: "documentary",
    subCategory: "Per-Pose Stop-Motion Reshoot Jitter Wrapper",
    vibe: "paper",
    naturalLengthFrames: 90,
    fps: 30,
    componentPath: "@/components/remocn/paper-wobble",
    propsSchema: {
      children: { type: "ReactNode", required: true, description: "Content to wobble" },
      seed: { type: "string", default: "wobble", description: "Unique seed per separate object on desk" },
      amp: { type: "number", default: 1.4, description: "Max offset in pixels per axis" },
      rotAmp: { type: "number", default: 0.35, description: "Max rotation in degrees" },
      step: { type: "number", default: 3, description: "Frames per stop-motion pose" }
    },
    useWhen: [
      "Headlines, cards, cutout photos, or evidence chips in paper/scrapbook scenes needing hand-placed stop-motion jitter.",
      "Pairing with handwrite or check-list."
    ],
    dontUseWhen: [
      "Component already carries built-in jitter like paper-sticker (doubles shake).",
      "Clean digital UI simulations or code blocks.",
      "Smooth continuous camera floating (use drift)."
    ],
    pairedExits: ["handwrite", "check-list", "page-turn"]
  },
  "confetti": {
    id: "confetti",
    name: "Confetti",
    npmPackage: "@remocn/confetti",
    category: "overlays",
    subCategory: "Deterministic Radial Seeded Confetti Burst",
    vibe: "playful",
    naturalLengthFrames: 90,
    fps: 30,
    componentPath: "@/components/remocn/confetti",
    propsSchema: {
      particleCount: { type: "number", default: 140, description: "Number of confetti pieces" },
      colors: { type: "array", description: "Color palette strings" },
      originX: { type: "number", default: 0.5, description: "Normalized horizontal origin" },
      originY: { type: "number", default: 0.5, description: "Normalized vertical origin" },
      startFrame: { type: "number", default: 0, description: "Frame burst fires on" },
      lifetime: { type: "number", default: 90, description: "Duration in frames" },
      power: { type: "number", default: 17, description: "Initial launch velocity" },
      gravity: { type: "number", default: 0.45, description: "Downward gravity force" },
      size: { type: "number", default: 13, description: "Confetti piece size in px" },
      seed: { type: "number", default: 1, description: "PRNG seed for frame stability" }
    },
    useWhen: [
      "Milestone moments, product launches, count-up payoffs, success screens, or celebratory reveals.",
      "Deterministic frame-stable particle bursts that fire on exact frames."
    ],
    dontUseWhen: [
      "Clean minimal corporate videos (confetti breaks professional tone).",
      "Looping ambient particle background (use shader-dot-orbit)."
    ]
  },
  "crumple-toss": {
    id: "crumple-toss",
    name: "CrumpleToss",
    npmPackage: "@remocn/crumple-toss",
    category: "documentary",
    subCategory: "Physical Paper Card Crumple & Discard Exit",
    vibe: "paper",
    naturalLengthFrames: 27,
    fps: 30,
    componentPath: "@/components/remocn/crumple-toss",
    propsSchema: {
      children: { type: "ReactNode", required: true, description: "Card or element to crumple" },
      width: { type: "number", required: true, description: "Explicit width in pixels" },
      height: { type: "number", required: true, description: "Explicit height in pixels" },
      at: { type: "number", required: true, description: "Frame crumple starts" },
      segments: { type: "number", default: 9, description: "Wedges paper tears into" },
      layers: { type: "number", default: 2, description: "Radial cuts per wedge for zigzag creases" },
      randomness: { type: "number", default: 0.6, description: "Fold randomness variance" },
      crumpleSteps: { type: "number", default: 4, description: "Poses spent crushing" },
      tossSteps: { type: "number", default: 5, description: "Poses spent in flight" },
      direction: { type: "number", default: -35, description: "Throw angle in degrees" },
      distance: { type: "number", default: 900, description: "Arc distance scale" },
      spin: { type: "number", default: 220, description: "Flight spin rotation in degrees" },
      crushTo: { type: "number", default: 0.34, description: "Crush scale ratio" },
      seed: { type: "string", default: "toss", description: "PRNG seed" },
      step: { type: "number", default: 3, description: "Frames per pose" }
    },
    useWhen: [
      "Discarding old solutions/prices/plans on paper/scrapbook before/after beats.",
      "Crushing an element into a paper wad to reveal new content stacked behind it."
    ],
    dontUseWhen: [
      "General element exit in clean corporate UI (use fade).",
      "Scene-level exit that replaces whole frame (use page-turn)."
    ],
    pairedExits: ["paper-wobble", "handwrite", "page-turn"]
  },
  "tv-power-off": {
    id: "tv-power-off",
    name: "TvPowerOff",
    npmPackage: "@remocn/tv-power-off",
    category: "filters",
    subCategory: "CRT CRT Tube Power Down / Collapse Filter",
    vibe: "tech",
    naturalLengthFrames: 18,
    fps: 30,
    componentPath: "@/components/remocn/tv-power-off",
    propsSchema: {
      durationInFrames: { type: "number", default: 18, description: "Collapse duration" },
      delay: { type: "number", default: 0, description: "Frames before power cut starts" },
      gain: { type: "number", default: 1, description: "Brightness blowout as lines collapse" },
      afterglow: { type: "number", default: 1, description: "Phosphor halo bleed" },
      phosphor: { type: "string", default: "#d8ecff", description: "CRT phosphor glow color" }
    },
    useWhen: [
      "Ending a tech scene, terminal session, or retro video like turning off a tube TV/monitor.",
      "Hard punctuation end beat before cutting to black."
    ],
    dontUseWhen: [
      "Sustained CRT screen look across entire scene (use crt-screen).",
      "Transition between two visible scenes (use glitch-cut).",
      "Leaving frame transparent over a backdrop (this leaves opaque black)."
    ]
  },
  "infinite-bento-pan": {
    id: "infinite-bento-pan",
    name: "InfiniteBentoPan",
    npmPackage: "@remocn/infinite-bento-pan",
    category: "containers",
    subCategory: "Hypnotic Diagonal Camera Glide Over Bento Grid Cards",
    vibe: "data",
    naturalLengthFrames: 300,
    fps: 30,
    componentPath: "@/components/remocn/infinite-bento-pan",
    propsSchema: {
      panSpeed: { type: "number", default: 1, description: "Diagonal camera travel multiplier" },
      accentColor: { type: "string", default: "#7c3aed", description: "Chart, bar fill, and accent color" },
      speed: { type: "number", default: 1, description: "Global animation speed multiplier" }
    },
    useWhen: [
      "Ambient establishing shot demonstrating SaaS platform scale ('a lot is happening here').",
      "High-end backdrop layer behind titles or logos with dozens of bento cards gliding past."
    ],
    dontUseWhen: [
      "Viewer needs to read exact data numbers (use animated-bar-chart or animated-line-chart).",
      "Camera needs to dwell on a specific card.",
      "Horizontal looping strip (use infinite-marquee or perspective-marquee)."
    ]
  },
  "ecosystem-constellation": {
    id: "ecosystem-constellation",
    name: "EcosystemConstellation",
    npmPackage: "@remocn/ecosystem-constellation",
    category: "containers",
    subCategory: "Central Product Hub with Orbiting Integration Satellites & Data Pulses",
    vibe: "tech",
    naturalLengthFrames: 240,
    fps: 30,
    componentPath: "@/components/remocn/ecosystem-constellation",
    propsSchema: {
      satelliteCount: { type: "number", default: 6, description: "Orbiting integration satellites (clamped 3..8)" },
      centerLabel: { type: "string", default: "V", description: "Short label inside central hub" },
      accentColor: { type: "string", default: "#a855f7", description: "Hub, glow, and connection line color" },
      speed: { type: "number", default: 1, description: "Orbit timing multiplier" }
    },
    useWhen: [
      "Demonstrating product integrations ('we plug into your whole toolchain').",
      "Central hub product ringed by orbiting satellites with pulsing connection lines."
    ],
    dontUseWhen: [
      "Data packets moving along pipes between named nodes (use data-flow-pipes).",
      "Static brand logos that arrive and hold without orbiting (use logo-enter)."
    ]
  }
};
