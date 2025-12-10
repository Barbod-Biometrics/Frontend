"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Camera } from "@mediapipe/camera_utils";
import type { FaceMesh, NormalizedLandmark, Results as FaceMeshResults } from "@mediapipe/face_mesh";

type DetectionState = "idle" | "initializing" | "streaming" | "permission-denied" | "error";
type DistanceStatus = "ok" | "too-close" | "too-far";
type LightStatus = "ok" | "dark";
type HeadDirection = "left" | "right" | "center";

interface FaceBox {
    width: number;
    height: number;
    centerX: number;
    centerY: number;
}

interface LivenessMetrics {
    ear: number;
    yaw: number;
    pitch: number;
    roll: number;
    smileScore: number;
    blinkCount: number;
    headDirection: HeadDirection;
    faceBox: FaceBox;
    stability: number;
}

interface LivenessHealth {
    lightStatus: LightStatus;
    distanceStatus: DistanceStatus;
    brightness: number;
    occlusionDetected: boolean;
    glassesFlagged: boolean;
}

interface UseFaceLivenessOptions {
    strictGlasses?: boolean;
    idealBoxWidth?: {
        min: number;
        max: number;
    };
}

interface UseFaceLivenessReturn {
    videoRef: RefObject<HTMLVideoElement | null>;
    status: DetectionState;
    error: string | null;
    facePresent: boolean;
    metrics: LivenessMetrics;
    health: LivenessHealth;
    start: () => Promise<void>;
    stop: () => void;
}

type CameraConstructor = new (
    video: HTMLVideoElement,
    options: {
        onFrame: () => Promise<void> | void;
        width: number;
        height: number;
    },
) => Camera;

type FaceMeshConstructor = new (config?: { locateFile?: (file: string) => string }) => FaceMesh;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const calcBoundingBox = (points: NormalizedLandmark[]): FaceBox => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
        width: maxX - minX,
        height: maxY - minY,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2,
    };
};

const eyeAspectRatio = (landmarks: NormalizedLandmark[], indices: number[]): number => {
    const [p1, p2, p3, p4, p5, p6] = indices.map((i) => landmarks[i]);
    const vertical1 = Math.hypot(p2.x - p6.x, p2.y - p6.y);
    const vertical2 = Math.hypot(p3.x - p5.x, p3.y - p5.y);
    const horizontal = Math.hypot(p1.x - p4.x, p1.y - p4.y);
    return (vertical1 + vertical2) / (2 * horizontal);
};

const computeHeadRotation = (landmarks: NormalizedLandmark[]) => {
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const noseTip = landmarks[4];
    const chin = landmarks[152];

    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    const yaw = (noseTip.x - eyeCenterX) * 90; // +/- ~20 is a notable turn

    // Pitch uses the relative position of the nose to the chin/eyes
    const eyeCenterY = (leftEye.y + rightEye.y) / 2;
    const midFaceY = (chin.y + eyeCenterY) / 2;
    const pitch = (noseTip.y - midFaceY) * -180;

    const roll =
        (Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * 180) /
        Math.PI;

    return { yaw, pitch, roll };
};

const computeSmileScore = (landmarks: NormalizedLandmark[]) => {
    const leftCorner = landmarks[61];
    const rightCorner = landmarks[291];
    const upperLip = landmarks[13];
    const lowerLip = landmarks[14];

    const mouthWidth = Math.hypot(leftCorner.x - rightCorner.x, leftCorner.y - rightCorner.y);
    const mouthHeight = Math.hypot(upperLip.x - lowerLip.x, upperLip.y - lowerLip.y);
    const cornerRaise = (upperLip.y - (leftCorner.y + rightCorner.y) / 2) * -60;

    return mouthWidth / (mouthHeight + 1e-4) + cornerRaise;
};

const averageBrightness = (data: Uint8ClampedArray) => {
    let sum = 0;
    const total = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
        sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    return total ? sum / total : 0;
};

