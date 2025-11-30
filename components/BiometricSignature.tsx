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
                <div className="relative flex justify-center items-center min-h-[40vh] py-16">
                    {/* Animated particles/dots in background */}
                    <div className="absolute inset-0 opacity-20">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-[color:var(--md-sys-color-primary)] rounded-full"
                                style={{
                                    left: `${30 + i * 20}%`,
                                    top: `${40 + i * 10}%`,
                                }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0.8, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.8,
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
              text-[clamp(4rem,20vw,20rem)]
              leading-none 
              tracking-tighter
              ${language === Language.FA ? 'font-vazirmatn' : 'font-sans'}
            `}
                        initial={{
                            opacity: 0,
                            y: 50,
                            scale: 0.85,
                            rotateX: -15,
                        }}
                        whileInView={{
                            opacity: 0.12,
                            y: 0,
                            scale: 1,
                            rotateX: 0,
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 1.4,
                            ease: [0.16, 1, 0.3, 1],
                            backgroundPosition: {
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            },
                        }}
                        style={{
                            background: "linear-gradient(135deg, var(--md-sys-color-on-surface) 0%, var(--md-sys-color-primary) 50%, var(--md-sys-color-on-surface-variant) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            backgroundSize: "200% 200%",
                            perspective: "1000px",
                        }}
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        whileHover={{
                            opacity: 0.22,
                            scale: 1.03,
                            transition: { duration: 0.4 },
                        }}
                    >
                        {text}
                    </motion.h1>

                    {/* Ambient glow layers */}
                    <motion.div
                        className="absolute inset-0 blur-3xl"
                        animate={{
                            opacity: [0, 0.05, 0],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: 6,
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
