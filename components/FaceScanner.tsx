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

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-2xl overflow-hidden bg-black">
            {/* Webcam Feed */}
            <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={true}
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
                className="w-full h-full object-cover"
            />

            {/* Darkening overlay around the oval */}
            <div className="absolute inset-0 pointer-events-none">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                        <mask id="oval-mask">
                            <rect width="100%" height="100%" fill="white" />
                            <ellipse cx="50%" cy="50%" rx="35%" ry="45%" fill="black" />
                        </mask>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        fill="rgba(0, 0, 0, 0.7)"
                        mask="url(#oval-mask)"
                    />
                </svg>
            </div>

            {/* Oval Border */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    className="relative"
                    style={{
                        width: "70%",
                        height: "90%",
                    }}
                >
                    {/* Oval frame */}
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 200 260"
                        className="absolute inset-0"
                    >
                        <motion.ellipse
                            cx="100"
                            cy="130"
                            rx="90"
                            ry="120"
                            fill="none"
                            strokeWidth="4"
                            initial={{ stroke: "rgba(255, 255, 255, 0.5)" }}
                            animate={{
                                stroke: stableFaceDetected
                                    ? "rgb(34, 197, 94)"
                                    : "rgba(255, 255, 255, 0.7)",
                                filter: stableFaceDetected
                                    ? "drop-shadow(0 0 10px rgb(34, 197, 94))"
                                    : "none",
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    </svg>

                    {/* Scanning Laser Animation */}
                    <AnimatePresence>
                        {isScanning && stableFaceDetected && (
                            <motion.div
                                className="absolute left-[5%] right-[5%] h-1 rounded-full"
                                style={{
                                    background:
                                        "linear-gradient(90deg, transparent, var(--md-sys-color-primary), transparent)",
                                    boxShadow: "0 0 20px var(--md-sys-color-primary)",
                                }}
                                initial={{ top: "10%", opacity: 0 }}
                                animate={{
                                    top: ["10%", "85%", "10%"],
                                    opacity: [0.8, 1, 0.8],
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[color:var(--md-sys-color-primary)] rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[color:var(--md-sys-color-primary)] rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[color:var(--md-sys-color-primary)] rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[color:var(--md-sys-color-primary)] rounded-br-lg" />
                </motion.div>
            </div>

            {/* Status overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-center text-white font-vazirmatn" dir="rtl">
                    {isLoading && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-gray-300"
                        >
                            در حال بارگذاری...
                        </motion.p>
                    )}

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-400"
                        >
                            خطا: {error}
                        </motion.p>
                    )}

                    {!isLoading && !error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            {challengeText ? (
                                <motion.p
                                    key={challengeText}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-lg font-medium text-[color:var(--md-sys-color-primary)]"
                                >
                                    {challengeText}
                                </motion.p>
                            ) : (
                                <p className="text-sm">
                                    {stableFaceDetected ? (
                                        <span className="text-green-400">
                                            چهره شناسایی شد - لطفاً ثابت بمانید
                                        </span>
                                    ) : (
                                        <span className="text-gray-300">
                                            صورت خود را در کادر قرار دهید
                                        </span>
                                    )}
                                </p>
                            )}

                            {/* Progress indicator */}
                            {stableFaceDetected && isScanning && !challengeText && (
                                <div className="w-32 h-1 mx-auto bg-gray-600 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-green-500 rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${(faceLockTimer / 20) * 100}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
