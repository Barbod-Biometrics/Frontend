"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, CheckCircle2 } from "lucide-react";
import { FaceScanner } from "./FaceScanner";
import { Button } from "./ui/Button";

interface DemoModalProps {
    onClose: () => void;
}

type Phase = "permission" | "scanner" | "challenge" | "success";

const CHALLENGES = [
    "چشمانتان را ببندید",
    "سرتان را کمی بچرخانید",
    "لبخند بزنید",
];

export function DemoModal({ onClose }: DemoModalProps) {
    const [phase, setPhase] = useState<Phase>("permission");
    const [currentChallenge, setCurrentChallenge] = useState<string>("");
    const [challengeIndex, setChallengeIndex] = useState(0);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const handleGrantPermission = () => {
        setPhase("scanner");
    };

    const handleFaceLocked = () => {
        // Transition to challenge phase
        setPhase("challenge");
        setCurrentChallenge(CHALLENGES[0]);
        setChallengeIndex(0);

        // Start challenge sequence
        let index = 0;
        const challengeInterval = setInterval(() => {
            index++;
            if (index < CHALLENGES.length) {
                setCurrentChallenge(CHALLENGES[index]);
                setChallengeIndex(index);
            } else {
                clearInterval(challengeInterval);
                // Move to success after all challenges
                setTimeout(() => {
                    setPhase("success");
                    // Auto-close after success animation
                    setTimeout(() => {
                        onClose();
                    }, 2500);
                }, 1500);
            }
        }, 3000); // 3 seconds per challenge

        return () => clearInterval(challengeInterval);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-full max-w-2xl bg-[color:var(--md-sys-color-surface-container)] rounded-2xl shadow-[var(--elevation-3)] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                    dir="rtl"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 z-10 p-2 rounded-full bg-[color:var(--md-sys-color-surface-container-high)] hover:bg-[color:var(--md-sys-color-surface-container-highest)] text-[color:var(--md-sys-color-on-surface)] transition-colors"
                        aria-label="بستن"
                    >
                        <X size={20} />
                    </button>

                    {/* Phase 1: Permission Request */}
                    {phase === "permission" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-8 md:p-12 text-center font-vazirmatn"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-[color:var(--md-sys-color-primary-container)]"
                            >
                                <Camera
                                    size={40}
                                    className="text-[color:var(--md-sys-color-on-primary-container)]"
                                />
                            </motion.div>

                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[color:var(--md-sys-color-on-surface)]">
                                تأیید هویت با تشخیص چهره
                            </h2>

                            <p className="text-base md:text-lg text-[color:var(--md-sys-color-on-surface-variant)] mb-8 max-w-md mx-auto">
                                برای شروع فرآیند احراز هویت بیومتریک، لطفاً به دوربین دستگاه خود
                                دسترسی بدهید.
                            </p>

                            <div className="space-y-3 mb-8 text-right max-w-md mx-auto">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[color:var(--md-sys-color-primary)] mt-2 flex-shrink-0" />
                                    <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                                        دوربین خود را در محیطی روشن قرار دهید
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[color:var(--md-sys-color-primary)] mt-2 flex-shrink-0" />
                                    <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                                        چهره خود را مستقیم به دوربین نشان دهید
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[color:var(--md-sys-color-primary)] mt-2 flex-shrink-0" />
                                    <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                                        از عینک یا ماسک استفاده نکنید
                                    </p>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                onClick={handleGrantPermission}
                                className="h-14 px-12 text-lg rounded-full"
                            >
                                فعال‌سازی دوربین
                            </Button>
                        </motion.div>
                    )}

                    {/* Phase 2: Scanner (Face Detection) */}
                    {phase === "scanner" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 md:p-8 font-vazirmatn"
                        >
                            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-[color:var(--md-sys-color-on-surface)]">
                                تشخیص چهره
                            </h2>
                            <FaceScanner
                                onFaceLocked={handleFaceLocked}
                                isScanning={true}
                            />
                        </motion.div>
                    )}

                    {/* Phase 3: Challenge */}
                    {phase === "challenge" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 md:p-8 font-vazirmatn"
                        >
                            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-[color:var(--md-sys-color-on-surface)]">
                                تأیید زنده‌بودن
                            </h2>
                            <FaceScanner
                                onFaceLocked={() => { }}
                                challengeText={currentChallenge}
                                isScanning={true}
                            />
                        </motion.div>
                    )}

                    {/* Phase 4: Success */}
                    {phase === "success" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="p-12 md:p-16 text-center font-vazirmatn"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.1,
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 10,
                                }}
                            >
                                <CheckCircle2
                                    size={80}
                                    className="mx-auto mb-6 text-green-500"
                                    strokeWidth={2}
                                />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-4xl font-bold mb-4 text-green-500"
                            >
                                ✓ تأیید شد
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-[color:var(--md-sys-color-on-surface-variant)]"
                            >
                                احراز هویت بیومتریک با موفقیت انجام شد
                            </motion.p>

                            {/* Success particles animation */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 bg-green-500 rounded-full"
                                        initial={{
                                            x: "50%",
                                            y: "50%",
                                            opacity: 1,
                                            scale: 0,
                                        }}
                                        animate={{
                                            x: `${50 + (Math.random() - 0.5) * 100}%`,
                                            y: `${50 + (Math.random() - 0.5) * 100}%`,
                                            opacity: 0,
                                            scale: 1,
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            delay: i * 0.05,
                                            ease: "easeOut",
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
