"use client";

import React, { useEffect, useRef } from "react";

// Particle interface
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    // Consolidated Configuration
    const CONFIG = {
      BG: "#000000", // Changed from #070825 to black
      COUNT: 355,
      COLOR: "#3B82F6",
      GLOW_COLOR: "rgba(96,165,250,0.9)",
      GLOW_BLUR: 15,
      SIZE: 2,
      OPACITY: 0.9,
      SPEED: 0.2,
      DENSITY_FACTOR: 640000, // Used to scale particle count (800 * 800)
    };

    const randomRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    // Helper to create a single particle
    const createParticle = (): Particle => {
      const speed = randomRange(0.05, CONFIG.SPEED);
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: randomRange(CONFIG.SIZE - 0.5, CONFIG.SIZE + 0.5),
        opacity: CONFIG.OPACITY,
      };
    };

    // Helper to draw a single particle with glow and highlight
    const drawParticle = (p: Particle) => {
      // --- Draw the Glowing Particle Body ---
      ctx.shadowColor = CONFIG.GLOW_COLOR;
      ctx.shadowBlur = CONFIG.GLOW_BLUR;
      ctx.fillStyle = CONFIG.COLOR;
      ctx.globalAlpha = p.opacity;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // --- Draw the Small Bright Highlight (Shininess) ---
      // Temporarily disable the shadow for this inner highlight to keep it crisp
      ctx.shadowBlur = 0;

      const highlightRadius = Math.max(0.5, p.size / 3);
      ctx.fillStyle = "rgba(255,255,255,0.85)";

      ctx.beginPath();
      ctx.arc(
        p.x - highlightRadius / 2,
        p.y - highlightRadius / 2,
        highlightRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();
    };

    // Initialize/re-initialize particle array
    const init = () => {
      const area = canvas.width * canvas.height;
      const calculatedCount = Math.floor(
        (area * CONFIG.COUNT) / CONFIG.DENSITY_FACTOR
      );
      particles = Array.from({ length: calculatedCount }, createParticle);
    };

    // Main animation loop
    const update = () => {
      // Clear screen. Use globalAlpha to create a fading trail effect,
      // but since you requested pure black, we'll draw a solid rectangle.
      ctx.fillStyle = CONFIG.BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Update position and wrap boundaries
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;

        drawParticle(p);
      }

      // Restore global state
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(update);
    };

    // Handle Resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    // Setup and Cleanup
    handleResize();
    window.addEventListener("resize", handleResize);

    update();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="scene"
      className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none"
      style={{
        background: "#000000",
      }}
    />
  );
};

export default ParticlesBackground;
