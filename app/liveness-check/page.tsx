"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Camera, CheckCircle2 } from "lucide-react";
import { FaceScanner } from "../../components/FaceScanner";
import { Button } from "../../components/ui/Button";

type Phase = "permission" | "scanner" | "challenge" | "success";

type ChallengeType = {
    text: string;
    type: "blink" | "turn-left" | "turn-right";
};

const CHALLENGES: ChallengeType[] = [
    { text: "چشمان خود را ببندید و باز کنید", type: "blink" },
    { text: "سرتان را به سمت چپ بچرخانید", type: "turn-left" },
    { text: "سرتان را به سمت راست بچرخانید", type: "turn-right" },
];

export default function LivenessCheckPage() {
    const router = useRouter();
    const [phase, setPhase] = useState<Phase>("permission");
    const [currentChallenge, setCurrentChallenge] = useState<ChallengeType | null>(null);
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [challengeCompleted, setChallengeCompleted] = useState(false);
    const challengeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                router.push("/");
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [router]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (challengeTimeoutRef.current) {
                clearTimeout(challengeTimeoutRef.current);
            }
        };
    }, []);

    const handleGrantPermission = () => {
        setPhase("scanner");
    };

    const handleFaceLocked = () => {
        // Transition to challenge phase
        setPhase("challenge");
        setCurrentChallenge(CHALLENGES[0]);
        setChallengeIndex(0);
        setChallengeCompleted(false);
    };

    const handleLivenessEvent = (event: {
        type: "blink" | "turn";
        direction?: "left" | "right";
    }) => {
        if (!currentChallenge || challengeCompleted || phase !== "challenge") {
            return;
        }

        let challengeMatched = false;

        // Check if the detected event matches the current challenge
        if (currentChallenge.type === "blink" && event.type === "blink") {
            challengeMatched = true;
        } else if (
            currentChallenge.type === "turn-left" &&
            event.type === "turn" &&
            event.direction === "left"
        ) {
            challengeMatched = true;
        } else if (
            currentChallenge.type === "turn-right" &&
            event.type === "turn" &&
            event.direction === "right"
        ) {
            challengeMatched = true;
        }

        if (challengeMatched) {
            console.log(`Challenge ${challengeIndex + 1} completed:`, currentChallenge.text);
            setChallengeCompleted(true);

            // Move to next challenge after a short delay
            if (challengeTimeoutRef.current) {
                clearTimeout(challengeTimeoutRef.current);
            }

            challengeTimeoutRef.current = setTimeout(() => {
                const nextIndex = challengeIndex + 1;

                if (nextIndex < CHALLENGES.length) {
                    // Next challenge
                    setChallengeIndex(nextIndex);
                    setCurrentChallenge(CHALLENGES[nextIndex]);
                    setChallengeCompleted(false);
                } else {
                    // All challenges completed - show success
                    setPhase("success");
                    // Auto-redirect to home after success animation
                    setTimeout(() => {
                        router.push("/");
                    }, 2500);
                }
            }, 1500);
        }
    };

    return (
        <div
            className="min-h-screen bg-[color:var(--md-sys-color-background)] flex items-center justify-center p-4 font-vazirmatn"
            dir="rtl"
        >
            {/* Close/Back button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/")}
                className="fixed top-4 left-4 z-10 h-auto w-auto p-2 rounded-full bg-[color:var(--md-sys-color-surface-container-high)] hover:bg-[color:var(--md-sys-color-surface-container-highest)] text-[color:var(--md-sys-color-on-surface)]"
                aria-label="بازگشت"
            >
                <ArrowRight size={24} />
            </Button>

            <AnimatePresence mode="wait">
                {/* Phase 1: Permission Request */}
                {phase === "permission" && (
                    <motion.div
                        key="permission"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-2xl bg-[color:var(--md-sys-color-surface-container)] rounded-2xl shadow-[var(--elevation-3)] p-8 md:p-12 text-center"
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

                        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[color:var(--md-sys-color-on-surface)]">
                            تأیید هویت با تشخیص چهره
                        </h1>

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
                        key="scanner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-2xl bg-[color:var(--md-sys-color-surface-container)] rounded-2xl shadow-[var(--elevation-3)] p-6 md:p-8"
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
                {phase === "challenge" && currentChallenge && (
                    <motion.div
                        key="challenge"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-2xl bg-[color:var(--md-sys-color-surface-container)] rounded-2xl shadow-[var(--elevation-3)] p-6 md:p-8"
                    >
                        <div className="mb-6 text-center">
                            <h2 className="text-xl md:text-2xl font-bold mb-2 text-[color:var(--md-sys-color-on-surface)]">
                                تأیید زنده‌بودن
                            </h2>
                            <div className="flex justify-center gap-2">
                                {CHALLENGES.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all ${idx < challengeIndex
                                                ? "w-8 bg-green-500"
                                                : idx === challengeIndex
                                                    ? challengeCompleted
                                                        ? "w-8 bg-green-500"
                                                        : "w-8 bg-[color:var(--md-sys-color-primary)]"
                                                    : "w-4 bg-gray-600"
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)] mt-2">
                                چالش {challengeIndex + 1} از {CHALLENGES.length}
                            </p>
                        </div>
                        <FaceScanner
                            onFaceLocked={() => { }}
                            onLivenessEvent={handleLivenessEvent}
                            challengeText={currentChallenge.text}
                            isScanning={true}
                        />
                    </motion.div>
                )}

                {/* Phase 4: Success */}
                {phase === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="w-full max-w-2xl bg-[color:var(--md-sys-color-surface-container)] rounded-2xl shadow-[var(--elevation-3)] p-12 md:p-16 text-center relative overflow-hidden"
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
            </AnimatePresence>
        </div>
    );
}
