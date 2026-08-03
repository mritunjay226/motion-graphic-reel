// ─── Execution Plan Types ────────────────────────────────────────────────────
// Strict TypeScript interfaces matching the execution plan JSON schema.

// ─── Project Meta ────────────────────────────────────────────────────────────

export interface ProjectMeta {
  title: string;
  slug: string;
  fps: number;
  width: number;
  height: number;
  totalDurationFrames: number;
  totalDurationSeconds: number;
  aspectRatio: string;
  colorGrade: string;
  fontStack: string[];
}

// ─── Audio Pipeline ──────────────────────────────────────────────────────────

export interface VoiceConfig {
  provider: "cartesia" | "elevenlabs" | string;
  voiceId: string;
  voiceName: string;
  modelId: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
  outputFormat?: string;
  language?: string;
  sampleRate?: number;
}

export interface BgMusicTrack {
  name: string;
  url: string;
  volume: number;
  fadeInFrames: number;
  fadeOutFrames: number;
}

export interface SfxEvent {
  frame: number;
  type: string;
  sfxUrl: string;
  volume: number;
}

export interface AudioPipeline {
  narrationScript: string;
  voiceConfig: VoiceConfig;
  bgMusicTrack: BgMusicTrack;
  sfxEvents: SfxEvent[];
}

// ─── Film Treatment ──────────────────────────────────────────────────────────

export interface FilmTreatmentConfig {
  grainOpacity: number;
  grainBlendMode: string;
  grainAnimated: boolean;
  grainFps: number;
  scanlines: boolean;
  scanlineWidth: number;
  scanlineOpacity: number;
  scanlineBlendMode: string;
  vignette: number;
  vignetteBlendMode: string;
  cornerBlur: boolean;
  cornerBlurRadius: number;
  cornerBlurSpread: number;
  colorGradeLut: string;
  letterboxOpacity: number;
}

// ─── Whisper Tokens ──────────────────────────────────────────────────────────

export interface WhisperToken {
  word: string;
  startMs: number;
  endMs: number;
  startFrame: number;
  endFrame: number;
}

// ─── Asset Prompts ───────────────────────────────────────────────────────────

export interface AssetPrompts {
  backgroundPrompt: string;
  foregroundCutoutPrompt: string;
  propsOverlays: string[];
}

// ─── ImageKit URLs ───────────────────────────────────────────────────────────

export interface ImageKitUrls {
  background: string;
  foreground: string;
  props: string[];
}

// ─── Animation Rules ─────────────────────────────────────────────────────────

export interface InterpolationRange {
  inputRange: number[];
  outputRange: number[];
  easing?: string;
  note?: string;
  loop?: boolean;
}

export interface SpringConfig {
  damping: number;
  stiffness: number;
  mass?: number;
}

export interface EntranceConfig {
  type: string;
  triggerFrame: number;
  springConfig: SpringConfig;
  fromScale?: number;
  toScale?: number;
  fromTranslateX?: number;
  toTranslateX?: number;
  fromTranslateY?: number;
  toTranslateY?: number;
  fromOpacity?: number;
  toOpacity?: number;
  fromRotation?: number;
  toRotation?: number;
  durationFrames?: number;
  swingAmplitude?: number;
  swingDecayFrames?: number;
  glowColor?: string;
  glowExpand?: InterpolationRange;
}

export interface BoilConfig {
  rotationOscillation: {
    minDeg: number;
    maxDeg: number;
    periodFrames: number;
  };
  scaleOscillation: {
    minScale: number;
    maxScale: number;
    periodFrames: number;
  };
}

export interface ShakeEffect {
  triggerFrame: number;
  amplitude: number;
  durationFrames: number;
  frequency: number;
}

export interface ProjectedShadowConfig {
  enabled: boolean;
  skewX?: string;
  translateY?: number;
  opacity?: number;
  blur?: number;
  color?: string;
  note?: string;
}

