import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";

export interface PipelineNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: "client" | "server" | "database" | "ai" | "cloud";
  status?: "pending" | "processing" | "completed";
}

export interface NodePipelineFlowProps {
  nodes?: PipelineNode[];
  startFrame?: number;
  durationFrames?: number;
  glowColor?: string;
  themeMode?: "dark" | "light";
  style?: React.CSSProperties;
}

const defaultNodes: PipelineNode[] = [
  { id: "1", label: "Client Request", sublabel: "Next.js App Router", icon: "client" },
  { id: "2", label: "API Edge Gateway", sublabel: "Global Mesh Router", icon: "server" },
  { id: "3", label: "Vector Search & AI", sublabel: "Gemini 2.5 Flash", icon: "ai" },
  { id: "4", label: "Realtime Sync", sublabel: "Convex Database", icon: "database" },
];

/**
 * NodePipelineFlow
 *
 * Technical Cloud & SaaS Architecture Flow Pipeline (Stripe / Vercel style).
 * Renders connected service cards with flowing glowing energy packets and reactive status pings.
 */
export const NodePipelineFlow: React.FC<NodePipelineFlowProps> = ({
  nodes = defaultNodes,
  startFrame = 10,
  durationFrames = 90,
  glowColor = "#06B6D4",
  themeMode = "dark",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = themeMode === "dark";
  const localFrame = Math.max(0, frame - startFrame);

  // Overall progression of the data packet across the entire chain (0 to nodes.length - 1)
  const totalSegments = Math.max(1, nodes.length - 1);
  const segmentDuration = durationFrames / totalSegments;

  const currentSegmentFloat = Math.min(totalSegments, localFrame / segmentDuration);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        padding: "24px",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {nodes.map((node, i) => {
        const isCompleted = currentSegmentFloat >= i;
        const isCurrentActive = Math.floor(currentSegmentFloat) === i && currentSegmentFloat < i + 1;

        const isLast = i === nodes.length - 1;

        // Progress of energy packet along the wire to next node (0 to 1)
        const wireProgress = interpolate(
          localFrame,
          [i * segmentDuration, (i + 1) * segmentDuration],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.2, 1) }
        );

        return (
          <div key={node.id} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* ── SERVICE CARD ── */}
            <div
              style={{
                width: "100%",
                maxWidth: "680px",
                backgroundColor: isDark ? (isCurrentActive ? "#18181B" : "#121215") : "#FFFFFF",
                border: isCurrentActive
                  ? `1.5px solid ${glowColor}`
                  : isCompleted
                  ? "1px solid #10B981"
                  : isDark ? "1px solid #27272A" : "1px solid #E4E4E7",
                borderRadius: "16px",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: isCurrentActive
                  ? `0 0 35px ${glowColor}33, 0 10px 25px rgba(0,0,0,0.3)`
                  : "0 8px 20px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
                zIndex: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Node Status Indicator Icon */}
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    backgroundColor: isCurrentActive ? glowColor : isCompleted ? "#10B981" : isDark ? "#27272A" : "#F4F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "14px",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  {isCompleted && !isCurrentActive ? "✓" : i + 1}
                </div>

                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: isDark ? "#FAFAFA" : "#09090B" }}>
                    {node.label}
                  </div>
                  {node.sublabel && (
                    <div style={{ fontSize: "12px", color: isDark ? "#A1A1AA" : "#71717A", marginTop: "2px" }}>
                      {node.sublabel}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Pill Badge */}
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  backgroundColor: isCurrentActive
                    ? `${glowColor}22`
                    : isCompleted
                    ? "rgba(16, 185, 129, 0.15)"
                    : isDark ? "#27272A" : "#F4F4F6",
                  color: isCurrentActive ? glowColor : isCompleted ? "#10B981" : isDark ? "#71717A" : "#A1A1AA",
                  border: isCurrentActive ? `1px solid ${glowColor}55` : "1px solid transparent",
                  letterSpacing: "0.5px",
                }}
              >
                {isCurrentActive ? "STREAMING" : isCompleted ? "COMPLETED" : "WAITING"}
              </div>
            </div>

            {/* ── VERTICAL SVG CONNECTOR WIRE & FLOWING ENERGY PACKET ── */}
            {!isLast && (
              <div style={{ position: "relative", width: "4px", height: "32px", margin: "0 auto" }}>
                {/* Background cable wire */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: isDark ? "#27272A" : "#E4E4E7",
                    borderRadius: "2px",
                  }}
                />

                {/* Lit cable segment */}
                {currentSegmentFloat > i && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${Math.min(100, wireProgress * 100)}%`,
                      backgroundColor: glowColor,
                      boxShadow: `0 0 10px ${glowColor}`,
                      borderRadius: "2px",
                    }}
                  />
                )}

                {/* Flowing Energy Packet Light Pulse */}
                {isCurrentActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: `${wireProgress * 100}%`,
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#FFFFFF",
                      transform: "translate(-50%, -50%)",
                      boxShadow: `0 0 16px ${glowColor}, 0 0 8px #FFFFFF`,
                      zIndex: 30,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
