"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { useFaceDetection } from "../lib/useFaceDetection";

interface FaceScannerProps {
    onFaceLocked: () => void;
    onLivenessEvent?: (event: {
        type: "blink" | "turn";
        direction?: "left" | "right";
    }) => void;
    challengeText?: string;
    isScanning: boolean;
}

export function FaceScanner({
    onFaceLocked,
    onLivenessEvent,
    challengeText,
    isScanning,
}: FaceScannerProps) {
    const webcamRef = useRef<Webcam>(null);
    const {
        isLoading,
        error,
        faceDetected,
        livenessEvents,
        startDetection,
        stopDetection,
    } = useFaceDetection();
    const [faceLockTimer, setFaceLockTimer] = useState<number>(0);
    const [stableFaceDetected, setStableFaceDetected] = useState(false);
    const consecutiveNoFaceFrames = useRef<number>(0);
    const prevBlinkRef = useRef(false);
    const prevHeadTurnRef = useRef<"left" | "right" | "center">("center");

    // Start detection when webcam is ready
    const handleUserMedia = useCallback(() => {
        if (webcamRef.current?.video) {
            startDetection(webcamRef.current.video);
        }
    }, [startDetection]);

    // Stop detection on unmount
    useEffect(() => {
        return () => {
            stopDetection();
        };
    }, [stopDetection]);

    // Notify parent of liveness events
    useEffect(() => {
        if (!onLivenessEvent) return;

        // Detect blink event
        if (
            livenessEvents.blinkDetected &&
            !prevBlinkRef.current
        ) {
            onLivenessEvent({ type: "blink" });
            prevBlinkRef.current = true;
            // Reset after a short delay
            setTimeout(() => {
                prevBlinkRef.current = false;
            }, 1000);
        }

        // Detect head turn events
        if (
            livenessEvents.headTurnDetected !== "center" &&
            livenessEvents.headTurnDetected !== prevHeadTurnRef.current
        ) {
            onLivenessEvent({
                type: "turn",
                direction: livenessEvents.headTurnDetected,
            });
            prevHeadTurnRef.current = livenessEvents.headTurnDetected;
        } else if (livenessEvents.headTurnDetected === "center") {
            prevHeadTurnRef.current = "center";
        }
    }, [livenessEvents, onLivenessEvent]);

    // Debounce face detection to prevent flickering
    useEffect(() => {
        if (faceDetected) {
            consecutiveNoFaceFrames.current = 0;
            setStableFaceDetected(true);
        } else {
            consecutiveNoFaceFrames.current += 1;
            if (consecutiveNoFaceFrames.current >= 3) {
                setStableFaceDetected(false);
                setFaceLockTimer(0);
            }
        }
    }, [faceDetected]);

    // Face lock logic - lock face after 2 seconds of continuous detection
    useEffect(() => {
        if (stableFaceDetected && isScanning) {
            const interval = setInterval(() => {
                setFaceLockTimer((prev) => {
                    const newValue = prev + 1;
                    if (newValue >= 20) {
                        clearInterval(interval);
                        onFaceLocked();
                        return newValue;
                    }
                    return newValue;
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [stableFaceDetected, isScanning, onFaceLocked]);

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user",
    };

    const videoConstraintsLarge = {
        width: 1920,
        height: 1080,
        facingMode: "user",
    };

    return (
        <div className="w-full space-y-4">
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-950">
                {/* Webcam Feed */}
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored={true}
                    videoConstraints={videoConstraintsLarge}
                    onUserMedia={handleUserMedia}
                    className="w-full h-full object-cover scale-105"
                />

                {/* Sophisticated dark overlay with gradient edges */}
                <div className="absolute inset-0 pointer-events-none">
                    <svg width="100%" height="100%" className="absolute inset-0">
                        <defs>
                            <radialGradient id="face-vignette">
                                <stop offset="0%" stopColor="black" stopOpacity="0" />
                                <stop offset="40%" stopColor="black" stopOpacity="0" />
                                <stop offset="70%" stopColor="black" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="black" stopOpacity="0.85" />
                            </radialGradient>
                            <linearGradient id="scan-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(100, 200, 255, 0)" />
                                <stop offset="50%" stopColor="rgba(100, 200, 255, 0.9)" />
                                <stop offset="100%" stopColor="rgba(100, 200, 255, 0)" />
                            </linearGradient>
                        </defs>
                        <rect
                            width="100%"
                            height="100%"
                            fill="url(#face-vignette)"
                        />
                    </svg>
                </div>

                {/* Modern Sci-fi Scanning Frame */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 sm:p-6 lg:p-8">
                    <div className="relative w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl h-full">
                        {/* Main circular frame with hexagonal accents */}
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 400 400"
                            className="absolute inset-0"
                            style={{ filter: "drop-shadow(0 0 20px rgba(100, 200, 255, 0.3))" }}
                        >
                        {/* Outer circle frame */}
                        <motion.circle
                            cx="200"
                            cy="200"
                            r="160"
                            fill="none"
                            strokeWidth="1.5"
                            initial={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                            animate={{
                                stroke: stableFaceDetected
                                    ? "rgba(100, 200, 255, 0.8)"
                                    : "rgba(255, 255, 255, 0.3)",
                                strokeWidth: stableFaceDetected ? 2 : 1.5,
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />

                        {/* Inner rotating hexagon */}
                        <motion.path
                            d="M 200,60 L 280,120 L 280,240 L 200,300 L 120,240 L 120,120 Z"
                            fill="none"
                            strokeWidth="1"
                            stroke="rgba(100, 200, 255, 0.4)"
                            animate={{
                                rotate: [0, 360],
                                opacity: [0.4, 0.7, 0.4],
                            }}
                            transition={{
                                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                            }}
                            style={{ transformOrigin: "200px 200px" }}
                        />

                        {/* Corner brackets - larger and more elegant */}
                        {[
                            { x: 40, y: 40, rotate: 0 },
                            { x: 360, y: 40, rotate: 90 },
                            { x: 360, y: 360, rotate: 180 },
                            { x: 40, y: 360, rotate: 270 },
                        ].map((corner, i) => (
                            <motion.g
                                key={i}
                                initial={{ opacity: 0.5 }}
                                animate={{
                                    opacity: stableFaceDetected ? 1 : 0.5,
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <line
                                    x1={corner.x}
                                    y1={corner.y}
                                    x2={corner.x + (corner.rotate === 90 || corner.rotate === 180 ? -40 : 40)}
                                    y2={corner.y}
                                    stroke="rgba(100, 200, 255, 0.9)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                                <line
                                    x1={corner.x}
                                    y1={corner.y}
                                    x2={corner.x}
                                    y2={corner.y + (corner.rotate >= 180 ? -40 : 40)}
                                    stroke="rgba(100, 200, 255, 0.9)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                            </motion.g>
                        ))}

                        {/* Tech details - small decorative elements */}
                        {[...Array(8)].map((_, i) => {
                            const angle = (i * 45 * Math.PI) / 180;
                            const x = 200 + Math.cos(angle) * 175;
                            const y = 200 + Math.sin(angle) * 175;
                            return (
                                <motion.circle
                                    key={`detail-${i}`}
                                    cx={x}
                                    cy={y}
                                    r="3"
                                    fill="rgba(100, 200, 255, 0.6)"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.6, 1, 0.6],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                    style={{ transformOrigin: `${x}px ${y}px` }}
                                />
                            );
                        })}
                        </svg>

                        {/* Scanning beam with modern design */}
                        <AnimatePresence>
                            {isScanning && stableFaceDetected && (
                                <motion.div
                                    className="absolute left-0 right-0 h-1"
                                    style={{
                                        background: "url(#scan-gradient)",
                                        boxShadow: "0 0 30px rgba(100, 200, 255, 0.6), 0 0 60px rgba(100, 200, 255, 0.3)",
                                    }}
                                    initial={{ top: "20%", opacity: 0 }}
                                    animate={{
                                        top: ["20%", "80%", "20%"],
                                        opacity: [0, 1, 0],
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Particle effects around face */}
                        {stableFaceDetected && [...Array(12)].map((_, i) => {
                            const angle = (i * 30 * Math.PI) / 180;
                            const radius = 180;
                            return (
                                <motion.div
                                    key={`particle-${i}`}
                                    className="absolute w-1 h-1 rounded-full bg-cyan-400"
                                    style={{
                                        left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                                        top: `calc(50% + ${Math.sin(angle) * radius}px)`,
                                    }}
                                    animate={{
                                        scale: [0, 1.5, 0],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Corner UI indicators */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] sm:text-xs text-cyan-300 font-medium uppercase tracking-wider">LIVE</span>
                </div>
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2" dir="rtl">
                    <span className="text-[10px] sm:text-xs text-gray-400 font-mono">{new Date().toLocaleTimeString('fa-IR')}</span>
                </div>
            </div>

            {/* Status panel outside the camera box */}
            <div className="rounded-2xl bg-black/80 px-4 py-3 text-center text-white backdrop-blur-sm sm:px-6 sm:py-4 font-vazirmatn" dir="rtl">
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-3"
                    >
                        <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm sm:text-base text-cyan-300">در حال بارگذاری سیستم تشخیص...</p>
                    </motion.div>
                )}

                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm sm:text-base text-red-400 bg-red-500/10 py-2 px-4 rounded-full inline-block"
                    >
                        خطا: {error}
                    </motion.p>
                )}

                {!isLoading && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2 sm:space-y-3"
                    >
                        {challengeText ? (
                            <motion.div
                                key={challengeText}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-cyan-500/20 backdrop-blur-md py-2.5 px-4 sm:py-3 sm:px-6 rounded-2xl border border-cyan-400/30"
                            >
                                <p className="text-sm sm:text-base md:text-lg font-semibold text-cyan-300">
                                    {challengeText}
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm sm:text-base">
                                    {stableFaceDetected ? (
                                        <motion.span
                                            className="text-cyan-300 font-medium"
                                            animate={{ opacity: [0.7, 1, 0.7] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            ✓ چهره شناسایی شد - لطفاً ثابت بمانید
                                        </motion.span>
                                    ) : (
                                        <span className="text-gray-400">
                                            لطفاً صورت خود را در مرکز کادر قرار دهید
                                        </span>
                                    )}
                                </p>

                                {/* Progress indicator - modern style */}
                                {stableFaceDetected && isScanning && (
                                    <div className="w-48 sm:w-56 md:w-64 max-w-full h-1.5 mx-auto bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/30">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{
                                                background: "linear-gradient(90deg, #06b6d4, #22d3ee, #06b6d4)",
                                                boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
                                            }}
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${(faceLockTimer / 20) * 100}%` }}
                                            transition={{ duration: 0.1 }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
