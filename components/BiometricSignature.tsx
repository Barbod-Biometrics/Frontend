"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../lib/useLanguage";
import { Language } from "../types";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";

const signatureCopy: Record<Language, { text: string }> = {
    [Language.EN]: { text: "BARBOD" },
    [Language.FA]: { text: "باربد" },
};

export function BiometricSignature() {
    const { language, dir } = useLanguage();
    const text = signatureCopy[language].text;

    return (
        <Section spacing="lg" className="overflow-hidden relative" dir={dir}>
            <Container>
                <div className="relative flex justify-center items-center min-h-[36vh] py-12 sm:py-16">
                    {/* Animated particles/dots in background */}
                    <div className="absolute inset-0 opacity-25">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute h-2 w-2 rounded-full bg-[color:var(--md-sys-color-primary)]"
                                style={{
                                    left: `${18 + i * 16}%`,
                                    top: `${28 + i * 12}%`,
                                }}
                                animate={{
                                    scale: [1, 1.35, 1],
                                    opacity: [0.15, 0.6, 0.15],
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 4.5,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>

                    {/* Main text with multiple animation layers */}
                    <motion.h1
                        className={`
              relative z-10 
              font-black 
              text-[clamp(3.5rem,18vw,18rem)]
              leading-none 
              tracking-tight
              ${language === Language.FA ? 'font-vazirmatn' : 'font-sans'}
            `}
                        initial={{
                            opacity: 0,
                            y: 36,
                            scale: 0.92,
                        }}
                        whileInView={{
                            opacity: 0.16,
                            y: 0,
                            scale: 1,
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 1.2,
                            ease: [0.22, 1, 0.36, 1],
                            backgroundPosition: {
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear",
                            },
                        }}
                        style={{
                            background: "linear-gradient(135deg, var(--md-sys-color-on-surface) 0%, var(--md-sys-color-primary) 45%, var(--md-sys-color-on-surface-variant) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            backgroundSize: "200% 200%",
                            perspective: "1000px",
                            filter: "drop-shadow(0 18px 30px rgba(0, 0, 0, 0.35))",
                        }}
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        whileHover={{
                            opacity: 0.22,
                            scale: 1.02,
                            transition: { duration: 0.35 },
                        }}
                    >
                        {text}
                    </motion.h1>

                    {/* Ambient glow layers */}
                    <motion.div
                        className="absolute inset-0 blur-3xl"
                        animate={{
                            opacity: [0, 0.06, 0],
                            scale: [0.85, 1.15, 0.85],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        style={{
                            background: "radial-gradient(circle at 50% 50%, var(--md-sys-color-primary) 0%, transparent 60%)",
                        }}
                    />
                </div>
            </Container>
        </Section>
    );
}
