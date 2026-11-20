import React, { useEffect, useState } from "react";

export function SpotlightCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let rafId;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const isClickable =
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        target.closest(".cursor-pointer");

      setIsHoveringClickable(!!isClickable);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Smooth RAF Lerp
    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setPos({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  // Only render on non-touch screens
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <>
      {/* Ambient Spotlight Follower */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(255, 255, 255, 0.07), transparent 80%)`,
        }}
      />

      {/* Luxury Custom Cursor Dot & Ring */}
      <div
        className="pointer-events-none fixed z-50 rounded-full transition-transform duration-100 ease-out flex items-center justify-center mix-blend-difference"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHoveringClickable ? "44px" : "12px",
          height: isHoveringClickable ? "44px" : "12px",
          transform: "translate(-50%, -50%)",
          border: isHoveringClickable ? "1.5px solid #ffffff" : "none",
          backgroundColor: isHoveringClickable ? "rgba(255, 255, 255, 0.15)" : "#ffffff",
          backdropFilter: isHoveringClickable ? "invert(1)" : "none",
        }}
      />
    </>
  );
}
