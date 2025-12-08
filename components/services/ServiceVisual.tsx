"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, FileText, ScanFace, CheckCircle2, Waves, Radar } from "lucide-react";
import { Theme } from "../../types";

type Variant = "face" | "match" | "liveness" | "ocr";

interface ServiceVisualProps {
  variant: Variant;
  accentFrom: string;
  accentTo: string;
  theme: Theme;
}

/**
 * Visuals are now self-contained (no external images) with gradient meshes,
 * animated rings, and glyphs so they always render offline.
 */
export function ServiceVisual({ variant, accentFrom, accentTo }: ServiceVisualProps) {
  const gradient = `linear-gradient(135deg, ${accentFrom}, ${accentTo})`;

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-[32px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.2)] border border-[color:var(--md-sys-color-outline-variant)]/40">
      {/* Background mesh */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, ${accentFrom}33, transparent 32%),
            radial-gradient(circle at 80% 0%, ${accentTo}33, transparent 28%),
            radial-gradient(circle at 50% 80%, ${accentFrom}22, transparent 30%),
            ${gradient}
          `,
          filter: "saturate(1.1)",
        }}
      />
      <div className="absolute inset-0 opacity-18 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_45%)]" />

      {/* Soft glows */}
      <div className="absolute -left-16 -top-20 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-16 bottom-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

      {/* Central animated motif */}
      <div className="relative h-full p-8 md:p-10 flex items-center justify-center">
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-white/40"
              initial={{ scale: 0.65 + i * 0.1, opacity: 0.45 }}
              animate={{ scale: 0.95 + i * 0.1, opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
            />
          ))}

          <motion.div
            className="absolute inset-10 rounded-[28px] bg-white/12 backdrop-blur-xl border border-white/25 shadow-[0_20px_70px_rgba(0,0,0,0.25)] flex items-center justify-center"
            animate={{ scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            {renderGlyph(variant)}
          </motion.div>

          {/* Floating badges */}
          <FloatingBadge position="top-8 left-8" icon={<Sparkles className="w-5 h-5" />} delay={0} />
          <FloatingBadge position="bottom-10 right-8" icon={<Radar className="w-5 h-5" />} delay={0.2} />
          <FloatingBadge position="top-12 right-16" icon={<Waves className="w-5 h-5" />} delay={0.4} />
        </div>
      </div>
    </div>
  );
}

function renderGlyph(variant: Variant) {
  if (variant === "liveness") {
    return <Shield className="w-16 h-16 text-white drop-shadow-lg" />;
  }
  if (variant === "ocr") {
    return <FileText className="w-16 h-16 text-white drop-shadow-lg" />;
  }
  // face / match
  return <ScanFace className="w-16 h-16 text-white drop-shadow-lg" />;
}

function FloatingBadge({
  position,
  icon,
  delay = 0,
}: {
  position: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute ${position} h-11 w-11 rounded-2xl bg-white/18 backdrop-blur-xl border border-white/25 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] text-white`}
      animate={{ y: [0, -6, 0], opacity: [0.9, 1, 0.9] }}
      transition={{ duration: 3, repeat: Infinity, delay }}
    >
      {icon}
    </motion.div>
  );
}
