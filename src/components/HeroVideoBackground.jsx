import { getAssetPath } from "../utils/assets";
import React, { useEffect, useRef, useState } from "react";

export function HeroVideoBackground({
  totalFrames = 190,
  fps = 24,
  framePath = (i) =>
    getAssetPath(`/images/products/ezgif-49e191612309c949-jpg/ezgif-frame-${String(i).padStart(3, "0")}.jpg`),
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });

    // Enable highest quality bicubic interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Set canvas internal resolution to high DPI
    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    let isMounted = true;
    let animationFrameId;
    let currentFrameIndex = 0;
    let lastTime = 0;
    const frameInterval = 1000 / fps;

    // Preload image array
    const images = new Array(totalFrames);

    // Draw single frame using cover aspect ratio
    const drawFrame = (img) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cW = canvas.width;
      const cH = canvas.height;
      const iW = img.naturalWidth;
      const iH = img.naturalHeight;

      // Cover calculation
      const scale = Math.max(cW / iW, cH / iH);
      const drawW = iW * scale;
      const drawH = iH * scale;
      const drawX = (cW - drawW) / 2;
      const drawY = (cH - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = framePath(1);
    firstImg.onload = () => {
      if (!isMounted) return;
      drawFrame(firstImg);
      setIsReady(true);
    };
    images[0] = firstImg;

    // Preload all frames
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = framePath(i);
      images[i - 1] = img;
    }

    // High performance animation loop
    const render = (time) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;

      if (delta >= frameInterval) {
        lastTime = time - (delta % frameInterval);
        const img = images[currentFrameIndex];
        if (img) {
          drawFrame(img);
        }
        currentFrameIndex = (currentFrameIndex + 1) % totalFrames;
      }

      if (isMounted) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", updateSize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [totalFrames, fps]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-black pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover object-center"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "translateZ(0)",
          filter: "contrast(1.08) saturate(1.12) brightness(1.02)",
          imageRendering: "auto",
        }}
      />
    </div>
  );
}
