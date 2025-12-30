"use client";

import React, { useEffect, useRef } from 'react';
import { Theme } from '../types';

interface TopologicalFaceProps {
  theme?: Theme;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  pulse: number;
}

const TopologicalFace: React.FC<TopologicalFaceProps> = ({ theme = Theme.DARK }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  // Refs for animation state
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const scanYRef = useRef(-150);
  const pointsRef = useRef<Point3D[]>([]);
  const geometryRef = useRef({
    radius: 280,
    connectionDist: 45,
    perspective: 800,
    scanThreshold: 40,
    scanResetOffset: 100,
    scanSpeed: 1.5,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Configuration ---
    const BASE_PARTICLES = 800;

    const PALETTE = {
      [Theme.DARK]: {
        NODE: 'rgba(6, 182, 212, 0.9)',       // Cyan 500
        LINK: 'rgba(34, 211, 238, 0.15)',     // Cyan 400
        SCAN: 'rgba(56, 189, 248, 0.8)',      // Sky 400
        GLOW: 'rgba(6, 182, 212, 0.3)',
      },
      [Theme.LIGHT]: {
        NODE: 'rgba(2, 132, 199, 0.9)',       // Sky 600
        LINK: 'rgba(14, 165, 233, 0.15)',     // Sky 500
        SCAN: 'rgba(2, 132, 199, 0.8)',       // Sky 600
        GLOW: 'rgba(14, 165, 233, 0.3)',
      }
    };

    const createPoints = (radius: number) => {
      const points: Point3D[] = [];
      const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

      for (let i = 0; i < BASE_PARTICLES; i++) {
        const y = 1 - (i / (BASE_PARTICLES - 1)) * 2; // y goes from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y); // radius at y
        const theta = phi * i; // golden angle increment

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        points.push({
          x: x * radius,
          y: y * radius,
          z: z * radius,
          baseX: x * radius,
          baseY: y * radius,
          baseZ: z * radius,
          pulse: Math.random() * Math.PI,
        });
      }

      return points;
    };

    const updateGeometry = () => {
      const base = Math.min(container.clientWidth, container.clientHeight);
      const radius = Math.max(180, Math.min(360, base * 0.38));

      geometryRef.current = {
        radius,
        connectionDist: radius * 0.16,
        perspective: radius * 2.9,
        scanThreshold: radius * 0.14,
        scanResetOffset: radius * 0.45,
        scanSpeed: Math.max(1.1, radius * 0.005),
      };

      pointsRef.current = createPoints(radius);
      scanYRef.current = -radius * 0.7;
    };

    // --- Sizing ---
    const updateDimensions = () => {
      if (!container) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateGeometry();
    };
    updateDimensions();

    // --- Render Loop ---
    const render = (time: number) => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const colors = PALETTE[theme];
      const {
        radius,
        connectionDist,
        perspective,
        scanThreshold,
        scanResetOffset,
        scanSpeed,
      } = geometryRef.current;
      const points = pointsRef.current;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Smooth rotation update
      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.05;
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.05;

      // Auto rotation
      const autoRotX = time * 0.0001;
      const autoRotY = time * 0.0002;

      const finalRotX = rotationRef.current.x + autoRotX;
      const finalRotY = rotationRef.current.y + autoRotY;

      // Scan line animation
      scanYRef.current += scanSpeed;
      if (scanYRef.current > radius + scanResetOffset) {
        scanYRef.current = -radius - scanResetOffset;
      }

      // Project and draw
      const projectedPoints: { x: number; y: number; z: number; scale: number; alpha: number; scanned: boolean }[] = [];

      points.forEach(p => {
        // Rotate Y
        let x = p.baseX * Math.cos(finalRotY) - p.baseZ * Math.sin(finalRotY);
        let z = p.baseX * Math.sin(finalRotY) + p.baseZ * Math.cos(finalRotY);

        // Rotate X
        let y = p.baseY * Math.cos(finalRotX) - z * Math.sin(finalRotX);
        z = p.baseY * Math.sin(finalRotX) + z * Math.cos(finalRotX);

        // Perspective
        const scale = perspective / (perspective - z);
        const px = x * scale;
        const py = y * scale;

        // Scan effect
        const distToScan = Math.abs(y - scanYRef.current);
        const scanned = distToScan < scanThreshold;

        projectedPoints.push({
          x: px,
          y: py,
          z,
          scale,
          alpha: (z + radius) / (2 * radius),
          scanned,
        });
      });

      // Draw connections
      ctx.lineWidth = 1;
      projectedPoints.forEach((p1, i) => {
        if (p1.z < -radius * 0.35) return; // Cull back faces slightly

        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p2 = projectedPoints[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist * p1.scale) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            let alpha = (1 - dist / (connectionDist * p1.scale)) * 0.3;
            if (p1.scanned || p2.scanned) {
              ctx.strokeStyle = colors.SCAN;
              alpha = 0.6;
            } else {
              ctx.strokeStyle = colors.LINK;
            }

            ctx.globalAlpha = alpha;
            ctx.stroke();
          }
        }
      });

      // Draw nodes
      projectedPoints.forEach(p => {
        const size = (p.scanned ? 2.5 : 1.5) * p.scale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);

        if (p.scanned) {
          ctx.fillStyle = colors.SCAN;
          ctx.shadowBlur = 10;
          ctx.shadowColor = colors.SCAN;
        } else {
          ctx.fillStyle = colors.NODE;
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = p.z > 0 ? 1 : 0.3;
        ctx.fill();
      });

      ctx.restore();
      animationRef.current = requestAnimationFrame(() => render(performance.now()));
    };

    animationRef.current = requestAnimationFrame(() => render(performance.now()));

    // --- Interaction ---
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      targetRotationRef.current = {
        x: y * 0.5,
        y: x * 0.5
      };
    };

    const handleResize = () => updateDimensions();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[420px] sm:min-h-[520px] lg:min-h-[600px] bg-transparent cursor-move overflow-visible">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default TopologicalFace;
