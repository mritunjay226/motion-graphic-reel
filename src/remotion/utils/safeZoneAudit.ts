/**
 * 9:16 Social Platform Safe Zone Boundaries & Audit Utility
 *
 * Defines the critical exclusion zones for TikTok, Instagram Reels, and YouTube Shorts
 * to prevent UI overlays (like buttons, audio tickers, search headers, caption boxes)
 * from occluding core motion graphic typography, metaphors, and data visualizers.
 *
 * Canvas Size: 1080px (Width) x 1920px (Height)
 */

export interface SafeZoneBoundary {
  top: number;       // In px from top edge
  bottom: number;    // In px from top edge (e.g. 1660px means bottom 260px is unsafe)
  left: number;      // In px from left edge
  right: number;     // In px from left edge (e.g. 940px means right 140px is unsafe)
}

export type SocialPlatform = "all" | "tiktok" | "instagram_reels" | "youtube_shorts";

export const SOCIAL_SAFE_ZONES: Record<SocialPlatform, SafeZoneBoundary> = {
  // Master aggregate: union of all worst-case platform danger zones
  all: {
    top: 180,
    bottom: 1660,
    left: 48,
    right: 932,
  },
  tiktok: {
    top: 170,
    bottom: 1640,
    left: 40,
    right: 930,
  },
  instagram_reels: {
    top: 160,
    bottom: 1680,
    left: 48,
    right: 940,
  },
  youtube_shorts: {
    top: 150,
    bottom: 1660,
    left: 40,
    right: 935,
  },
};

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SafeZoneAuditResult {
  isSafe: boolean;
  violations: string[];
}

/**
 * Validates whether a rectangular bounding box sits 100% within the platform safe zones.
 */
export function auditRectSafeZone(
  label: string,
  rect: Rect,
  platform: SocialPlatform = "all"
): SafeZoneAuditResult {
  const bounds = SOCIAL_SAFE_ZONES[platform];
  const violations: string[] = [];

  const rectRight = rect.x + rect.width;
  const rectBottom = rect.y + rect.height;

  if (rect.y < bounds.top) {
    violations.push(
      `"${label}" extends into TOP danger zone (y: ${rect.y}px < safeTop: ${bounds.top}px by ${bounds.top - rect.y}px)`
    );
  }

  if (rectBottom > bounds.bottom) {
    violations.push(
      `"${label}" extends into BOTTOM danger zone (bottom: ${rectBottom}px > safeBottom: ${bounds.bottom}px by ${rectBottom - bounds.bottom}px)`
    );
  }

  if (rect.x < bounds.left) {
    violations.push(
      `"${label}" extends into LEFT danger zone (x: ${rect.x}px < safeLeft: ${bounds.left}px by ${bounds.left - rect.x}px)`
    );
  }

  if (rectRight > bounds.right) {
    violations.push(
      `"${label}" extends into RIGHT engagement cluster danger zone (right: ${rectRight}px > safeRight: ${bounds.right}px by ${rectRight - bounds.right}px)`
    );
  }

  return {
    isSafe: violations.length === 0,
    violations,
  };
}
