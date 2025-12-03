"use client";

import React, { useEffect, useRef } from "react";
import { useLoginContext } from "./login-context";

// Unified particle that can morph between states
interface MorphingParticle {
  // Current position
  x: number;
  y: number;
  // Velocity for floating state
  vx: number;
  vy: number;
  // Scatter home position (where it began)
  homeX: number;
  homeY: number;
  // Individual morph speeds (randomized)
  toFaceSpeed: number;
  toScatterSpeed: number;
  // Target position for face formation
  targetX: number;
  targetY: number;
  // Visual properties
  size: number;
  opacity: number;
}

const UnifiedParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isHovered } = useLoginContext();
  const particlesRef = useRef<MorphingParticle[]>([]);
  const imageLoadedRef = useRef(false);
  const hoverRef = useRef(false);
  const prevHoverRef = useRef(false);

  useEffect(() => {
    hoverRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let animationFrameId: number;
    // Configuration
    const CONFIG = {
      BG: "#000000",
      COLOR: "#3B82F6",
      GLOW_COLOR: "rgba(96,165,250,0.9)",
      GLOW_BLUR: 15,
      SIZE: 2,
      OPACITY: 0.9,
      FLOAT_SPEED_MIN: 0.08,
      FLOAT_SPEED_MAX: 0.22,
      MORPH_TO_FACE_MIN: 0.028,
      MORPH_TO_FACE_MAX: 0.06,
      MORPH_TO_SCATTER_MIN: 0.03,
      MORPH_TO_SCATTER_MAX: 0.065,
      IMAGE_SCALE: 1.5, // Smaller for full face visibility (was 2.5)
      IMAGE_SAMPLE_STEP: 3, // More particles for better detail
      IMAGE_DARKNESS_THRESHOLD: 200,
      // Position offset for the face - high and centered
      FACE_OFFSET_X: 100, // Centered horizontally
      FACE_OFFSET_Y_PERCENT: 0.0, // Move face a bit higher
    };

    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const randomRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    // Draw a single particle with glow and highlight
    const drawParticle = (
      x: number,
      y: number,
      size: number,
      opacity: number
    ) => {
      // Glow effect
      ctx.shadowColor = CONFIG.GLOW_COLOR;
      ctx.shadowBlur = CONFIG.GLOW_BLUR;
      ctx.fillStyle = CONFIG.COLOR;
      ctx.globalAlpha = opacity;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Bright highlight (shininess)
      ctx.shadowBlur = 0;
      const highlightRadius = Math.max(0.5, size / 3);
      ctx.fillStyle = "rgba(255,255,255,0.85)";

      ctx.beginPath();
      ctx.arc(
        x - highlightRadius / 2,
        y - highlightRadius / 2,
        highlightRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();
    };

    // Load and process image to extract target positions
    const loadImageParticles = () => {
      const img = new Image();
      img.src = "/assets/images/side-face.jpg";

      img.onload = () => {
        // Create temporary canvas to process image
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        tempCtx.drawImage(img, 0, 0);

        const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
        const targetPositions: { x: number; y: number }[] = [];

        // Sample pixels to create target positions
        for (let y = 0; y < imageData.height; y += CONFIG.IMAGE_SAMPLE_STEP) {
          for (let x = 0; x < imageData.width; x += CONFIG.IMAGE_SAMPLE_STEP) {
            const index = y * 4 * imageData.width + x * 4;
            const red = imageData.data[index];

            // If pixel is dark enough, it's a target position
            if (red < CONFIG.IMAGE_DARKNESS_THRESHOLD) {
              const targetX = x * CONFIG.IMAGE_SCALE + CONFIG.FACE_OFFSET_X;
              const targetY =
                y * CONFIG.IMAGE_SCALE +
                canvas.height * CONFIG.FACE_OFFSET_Y_PERCENT;
              targetPositions.push({ x: targetX, y: targetY });
            }
          }
        }

        // Create particles with random starting positions
        const particles: MorphingParticle[] = [];
        for (let i = 0; i < targetPositions.length; i++) {
          const target = targetPositions[i];
          const floatSpeed = randomRange(
            CONFIG.FLOAT_SPEED_MIN,
            CONFIG.FLOAT_SPEED_MAX
          );
          const angle = Math.random() * Math.PI * 2;
          const homeX = Math.random() * canvas.width;
          const homeY = Math.random() * canvas.height;

          particles.push({
            x: homeX,
            y: homeY,
            vx: Math.cos(angle) * floatSpeed,
            vy: Math.sin(angle) * floatSpeed,
            homeX,
            homeY,
            toFaceSpeed: randomRange(
              CONFIG.MORPH_TO_FACE_MIN,
              CONFIG.MORPH_TO_FACE_MAX
            ),
            toScatterSpeed: randomRange(
              CONFIG.MORPH_TO_SCATTER_MIN,
              CONFIG.MORPH_TO_SCATTER_MAX
            ),
            targetX: target.x,
            targetY: target.y,
            size: randomRange(CONFIG.SIZE - 0.5, CONFIG.SIZE + 0.5),
            opacity: CONFIG.OPACITY,
          });
        }

        particlesRef.current = particles;
        imageLoadedRef.current = true;
      };
    };

    // Main animation loop
    const update = () => {
      // Clear canvas
      ctx.fillStyle = CONFIG.BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!imageLoadedRef.current) {
        animationFrameId = requestAnimationFrame(update);
        return;
      }

      const particles = particlesRef.current;
      const nowHovered = hoverRef.current;

      // Capture scatter homes when hover starts, randomize speeds each transition
      if (nowHovered !== prevHoverRef.current) {
        if (nowHovered) {
          particles.forEach((p) => {
            p.homeX = p.x;
            p.homeY = p.y;
            p.toFaceSpeed = randomRange(
              CONFIG.MORPH_TO_FACE_MIN,
              CONFIG.MORPH_TO_FACE_MAX
            );
          });
        } else {
          particles.forEach((p) => {
            p.toScatterSpeed = randomRange(
              CONFIG.MORPH_TO_SCATTER_MIN,
              CONFIG.MORPH_TO_SCATTER_MAX
            );
          });
        }
        prevHoverRef.current = nowHovered;
      }

      for (const p of particles) {
        if (nowHovered) {
          // Morph towards target position (face formation)
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;

          p.x += dx * p.toFaceSpeed;
          p.y += dy * p.toFaceSpeed;
        } else {
          // Morph back toward original scatter home from current spot
          const dx = p.homeX - p.x;
          const dy = p.homeY - p.y;
          const distSq = dx * dx + dy * dy;

          p.x += dx * p.toScatterSpeed;
          p.y += dy * p.toScatterSpeed;

          // Once near scatter home, keep particles moving for a lively cloud
          if (distSq < 36) {
            p.x += p.vx;
            p.y += p.vy;
          }

          // Wrap around screen edges
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        }

        drawParticle(p.x, p.y, p.size, p.opacity);
      }

      // Restore global state
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(update);
    };

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Update target positions for existing particles
      if (imageLoadedRef.current) {
        const particles = particlesRef.current;
        const widthRatio = canvas.width / lastWidth;
        const heightRatio = canvas.height / lastHeight;

        particles.forEach((p) => {
          // Recalculate targetY based on new canvas height
          const relativeY =
            (p.targetY - canvas.height * CONFIG.FACE_OFFSET_Y_PERCENT) /
            CONFIG.IMAGE_SCALE;
          p.targetY =
            relativeY * CONFIG.IMAGE_SCALE +
            canvas.height * CONFIG.FACE_OFFSET_Y_PERCENT;

          // Keep scatter home proportional to new canvas size
          p.homeX *= widthRatio;
          p.homeY *= heightRatio;
        });
      }

      lastWidth = canvas.width;
      lastHeight = canvas.height;
    };

    // Initialize
    handleResize();
    window.addEventListener("resize", handleResize);
    loadImageParticles();
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
      style={{ background: "#000000" }}
    />
  );
};

export default UnifiedParticleBackground;
