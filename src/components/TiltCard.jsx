import React, { useRef, useEffect } from "react";

export function TiltCard({
  children,
  className = "",
  maxTilt = 4,
  scale = 1.01,
}) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const glareRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    const glare = glareRef.current;
    if (!outer || !inner) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let currentScale = 1;
    let targetScale = 1;
    let isHovering = false;
    let isRunning = false;
    let rect = null;

    const animate = () => {
      // Smooth dampening factor
      const lerpFactor = 0.1;
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;
      currentScale += (targetScale - currentScale) * lerpFactor;

      inner.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) scale3d(${currentScale.toFixed(3)}, ${currentScale.toFixed(3)}, ${currentScale.toFixed(3)})`;

      const diffX = Math.abs(targetX - currentX);
      const diffY = Math.abs(targetY - currentY);
      const diffScale = Math.abs(targetScale - currentScale);

      if (!isHovering && diffX < 0.02 && diffY < 0.02 && diffScale < 0.002) {
        // Snap to rest and stop animation loop
        inner.style.transform = "none";
        isRunning = false;
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(animate);
      }
    };

    const handleMouseEnter = (e) => {
      isHovering = true;
      targetScale = scale;
      rect = outer.getBoundingClientRect();
      startLoop();
    };

    const handleMouseMove = (e) => {
      if (!rect) rect = outer.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Gentle tilt angles with boundary damping
      targetX = ((y - centerY) / centerY) * -maxTilt;
      targetY = ((x - centerX) / centerX) * maxTilt;

      // Update glare position
      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 65%)`;
        glare.style.opacity = "1";
      }

      startLoop();
    };

    const handleMouseLeave = () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      targetScale = 1;
      rect = null;
      if (glare) glare.style.opacity = "0";
      startLoop();
    };

    outer.addEventListener("mouseenter", handleMouseEnter);
    outer.addEventListener("mousemove", handleMouseMove);
    outer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      outer.removeEventListener("mouseenter", handleMouseEnter);
      outer.removeEventListener("mousemove", handleMouseMove);
      outer.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [maxTilt, scale]);

  return (
    <div
      ref={outerRef}
      className={`relative ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={innerRef}
        className="w-full h-full will-change-transform"
        style={{
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
        }}
      >
        {children}

        {/* Specular Glare Layer */}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ease-out opacity-0"
          style={{ mixBlendMode: "overlay" }}
        />
      </div>
    </div>
  );
}