const detectGlassesFromFrame = (
    frame: ImageData,
    landmarks: NormalizedLandmark[],
): boolean => {
    const eyeRegionIndices = [33, 133, 159, 145, 362, 263, 386, 374];
    const xs = eyeRegionIndices.map((i) => clamp(landmarks[i].x));
    const ys = eyeRegionIndices.map((i) => clamp(landmarks[i].y));
    const minX = Math.min(...xs) - 0.03;
    const maxX = Math.max(...xs) + 0.03;
    const minY = Math.min(...ys) - 0.03;
    const maxY = Math.max(...ys) + 0.03;

    const sx = clamp(Math.floor(minX * frame.width), 0, frame.width - 1);
    const sy = clamp(Math.floor(minY * frame.height), 0, frame.height - 1);
    const sw = clamp(Math.ceil((maxX - minX) * frame.width), 4, frame.width - sx);
    const sh = clamp(Math.ceil((maxY - minY) * frame.height), 4, frame.height - sy);

    let brightPixels = 0;
    let darkPixels = 0;
    let sum = 0;
    const total = sw * sh;
    const stride = frame.width * 4;

    for (let y = sy; y < sy + sh; y++) {
        for (let x = sx; x < sx + sw; x++) {
            const idx = y * stride + x * 4;
            const value = (frame.data[idx] + frame.data[idx + 1] + frame.data[idx + 2]) / 3;
            sum += value;
            if (value > 235) brightPixels++;
            if (value < 40) darkPixels++;
        }
    }

    const highlightRatio = brightPixels / Math.max(total, 1);
    const darkRatio = darkPixels / Math.max(total, 1);
    const avg = sum / Math.max(total, 1);

    // Bright glare or thick dark frames around eyes
    return highlightRatio > 0.14 || (darkRatio > 0.6 && avg < 70);
};

const detectOcclusion = (landmarks: NormalizedLandmark[]): boolean => {
    const nose = landmarks[4];
    const jawIndices = [172, 136, 150, 176, 148, 152];
    const cheekIndices = [234, 93, 132, 454, 323, 361];
    const zValues = [...jawIndices, ...cheekIndices].map((i) => landmarks[i].z);
    const jawCloserThanNose = zValues.filter((z) => z < nose.z - 0.07).length;

    const meanZ = zValues.reduce((acc, z) => acc + z, 0) / zValues.length;
    const variance =
        zValues.reduce((acc, z) => acc + (z - meanZ) * (z - meanZ), 0) /
        zValues.length;

    return jawCloserThanNose >= 2 || variance > 0.01;
};