export interface PropAnimationConfig {
  propIndex: number;
  motion: string;
  startFrame: number;
  blendMode?: string;
  opacity?: number | InterpolationRange;
  scale?: InterpolationRange;
  translateX?: InterpolationRange;
  translateY?: InterpolationRange;
  springConfig?: SpringConfig;
  fromTranslateX?: number;
  toTranslateX?: number;
  fromTranslateY?: number;
  toTranslateY?: number;
  fromScale?: number;
  toScale?: number;
  fromOpacity?: number;
  toOpacity?: number;
  fromRotation?: number;
  toRotation?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  gravity?: number;
  rotationRange?: number[];
  velocityRange?: { x: number[]; y: number[] };
  shakeAfterImpact?: { amplitude: number; decayFrames: number };
  screenShake?: { amplitude: number; decayFrames: number };
  position?: Record<string, unknown>;
  rotationPerFrame?: number;
  loop?: boolean;
  pulseGlow?: { color: string; periodFrames: number; maxSpread: number };
  spread?: number;
}

export interface OverlayFxConfig {
  type: string;
  src: string;
  blendMode: string;
  opacity: number;
  loop: boolean;
}

export interface TransitionOutConfig {
  type: string;
  triggerFrame: number;
  durationFrames?: number;
  motionBlurSamples?: number;
  zoomTarget?: number;
  directionDeg?: number;
  easing?: string;
  flashColor?: string;
  flashOpacity?: number;
  flashDurationFrames?: number;
}

export interface BackgroundMotion {
  type: string;
  scaleInterpolation: InterpolationRange;
  panX?: InterpolationRange;
  panY?: InterpolationRange;
  brightnessShift?: InterpolationRange;
  desaturation?: InterpolationRange;
}

export interface ForegroundMotion {
  type: string;
  entrance: EntranceConfig;
  boil: BoilConfig;
  scaleDrift: InterpolationRange;
  shakeEffect?: ShakeEffect;
}

export interface AnimationRules {
  backgroundMotion: BackgroundMotion;
  foregroundMotion: ForegroundMotion;
  projectedShadow: ProjectedShadowConfig;
  propsAnimations: PropAnimationConfig[];
  overlayFx: OverlayFxConfig;
  transitionOut: TransitionOutConfig;
}

// ─── Kinetic Captions ────────────────────────────────────────────────────────

export interface KineticCaptionConfig {
  style: string;
  position: {
    bottom: number;
    horizontalAlign: string;
  };
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
  highlightWords: string[];
  highlightColor: string;
  highlightScale: number;
  springConfig: SpringConfig;
  shadowConfig: {
    color: string;
    blur: number;
    offsetY: number;
  };
}

// ─── Scene ───────────────────────────────────────────────────────────────────

export interface Scene {
  sceneId: number;
  sceneTitle: string;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
  durationSeconds: number;
  narrationLine: string;
  whisperTokens: WhisperToken[];
  assetPrompts: AssetPrompts;
  imageKitUrls: ImageKitUrls;
  animationRules: AnimationRules;
  kineticCaptions: KineticCaptionConfig;
}

// ─── Global Animation Defaults ───────────────────────────────────────────────

export interface GlobalAnimationDefaults {
  characterBoil: BoilConfig;
  projectedShadow: Omit<ProjectedShadowConfig, 'enabled'>;
  parallaxDepthRatio: {
    background: number;
    foreground: number;
    props: number;
  };
  kineticCaptionDefaults: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    textColor: string;
    strokeColor: string;
    strokeWidth: number;
    springConfig: SpringConfig;
  };
  transitionDefaults: {
    whipZoomDuration: number;
    motionBlurSamples: number;
    defaultZoomTarget: number;
  };
}

// ─── Render Config ───────────────────────────────────────────────────────────

export interface RenderConfig {
  codec: string;
  pixelFormat: string;
  crf: number;
  audioBitrate: string;
  imageFormat: string;
  jpegQuality: number;
  concurrency: number;
  everyNthFrame: number;
  outputFile: string;
}

// ─── Root Execution Plan ─────────────────────────────────────────────────────

export interface ExecutionPlan {
  projectMeta: ProjectMeta;
  audioPipeline: AudioPipeline;
  filmTreatment: FilmTreatmentConfig;
  scenes: Scene[];
  globalAnimationDefaults: GlobalAnimationDefaults;
  renderConfig: RenderConfig;
}
