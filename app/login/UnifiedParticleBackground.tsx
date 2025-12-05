"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Theme } from "../../types";

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
  // Local wander offsets in scatter mode
  wanderOffsetX: number;
  wanderOffsetY: number;
  wanderTargetX: number;
  wanderTargetY: number;
  wanderSpeed: number;
  // Pulse animation
  pulsePhase: number;
  pulseSpeed: number;
  // Target position for face formation
  targetX: number;
  targetY: number;
  // Visual properties
  size: number;
  opacity: number;
}

interface Beam {
  targetIndex: number;
  progress: number;
  speed: number;
  width: number;
}

type Palette = {
  BG: string;
  COLOR: string;
  GLOW_COLOR: string;
  HIGHLIGHT: string;
};

const MOBILE_BREAKPOINT = 768;

const UnifiedParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHovered = useSelector((state: RootState) => state.login.isHovered);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const particlesRef = useRef<MorphingParticle[]>([]);
  const imageLoadedRef = useRef(false);
  const hoverRef = useRef(false);
  const prevHoverRef = useRef(false);
  const hoverStartRef = useRef<number | null>(null);
  const beamsRef = useRef<Beam[]>([]);
  const phantomTargetsRef = useRef<{ x: number; y: number }[]>([]);
  const themeRef = useRef<Theme>(theme);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Check on mount
    checkMobile();

    // Listen for resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    hoverRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    // Skip particle animation entirely on mobile
    if (isMobile) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let animationFrameId: number;
    // Configuration
    const CONFIG = {
      // Color styling is theme-dependent (handled via palette)
      GLOW_BLUR: 22, // softer, wider glow
      SIZE: 1.65, // slightly larger base size
      OPACITY: 0.9,
      FLOAT_SPEED_MIN: 0.08,
      FLOAT_SPEED_MAX: 0.22,
      MORPH_TO_FACE_MIN: 0.028,
      MORPH_TO_FACE_MAX: 0.06,
      MORPH_TO_SCATTER_MIN: 0.03,
      MORPH_TO_SCATTER_MAX: 0.065,
      SCATTER_WANDER_RADIUS: 46, // larger local movement radius
      SCATTER_WANDER_SPEED_MIN: 0.01,
      SCATTER_WANDER_SPEED_MAX: 0.022,
      PULSE_AMPLITUDE: 0.35,
      PULSE_SPEED_MIN: 0.015,
      PULSE_SPEED_MAX: 0.045,
      IMAGE_SCALE: 1.5, // Smaller for full face visibility (was 2.5)
      IMAGE_SAMPLE_STEP: 3, // More particles for better detail
      IMAGE_DARKNESS_THRESHOLD: 200,
      // Position offset for the face - high and centered
      FACE_OFFSET_X: 100, // Centered horizontally
      FACE_OFFSET_Y_PERCENT: 0.0, // Move face a bit higher
      // Beam styling
      MAX_BEAMS: 14,
      BEAM_SPEED_MIN: 0.12,
      BEAM_SPEED_MAX: 0.24,
      BEAM_WIDTH_MIN: 1.2,
      BEAM_WIDTH_MAX: 2.8,
      BEAM_COLOR: "#3B82F6",
      BEAM_HIGHLIGHT: "#bfdbfe",
      BEAM_DELAY_MS: 4000,
    };

    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const randomRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const smoothStep = (t: number) => {
      const clamped = clamp01(t);
      return clamped * clamped * (3 - 2 * clamped);
    };

    const randomOffsetInCircle = (radius: number) => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      return {
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      };
    };

    const getPalette = (): Palette => {
      const currentTheme = themeRef.current;
      if (currentTheme === Theme.LIGHT) {
        return {
          BG: "#ffffff",
          COLOR: "#2563eb",
          GLOW_COLOR: "rgba(37,99,235,0.28)",
          HIGHLIGHT: "#93c5fd",
        };
      }
      return {
        BG: "#000000",
        COLOR: "#3B82F6",
        GLOW_COLOR: "rgba(96,165,250,0.95)",
        HIGHLIGHT: "#bfdbfe",
      };
    };

    // Draw a single particle with glow and highlight
    const drawParticle = (
      x: number,
      y: number,
      size: number,
      opacity: number,
      palette: Palette
    ) => {
      // Glow effect
      ctx.shadowColor = palette.GLOW_COLOR;
      ctx.shadowBlur = CONFIG.GLOW_BLUR;
      ctx.fillStyle = palette.COLOR;
      ctx.globalAlpha = opacity;

      // main rectangle body
      ctx.beginPath();
      ctx.rect(x - size / 2, y - size / 2, size, size);
      ctx.fill();

      // Bright highlight (shininess)
      ctx.shadowBlur = 0;
      const highlightSize = Math.max(0.4, size * 0.35);
      ctx.fillStyle = palette.HIGHLIGHT;
      ctx.beginPath();
      ctx.rect(
        x - highlightSize * 0.6,
        y - highlightSize * 0.6,
        highlightSize,
        highlightSize
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

        const xs = targetPositions.map((p) => p.x);
        const ys = targetPositions.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const faceWidth = maxX - minX;
        const faceHeight = maxY - minY;
        const midY = (minY + maxY) / 2;

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
          const wanderStart = randomOffsetInCircle(
            CONFIG.SCATTER_WANDER_RADIUS
          );

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
            wanderOffsetX: wanderStart.x,
            wanderOffsetY: wanderStart.y,
            wanderTargetX: wanderStart.x,
            wanderTargetY: wanderStart.y,
            wanderSpeed: randomRange(
              CONFIG.SCATTER_WANDER_SPEED_MIN,
              CONFIG.SCATTER_WANDER_SPEED_MAX
            ),
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: randomRange(
              CONFIG.PULSE_SPEED_MIN,
              CONFIG.PULSE_SPEED_MAX
            ),
            targetX: target.x,
            targetY: target.y,
            size: randomRange(CONFIG.SIZE - 0.5, CONFIG.SIZE + 0.5),
            opacity: CONFIG.OPACITY,
          });
        }

        particlesRef.current = particles;
        const frontX = maxX + faceWidth * 0.12 + 28;
        const cheekX = minX + faceWidth * 0.68;
        const y1 = minY + faceHeight * 0.25;
        const y2 = minY + faceHeight * 0.5;
        const y3 = minY + faceHeight * 0.7;
        phantomTargetsRef.current = [
          { x: frontX, y: midY },
          { x: frontX, y: y1 },
          { x: frontX, y: y2 },
          { x: frontX, y: y3 },
          { x: cheekX, y: y1 },
          { x: cheekX, y: y2 },
          { x: cheekX, y: y3 },
        ];
        imageLoadedRef.current = true;
      };
    };

    const pickRandomTargetIndex = (len: number) =>
      Math.floor(Math.random() * len);

    const resetBeam = (beam: Beam, targetCount: number) => {
      beam.targetIndex = pickRandomTargetIndex(targetCount);
      beam.progress = -0.35; // start offscreen for fade-in
      beam.speed = randomRange(CONFIG.BEAM_SPEED_MIN, CONFIG.BEAM_SPEED_MAX);
      beam.width = randomRange(CONFIG.BEAM_WIDTH_MIN, CONFIG.BEAM_WIDTH_MAX);
    };

    const ensureBeams = (targetCount: number) => {
      const beams = beamsRef.current;
      while (beams.length < CONFIG.MAX_BEAMS) {
        beams.push({
          targetIndex: pickRandomTargetIndex(targetCount),
          progress: -Math.random() * 0.35, // staggered fade-in
          speed: randomRange(CONFIG.BEAM_SPEED_MIN, CONFIG.BEAM_SPEED_MAX),
          width: randomRange(CONFIG.BEAM_WIDTH_MIN, CONFIG.BEAM_WIDTH_MAX),
        });
      }
    };

    const drawEmitterFlare = (
      _palette: Palette,
      emitterX: number,
      emitterY: number,
      alpha: number,
      timeMs: number
    ) => {
      ctx.save();
      const pulse =
        0.9 + 0.1 * Math.sin(timeMs * 0.006 + emitterX * 0.01 + emitterY * 0.01);
      const grad = ctx.createRadialGradient(
        emitterX,
        emitterY,
        0,
        emitterX,
        emitterY,
        26
      );
      grad.addColorStop(0, CONFIG.BEAM_HIGHLIGHT);
      grad.addColorStop(0.35, CONFIG.BEAM_COLOR);
      grad.addColorStop(1, "rgba(59,130,246,0)");
      ctx.globalAlpha = alpha * pulse;
      ctx.fillStyle = grad;
      ctx.shadowColor = CONFIG.BEAM_COLOR;
      ctx.shadowBlur = 34;
      ctx.beginPath();
      ctx.arc(emitterX, emitterY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawBeam = (
      _palette: Palette,
      emitterX: number,
      emitterY: number,
      target: { x: number; y: number },
      beam: Beam,
      alpha: number,
      timeMs: number
    ) => {
      const pulse = 0.9 + 0.1 * Math.sin(timeMs * 0.008 + beam.targetIndex);
      const beamAlpha = alpha * pulse;
      ctx.save();

      // Outer glow stroke
      ctx.globalAlpha = 0.7 * beamAlpha;
      ctx.strokeStyle = CONFIG.BEAM_COLOR;
      ctx.lineWidth = beam.width;
      ctx.shadowColor = CONFIG.BEAM_COLOR;
      ctx.shadowBlur = 34;
      ctx.beginPath();
      ctx.moveTo(emitterX, emitterY);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();

      // Inner bright core
      ctx.shadowBlur = 0;
      ctx.globalAlpha = beamAlpha;
      ctx.strokeStyle = CONFIG.BEAM_HIGHLIGHT;
      ctx.lineWidth = Math.max(1, beam.width * 0.45);
      ctx.beginPath();
      ctx.moveTo(emitterX, emitterY);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();

      ctx.restore();
    };

    const drawTargetGlow = (
      _palette: Palette,
      target: { x: number; y: number },
      alpha: number,
      timeMs: number
    ) => {
      ctx.save();
      const pulse =
        0.9 + 0.1 * Math.sin(timeMs * 0.01 + target.x * 0.01 + target.y * 0.01);
      const grad = ctx.createRadialGradient(
        target.x,
        target.y,
        0,
        target.x,
        target.y,
        24
      );
      grad.addColorStop(0, CONFIG.BEAM_HIGHLIGHT);
      grad.addColorStop(0.35, CONFIG.BEAM_COLOR);
      grad.addColorStop(1, "rgba(59,130,246,0)");
      ctx.globalAlpha = alpha * pulse;
      ctx.fillStyle = grad;
      ctx.shadowColor = CONFIG.BEAM_COLOR;
      ctx.shadowBlur = 26;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Main animation loop
    const update = () => {
      const palette = getPalette();
      const timeMs = performance.now();
      // Clear canvas
      ctx.fillStyle = palette.BG;
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
          hoverStartRef.current = performance.now();
          particles.forEach((p) => {
            p.homeX = p.x;
            p.homeY = p.y;
            const start = randomOffsetInCircle(
              CONFIG.SCATTER_WANDER_RADIUS
            );
            p.wanderOffsetX = 0;
            p.wanderOffsetY = 0;
            p.wanderTargetX = start.x;
            p.wanderTargetY = start.y;
            p.wanderSpeed = randomRange(
              CONFIG.SCATTER_WANDER_SPEED_MIN,
              CONFIG.SCATTER_WANDER_SPEED_MAX
            );
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
        if (!nowHovered) {
          beamsRef.current = [];
          hoverStartRef.current = null;
        }
      }

      const hoverElapsed =
        hoverStartRef.current !== null
          ? performance.now() - hoverStartRef.current
          : 0;
      const beamsAllowed =
        nowHovered &&
        hoverStartRef.current !== null &&
        hoverElapsed >= CONFIG.BEAM_DELAY_MS;

      const beamTargetPool: { x: number; y: number }[] = [];
      if (particles.length > 0) {
        for (const p of particles) {
          beamTargetPool.push({ x: p.x, y: p.y });
        }
      }
      if (phantomTargetsRef.current.length > 0) {
        beamTargetPool.push(...phantomTargetsRef.current);
      }

      if (beamsAllowed && beamTargetPool.length > 0) {
        ensureBeams(beamTargetPool.length);
      }

      for (const p of particles) {
        if (nowHovered) {
          // Morph towards target position (face formation)
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;

          p.x += dx * p.toFaceSpeed;
          p.y += dy * p.toFaceSpeed;
        } else {
          // Smooth wander within a larger local radius
          const tdx = p.wanderTargetX - p.wanderOffsetX;
          const tdy = p.wanderTargetY - p.wanderOffsetY;
          const tDist = Math.hypot(tdx, tdy);
          if (tDist < 1) {
            const next = randomOffsetInCircle(
              CONFIG.SCATTER_WANDER_RADIUS
            );
            p.wanderTargetX = next.x;
            p.wanderTargetY = next.y;
          }
          p.wanderOffsetX += tdx * p.wanderSpeed;
          p.wanderOffsetY += tdy * p.wanderSpeed;

          // Morph back toward home plus wander offset
          const destX = p.homeX + p.wanderOffsetX;
          const destY = p.homeY + p.wanderOffsetY;
          const dx = destX - p.x;
          const dy = destY - p.y;

          p.x += dx * p.toScatterSpeed;
          p.y += dy * p.toScatterSpeed;

          // Ensure particles stay inside canvas bounds
          if (p.x < 0) p.x = 0;
          if (p.x > canvas.width) p.x = canvas.width;
          if (p.y < 0) p.y = 0;
          if (p.y > canvas.height) p.y = canvas.height;
        }

        // Pulse size/brightness for a livelier look
        p.pulsePhase += p.pulseSpeed;
        if (p.pulsePhase > Math.PI * 2) p.pulsePhase -= Math.PI * 2;
        const pulse = 1 + Math.sin(p.pulsePhase) * CONFIG.PULSE_AMPLITUDE;
        const renderSize = p.size * pulse;
        const renderOpacity =
          p.opacity *
          (0.82 + 0.18 * (0.5 + 0.5 * Math.cos(p.pulsePhase + 1.2)));

        drawParticle(p.x, p.y, renderSize, renderOpacity, palette);
      }

      if (beamsAllowed && beamTargetPool.length > 0) {
        // Approximate the form's left edge and place emitter just left of it
        const approxFormWidth = Math.min(560, canvas.width * 0.7);
        const rightMargin = Math.max(canvas.width * 0.08, 60);
        const emitterX = Math.max(
          40,
          Math.min(
            canvas.width - rightMargin - approxFormWidth - 32,
            canvas.width - 120
          )
        );
        const emitterY = canvas.height * 0.5;
        const beams = beamsRef.current;

        const emitterAlpha = clamp01(
          (hoverElapsed - CONFIG.BEAM_DELAY_MS) / 800
        );

        drawEmitterFlare(palette, emitterX, emitterY, emitterAlpha, timeMs);

        for (let i = 0; i < beams.length; i++) {
          const beam = beams[i];
          const target = beamTargetPool[beam.targetIndex];
          if (!target) {
            resetBeam(beam, beamTargetPool.length);
            continue;
          }

          beam.progress += beam.speed;
          const t = clamp01(beam.progress);
          const fadeIn = smoothStep(clamp01((beam.progress + 0.35) / 0.35));
          const alpha = (1 - t) * fadeIn;

          drawBeam(palette, emitterX, emitterY, target, beam, alpha, timeMs);
          drawTargetGlow(palette, target, alpha, timeMs);

          if (beam.progress >= 1) {
            resetBeam(beam, beamTargetPool.length);
          }
        }
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

        if (phantomTargetsRef.current.length > 0) {
          phantomTargetsRef.current = phantomTargetsRef.current.map((pt) => ({
            x: pt.x * widthRatio,
            y: pt.y * heightRatio,
          }));
        }
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
  }, [isMobile]);

  // Render static gradient background on mobile for performance
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: themeRef.current === Theme.LIGHT
            ? "linear-gradient(135deg, #ffffff 0%, #f0f4ff 50%, #e0e8ff 100%)"
            : "linear-gradient(135deg, #000000 0%, #0a0a1a 50%, #101030 100%)",
          width: "100%",
          height: "100%",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      id="scene"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: themeRef.current === Theme.LIGHT ? "#ffffff" : "#000000",
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default UnifiedParticleBackground;
