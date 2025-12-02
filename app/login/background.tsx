"use client";

import React, { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const png = new Image();

    png.src = "/assets/images/side-face.jpg";

    const drawScene = () => {
      // scale controls how much the source image is upscaled for particle rendering.
      // Lowering this value makes the final background smaller.
      const scale = 1.5;

      canvas.width = png.width * scale;
      canvas.height = png.height * scale;

      ctx.drawImage(png, 0, 0);

      const data = ctx.getImageData(0, 0, png.width, png.height);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles: { x: number; y: number }[] = [];

      // Control sampling step and darkness threshold to reduce particle count
      const sampleStep = 4; // sample every 3rd pixel (increase to reduce further)
      const darknessThreshold = 200; // lower value => fewer particles

      for (let y = 0; y < data.height; y += sampleStep) {
        for (let x = 0; x < data.width; x += sampleStep) {
          const index = y * 4 * data.width + x * 4;

          const red = data.data[index];

          // If pixel is dark enough (pencil line), make it a particle
          if (red < darknessThreshold) {
            particles.push({ x, y });
          }
        }
      }

      // Draw the particles with glow and highlight to make them shinier
      ctx.fillStyle = "#3B82F6";
      // increase particle size a bit for visibility
      const particleSize = Math.max(1, Math.round(scale));

      // soft glow
      ctx.shadowColor = "rgba(96,165,250,0.9)";
      ctx.shadowBlur = 15;

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const cx = particle.x * scale + particleSize / 2;
        const cy = particle.y * scale + particleSize / 2;

        // main particle (circle)
        ctx.beginPath();
        ctx.arc(cx, cy, particleSize, 0, Math.PI * 2);
        ctx.fill();

        // small bright highlight to simulate shininess
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.arc(
          cx - particleSize / 3,
          cy - particleSize / 3,
          Math.max(1, Math.round(particleSize / 3)),
          0,
          Math.PI * 2
        );
        ctx.fill();

        // restore fill color for next particle
        ctx.fillStyle = "#3B82F6";
      }

      // reset shadow so other canvas operations aren't affected
      ctx.shadowBlur = 0;
    };

    png.onload = drawScene;

    // Optional: Add resize listener if you want it to be responsive
    // (though currently it depends on image size)
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden -z-10">
      <canvas
        ref={canvasRef}
        id="scene"
        className="absolute top-[45%] left-[-170px] -translate-y-1/2"
      />
    </div>
  );
};

export default ParticleBackground;