export function useFaceLiveness(
    options: UseFaceLivenessOptions = {},
): UseFaceLivenessReturn {
    const { strictGlasses = true, idealBoxWidth = { min: 0.18, max: 0.55 } } = options;

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const faceMeshRef = useRef<FaceMesh | null>(null);
    const cameraRef = useRef<Camera | null>(null);
    const faceMeshCtorRef = useRef<FaceMeshConstructor | null>(null);
    const cameraCtorRef = useRef<CameraConstructor | null>(null);
    const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const blinkClosingRef = useRef(false);
    const blinkCountRef = useRef(0);
    const glassesRef = useRef(false);
    const lastCenterRef = useRef<{ x: number; y: number } | null>(null);
    const brightnessRef = useRef(0);
    const frameCounterRef = useRef(0);

    const [status, setStatus] = useState<DetectionState>("idle");
    const [error, setError] = useState<string | null>(null);
    const [facePresent, setFacePresent] = useState(false);
    const [metrics, setMetrics] = useState<LivenessMetrics>({
        ear: 0,
        yaw: 0,
        pitch: 0,
        roll: 0,
        smileScore: 0,
        blinkCount: 0,
        headDirection: "center",
        faceBox: { width: 0, height: 0, centerX: 0, centerY: 0 },
        stability: 0,
    });
    const [health, setHealth] = useState<LivenessHealth>({
        lightStatus: "ok",
        distanceStatus: "ok",
        brightness: 0,
        occlusionDetected: false,
        glassesFlagged: false,
    });

    const loadMediaPipe = useCallback(async () => {
        if (faceMeshCtorRef.current && cameraCtorRef.current) return;

        await Promise.all([
            import("@mediapipe/face_mesh"),
            import("@mediapipe/camera_utils"),
        ]);

        const FaceMeshGlobal = (globalThis as any).FaceMesh as FaceMeshConstructor | undefined;
        const CameraGlobal = (globalThis as any).Camera as CameraConstructor | undefined;

        if (!FaceMeshGlobal || !CameraGlobal) {
            throw new Error("ماژول‌های MediaPipe بارگذاری نشد");
        }

        faceMeshCtorRef.current = FaceMeshGlobal;
        cameraCtorRef.current = CameraGlobal;
    }, []);

    useEffect(() => {
        if (typeof document === "undefined") return;
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 240;
        sampleCanvasRef.current = canvas;
    }, []);

    const handleResults = useCallback(
        (results: FaceMeshResults) => {
            const landmarks = results.multiFaceLandmarks?.[0];

            if (!landmarks || landmarks.length === 0) {
                setFacePresent(false);
                setMetrics((prev) => ({
                    ...prev,
                    headDirection: "center",
                }));
                return;
            }

            setFacePresent(true);
            const faceBox = calcBoundingBox(landmarks);
            const stability = (() => {
                const previous = lastCenterRef.current;
                lastCenterRef.current = { x: faceBox.centerX, y: faceBox.centerY };
                if (!previous) return 0.5;
                const movement = Math.hypot(
                    faceBox.centerX - previous.x,
                    faceBox.centerY - previous.y,
                );
                return clamp(1 - movement * 18, 0, 1);
            })();

            const leftEAR = eyeAspectRatio(landmarks, [33, 160, 158, 133, 153, 144]);
            const rightEAR = eyeAspectRatio(landmarks, [362, 385, 387, 263, 373, 380]);
            const ear = (leftEAR + rightEAR) / 2;

            if (!blinkClosingRef.current && ear < 0.21) {
                blinkClosingRef.current = true;
            } else if (blinkClosingRef.current && ear > 0.26) {
                blinkClosingRef.current = false;
                blinkCountRef.current += 1;
            }

            const { yaw, pitch, roll } = computeHeadRotation(landmarks);
            const headDirection: HeadDirection =
                yaw > 10 ? "right" : yaw < -10 ? "left" : "center";

            const smileScore = computeSmileScore(landmarks);

            frameCounterRef.current += 1;
            const shouldSampleFrame = frameCounterRef.current % 2 === 0;
            let brightness = brightnessRef.current;
            let glassesFlagged = glassesRef.current;

            if (
                shouldSampleFrame &&
                sampleCanvasRef.current &&
                videoRef.current &&
                videoRef.current.videoWidth > 0
            ) {
                const canvas = sampleCanvasRef.current;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(
                        videoRef.current,
                        0,
                        0,
                        canvas.width,
                        canvas.height,
                    );
                    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    brightness = averageBrightness(frame.data);
                    brightnessRef.current = brightness;
                    if (strictGlasses) {
                        glassesFlagged = detectGlassesFromFrame(frame, landmarks);
                    } else {
                        glassesFlagged = false;
                    }
                    glassesRef.current = glassesFlagged;
                }
            }

            const distanceStatus: DistanceStatus =
                faceBox.width < idealBoxWidth.min || faceBox.height < 0.22
                    ? "too-far"
                    : faceBox.width > idealBoxWidth.max
                        ? "too-close"
                        : "ok";

            const lightStatus: LightStatus = brightness < 55 ? "dark" : "ok";

            setHealth({
                lightStatus,
                distanceStatus,
                brightness,
                occlusionDetected: detectOcclusion(landmarks),
                glassesFlagged,
            });

            setMetrics({
                ear,
                yaw,
                pitch,
                roll,
                smileScore,
                blinkCount: blinkCountRef.current,
                headDirection,
                faceBox,
                stability,
            });
        },
        [idealBoxWidth.max, idealBoxWidth.min, strictGlasses],
    );

    const start = useCallback(async () => {
        if (typeof window === "undefined") return;
        if (status === "initializing" || status === "streaming") return;
        if (!videoRef.current) {
            setError("دوربین آماده نیست");
            setStatus("error");
            return;
        }

        try {
            setStatus("initializing");
            setError(null);

            await loadMediaPipe();

            const FaceMeshCtor = faceMeshCtorRef.current;
            const CameraCtor = cameraCtorRef.current;

            if (!FaceMeshCtor || !CameraCtor) {
                throw new Error("ماژول‌های MediaPipe در دسترس نیست");
            }

            if (!faceMeshRef.current) {
                const mesh = new FaceMeshCtor({
                    locateFile: (file: string) =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
                });
                mesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.6,
                    minTrackingConfidence: 0.6,
                    selfieMode: true,
                });
                mesh.onResults(handleResults);
                faceMeshRef.current = mesh;
            } else {
                faceMeshRef.current.onResults(handleResults);
            }

            const videoEl = videoRef.current;
            videoEl.muted = true;
            videoEl.playsInline = true;

            const camera = new CameraCtor(videoEl, {
                onFrame: async () => {
                    if (faceMeshRef.current && videoRef.current) {
                        await faceMeshRef.current.send({ image: videoRef.current });
                    }
                },
                width: 640,
                height: 480,
            });

            cameraRef.current = camera;
            await camera.start();
            setStatus("streaming");
        } catch (err) {
            console.error("Camera/FaceMesh error", err);
            const message =
                err instanceof Error ? err.message : "خطا در راه‌اندازی دوربین";
            if (
                message.toLowerCase().includes("permission") ||
                message.toLowerCase().includes("not allowed")
            ) {
                setStatus("permission-denied");
            } else {
                setStatus("error");
            }
            setError(message);
        }
    }, [handleResults, loadMediaPipe, status]);

    const stop = useCallback(() => {
        cameraRef.current?.stop();
        cameraRef.current = null;
        faceMeshRef.current?.close();
        faceMeshRef.current = null;
        setStatus("idle");
        setFacePresent(false);
        blinkCountRef.current = 0;
        blinkClosingRef.current = false;
    }, []);

    useEffect(() => {
        return () => {
            stop();
        };
    }, [stop]);

    return {
        videoRef,
        status,
        error,
        facePresent,
        metrics,
        health,
        start,
        stop,
    };
}
