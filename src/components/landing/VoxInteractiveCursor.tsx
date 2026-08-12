"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function VoxInteractiveCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Smooth Spring Physics for Cinematic Cursor Tracking
  const springX = useSpring(-100, { stiffness: 450, damping: 26 });
  const springY = useSpring(-100, { stiffness: 450, damping: 26 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX);
      springY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [springX, springY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block select-none">
      {/* Viewfinder Ring & Click Ripple */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          scale: isClicking ? 0.8 : 1,
        }}
        className="absolute -top-6 -left-6 w-12 h-12 flex items-center justify-center pointer-events-none"
      >
        <div className="w-10 h-10 rounded-full border-2 border-[#111111] bg-[#B5F500]/20 backdrop-blur-[1px] flex items-center justify-center shadow-md">
          <div className="w-2 h-2 rounded-full bg-[#111111]" />
        </div>

        {/* Studio Coordinate Badge */}
        <div className="absolute top-10 left-6 whitespace-nowrap bg-[#111111] text-[#B5F500] font-mono text-[9px] font-extrabold px-2 py-0.5 rounded shadow-lg border border-[#B5F500]/40 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>X: {Math.round(mousePos.x)} | Y: {Math.round(mousePos.y)}</span>
        </div>
      </motion.div>
    </div>
  );
}
