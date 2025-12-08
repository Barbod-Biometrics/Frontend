"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    FaceLandmarker,
    FilesetResolver,
    FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

interface FaceDetectionResult {
    detected: boolean;
    landmarks: FaceLandmarkerResult | null;
}

interface LivenessEvents {
    blinkDetected: boolean;
    headTurnDetected: "left" | "right" | "center";
}

interface UseFaceDetectionReturn {
    isLoading: boolean;
    error: string | null;
    faceDetected: boolean;
    livenessEvents: LivenessEvents;
    startDetection: (video: HTMLVideoElement) => void;
    stopDetection: () => void;
}

// Eye Aspect Ratio (EAR) calculation for blink detection
function calculateEyeAspectRatio(landmarks: any[], eyeIndices: number[]): number {
    // Eye landmarks: [outer, top1, top2, inner, bottom1, bottom2]
    const [p1, p2, p3, p4, p5, p6] = eyeIndices.map(i => landmarks[i]);

    // Vertical distances
    const v1 = Math.hypot(p2.x - p6.x, p2.y - p6.y);
    const v2 = Math.hypot(p3.x - p5.x, p3.y - p5.y);

    // Horizontal distance
    const h = Math.hypot(p1.x - p4.x, p1.y - p4.y);

    // EAR formula
    return (v1 + v2) / (2.0 * h);
}

// Head pose estimation from facial landmarks
function estimateHeadPose(landmarks: any[]): { yaw: number; pitch: number; roll: number } {
    // Using key facial points for pose estimation
    const noseTip = landmarks[1];
    const leftEyeOuter = landmarks[33];
    const rightEyeOuter = landmarks[263];
    const chin = landmarks[152];

    // Calculate face center
    const centerX = (leftEyeOuter.x + rightEyeOuter.x) / 2;

    // Yaw (left-right rotation) - nose position relative to eye center
    const yaw = (noseTip.x - centerX) * 100; // Amplify for sensitivity

    // Pitch (up-down tilt) - chin to nose vertical distance
    const pitch = (noseTip.y - chin.y) * 100;

    // Roll (head tilt) - eye line angle
    const roll = Math.atan2(
        rightEyeOuter.y - leftEyeOuter.y,
        rightEyeOuter.x - leftEyeOuter.x
    ) * (180 / Math.PI);

    return { yaw, pitch, roll };
}

export function useFaceDetection(): UseFaceDetectionReturn {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [faceDetected, setFaceDetected] = useState(false);
    const [livenessEvents, setLivenessEvents] = useState<LivenessEvents>({
        blinkDetected: false,
        headTurnDetected: "center",
    });

    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const isRunningRef = useRef(false);

    // Blink detection state
    const previousEARRef = useRef<number>(0.3);
    const blinkThreshold = 0.2;
    const blinkCooldownRef = useRef<number>(0);

    // Head turn detection state
    const previousYawRef = useRef<number>(0);

    // Initialize MediaPipe FaceLandmarker
    useEffect(() => {
        let isMounted = true;

        const initializeLandmarker = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Load the vision WASM
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                // Create FaceLandmarker with VIDEO running mode
                const landmarker = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                        delegate: "GPU",
                    },
                    runningMode: "VIDEO",
                    numFaces: 1,
                    minFaceDetectionConfidence: 0.5,
                    minFacePresenceConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                if (isMounted) {
                    faceLandmarkerRef.current = landmarker;
                    setIsLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Failed to initialize FaceLandmarker:", err);
                    setError(
                        err instanceof Error ? err.message : "Failed to load face landmarker"
                    );
                    setIsLoading(false);
                }
            }
        };

        initializeLandmarker();

        return () => {
            isMounted = false;
            if (faceLandmarkerRef.current) {
                faceLandmarkerRef.current.close();
                faceLandmarkerRef.current = null;
            }
        };
    }, []);

    // Detection loop using requestAnimationFrame
    const detectFaces = useCallback(() => {
        if (
            !isRunningRef.current ||
            !faceLandmarkerRef.current ||
            !videoRef.current
        ) {
            return;
        }

        const video = videoRef.current;

        // Ensure video is ready
        if (video.readyState >= 2) {
            try {
                const startTimeMs = performance.now();
                const results = faceLandmarkerRef.current.detectForVideo(
                    video,
                    startTimeMs
                );

                if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                    setFaceDetected(true);
                    const landmarks = results.faceLandmarks[0];

                    // Blink detection using Eye Aspect Ratio
                    // Left eye indices: 33, 160, 158, 133, 153, 144
                    // Right eye indices: 362, 385, 387, 263, 373, 380
                    const leftEAR = calculateEyeAspectRatio(landmarks, [33, 160, 158, 133, 153, 144]);
                    const rightEAR = calculateEyeAspectRatio(landmarks, [362, 385, 387, 263, 373, 380]);
                    const avgEAR = (leftEAR + rightEAR) / 2;

                    // Detect blink: EAR drops below threshold then rises back
                    if (blinkCooldownRef.current <= 0) {
                        if (previousEARRef.current > blinkThreshold && avgEAR < blinkThreshold) {
                            setLivenessEvents(prev => ({ ...prev, blinkDetected: true }));
                            blinkCooldownRef.current = 30; // Cooldown for ~0.5 seconds
                        }
                    } else {
                        blinkCooldownRef.current--;
                    }
                    previousEARRef.current = avgEAR;

                    // Head pose estimation
                    const pose = estimateHeadPose(landmarks);

                    // Determine head turn direction based on yaw
                    let headTurnDetected: "left" | "right" | "center" = "center";
                    if (pose.yaw > 3) {
                        headTurnDetected = "right";
                    } else if (pose.yaw < -3) {
                        headTurnDetected = "left";
                    }

                    setLivenessEvents(prev => ({ ...prev, headTurnDetected }));
                    previousYawRef.current = pose.yaw;

                } else {
                    setFaceDetected(false);
                }
            } catch (err) {
                console.error("Detection error:", err);
            }
        }

        // Continue the detection loop
        animationFrameRef.current = requestAnimationFrame(detectFaces);
    }, []);

    const startDetection = useCallback(
        (video: HTMLVideoElement) => {
            if (isLoading || error) {
                return;
            }

            videoRef.current = video;
            isRunningRef.current = true;

            // Reset detection state
            setLivenessEvents({
                blinkDetected: false,
                headTurnDetected: "center",
            });
            blinkCooldownRef.current = 0;

            detectFaces();
        },
        [isLoading, error, detectFaces]
    );

    const stopDetection = useCallback(() => {
        isRunningRef.current = false;
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        setFaceDetected(false);
        setLivenessEvents({
            blinkDetected: false,
            headTurnDetected: "center",
        });
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopDetection();
        };
    }, [stopDetection]);

    return {
        isLoading,
        error,
        faceDetected,
        livenessEvents,
        startDetection,
        stopDetection,
    };
}
