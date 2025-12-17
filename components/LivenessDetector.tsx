"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertTriangle,
    CameraOff,
    RefreshCcw,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { useFaceLiveness } from "../lib/useFaceLiveness";
import { cn } from "../lib/utils";
import { Button } from "./ui/Button";

type ChallengeType = "blink" | "turn-left" | "turn-right" | "smile";

type Challenge = {
    id: string;
    type: ChallengeType;
    label: string;
    hint: string;
    required: number;
    holdMs?: number;
};

type FlowPhase = "intro" | "live" | "success" | "denied" | "error";

const CHALLENGE_BANK: Challenge[] = [
    {
        id: "blink-3",
        type: "blink",
        label: "سه بار پشت سر هم پلک بزنید",
        hint: "پلک آرام و طبیعی برای سنجش حرکت پلک.",
        required: 3,
    },
    {
        id: "turn-left",
        type: "turn-left",
        label: "سرتان را کمی به چپ بچرخانید",
        hint: "فقط کمی به چپ، نگاه رو به دوربین.",
        required: 1,
        holdMs: 900,
    },
    {
        id: "turn-right",
        type: "turn-right",
        label: "سرتان را کمی به راست بچرخانید",
        hint: "ثبات سر به راست برای قفل.",
        required: 1,
        holdMs: 900,
    },
    {
        id: "smile",
        type: "smile",
        label: "لبخند بزنید",
        hint: "لبخند ملایم تا حرکت گونه دیده شود.",
        required: 1,
        holdMs: 1200,
    },
];

const toneColors = {
    error: "rgb(239,68,68)",
    warning: "rgb(234,179,8)",
    success: "rgb(34,197,94)",
    ready: "rgb(56,189,248)",
};

const shuffleChallenges = () => {
    const deck = [...CHALLENGE_BANK];
    for (let i = deck.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck.slice(0, 3);
};

const StatusPill = ({
    label,
    tone = "neutral",
}: {
    label: string;
    tone?: "neutral" | "ok" | "warn" | "bad";
}) => {
    const toneClass =
        tone === "ok"
            ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/40"
            : tone === "warn"
                ? "bg-amber-500/15 text-amber-200 border-amber-500/40"
                : tone === "bad"
                    ? "bg-rose-500/15 text-rose-200 border-rose-500/40"
                    : "bg-white/10 text-slate-200 border-white/10";
    return (
        <span className={cn("px-3 py-1 text-xs rounded-full border", toneClass)}>{label}</span>
    );
};

export function LivenessDetector() {
    const [strictGlasses, setStrictGlasses] = useState(true);
    const [phase, setPhase] = useState<FlowPhase>("intro");
    const [challengeQueue, setChallengeQueue] = useState<Challenge[]>(CHALLENGE_BANK);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [blinkBaseline, setBlinkBaseline] = useState(0);
    const [holdStart, setHoldStart] = useState<number | null>(null);
    const [completed, setCompleted] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { videoRef, status, facePresent, metrics, health, start, stop, error } =
        useFaceLiveness({ strictGlasses });

    const activeChallenge = challengeQueue[currentIndex];

    useEffect(() => {
        setMounted(true);
        setChallengeQueue(shuffleChallenges());
    }, []);

    useEffect(() => {
        if (activeChallenge) {
            setBlinkBaseline(metrics.blinkCount);
            setHoldStart(null);
        }
    }, [activeChallenge?.id, metrics.blinkCount]);

    useEffect(() => {
        if (currentIndex >= challengeQueue.length && challengeQueue.length > 0) {
            setCompleted(true);
            setPhase("success");
            stop();
        }
    }, [challengeQueue.length, currentIndex, stop]);

    useEffect(() => {
        if (status === "permission-denied") {
            setPhase("denied");
        } else if (status === "error" && phase !== "success") {
            setPhase("error");
        }
    }, [phase, status]);

    const resetSession = useCallback(() => {
        setChallengeQueue(shuffleChallenges());
        setCurrentIndex(0);
        setCompleted(false);
        setBlinkBaseline(0);
        setHoldStart(null);
        setPhase("intro");
        stop();
    }, [stop]);

    const startSession = useCallback(async () => {
        setChallengeQueue(shuffleChallenges());
        setCurrentIndex(0);
        setCompleted(false);
        setBlinkBaseline(0);
        setHoldStart(null);
        setPhase("live");
        await start();
    }, [start]);

    const isTooDark = health.lightStatus === "dark";
    const isTooFar = health.distanceStatus === "too-far";
    const isTooClose = health.distanceStatus === "too-close";
    const hasOcclusion = health.occlusionDetected;
    const glassesBlocked = strictGlasses && health.glassesFlagged;
    const blocked =
        !facePresent || hasOcclusion || isTooDark || isTooFar || isTooClose || glassesBlocked;

    const activeHoldTarget = activeChallenge?.holdMs ?? 900;

    const completeChallenge = useCallback(() => {
        setHoldStart(null);
        setBlinkBaseline(metrics.blinkCount);
        setCurrentIndex((idx) => idx + 1);
    }, [metrics.blinkCount]);

    useEffect(() => {
        if (!activeChallenge || phase !== "live") return;
        if (blocked) {
            setHoldStart(null);
            return;
        }

        const now = performance.now();

        if (activeChallenge.type === "blink") {
            const done = metrics.blinkCount - blinkBaseline >= activeChallenge.required;
            if (done) {
                completeChallenge();
            }
            return;
        }

        if (activeChallenge.type === "smile") {
            if (metrics.smileScore > 2.2) {
                if (!holdStart) setHoldStart(now);
                if (holdStart && now - holdStart >= activeHoldTarget) {
                    completeChallenge();
                }
            } else {
                setHoldStart(null);
            }
            return;
        }

        const wantsLeft = activeChallenge.type === "turn-left";
        const directionOk =
            (wantsLeft && metrics.headDirection === "left" && metrics.yaw < -10) ||
            (!wantsLeft && metrics.headDirection === "right" && metrics.yaw > 10);

        if (directionOk) {
            if (!holdStart) setHoldStart(now);
            if (holdStart && now - holdStart >= activeHoldTarget) {
                completeChallenge();
            }
        } else {
            setHoldStart(null);
        }
    }, [
        activeChallenge,
        activeHoldTarget,
        blinkBaseline,
        blocked,
        completeChallenge,
        holdStart,
        metrics.blinkCount,
        metrics.headDirection,
        metrics.smileScore,
        metrics.yaw,
        phase,
    ]);

    const holdProgress = useMemo(() => {
        if (!activeChallenge) return 0;
        if (activeChallenge.type === "blink") {
            return Math.min(
                (metrics.blinkCount - blinkBaseline) / activeChallenge.required,
                1,
            );
        }
        if (!holdStart) return 0;
        return Math.min((performance.now() - holdStart) / activeHoldTarget, 1);
    }, [activeChallenge, activeHoldTarget, blinkBaseline, holdStart, metrics.blinkCount]);

    const tone = useMemo(() => {
        if (phase === "success") return "success";
        if (blocked) return "error";
        if (metrics.stability < 0.4) return "warning";
        return "ready";
    }, [blocked, metrics.stability, phase]);

    const instruction = useMemo(() => {
        if (phase === "intro") return "برای شروع، روی دکمه زیر بزنید.";
        if (phase === "success") return "احراز هویت زنده با موفقیت انجام شد.";
        if (phase === "denied") return "دسترسی به دوربین مسدود است. لطفاً اجازه دسترسی را فعال کنید.";
        if (phase === "error") return error || "سیستم تشخیص چهره با خطا مواجه شد.";
        if (!facePresent) return "صورت شما در قاب نیست. کمی نزدیک‌تر شوید.";
        if (hasOcclusion) return "لطفاً دست یا اشیاء روی گونه و چانه را کنار بزنید.";
        if (isTooDark) return "نور محیط کم است. روبه‌روی منبع نور بایستید.";
        if (isTooFar) return "کمی به دوربین نزدیک‌تر شوید.";
        if (isTooClose) return "کمی عقب‌تر بروید تا صورت کامل دیده شود.";
        if (glassesBlocked) return "لطفاً عینک را بردارید (حالت سختگیر فعال است).";
        if (activeChallenge) return activeChallenge.label;
        if (status === "initializing") return "در حال آماده‌سازی مدل...";
        return "صورت را داخل قاب نگه دارید تا شروع کنیم.";
    }, [
        activeChallenge,
        error,
        facePresent,
        glassesBlocked,
        hasOcclusion,
        isTooClose,
        isTooDark,
        isTooFar,
        phase,
        status,
    ]);

    return (
        <div
            className="min-h-screen max-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-3 py-4 font-vazirmatn"
            dir="rtl"
        >
            <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr,0.9fr] gap-5 h-[calc(100vh-2rem)]">
                <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-sky-950/30 p-5 md:p-6 backdrop-blur flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-slate-300">مرحله احراز هویت زنده</p>
                            <h2 className="text-2xl font-bold text-white mt-1">تطبیق چهره و زنده بودن</h2>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={resetSession}
                                className="rounded-full"
                                aria-label="بازنشانی"
                            >
                                <RefreshCcw size={18} />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => setStrictGlasses((v) => !v)}
                                className={cn(
                                    "rounded-full",
                                    strictGlasses ? "border-emerald-400/50 text-emerald-200" : "opacity-80",
                                )}
                                aria-label="سیاست عینک"
                                title="سیاست سختگیر نسبت به عینک"
                            >
                                <Sparkles size={18} />
                            </Button>
                        </div>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 aspect-[3/4] flex-1">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            playsInline
                        />

                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/60" />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-[70%] h-[86%]" viewBox="0 0 200 240">
                                <motion.ellipse
                                    cx="100"
                                    cy="120"
                                    rx="85"
                                    ry="110"
                                    fill="none"
                                    strokeWidth="5"
                                    initial={{ stroke: "rgba(255,255,255,0.5)" }}
                                    animate={{
                                        stroke: toneColors[tone as keyof typeof toneColors],
                                        filter:
                                            tone === "success"
                                                ? "drop-shadow(0 0 12px rgba(34,197,94,0.8))"
                                                : tone === "error"
                                                    ? "drop-shadow(0 0 10px rgba(248,113,113,0.6))"
                                                    : "none",
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            </svg>
                        </div>

                        <AnimatePresence>
                            {tone === "success" && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <ShieldCheck className="text-emerald-400" size={80} strokeWidth={2.5} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            className="absolute top-6 left-4 right-4 mx-auto max-w-md rounded-full px-4 py-2 text-center text-sm backdrop-blur bg-black/50 border border-white/10 shadow-lg"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {instruction}
                        </motion.div>

                        <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex flex-wrap items-center gap-3 justify-center text-xs text-slate-200">
                                <StatusPill
                                    label={isTooDark ? "نور کم" : "نور مناسب"}
                                    tone={isTooDark ? "warn" : "ok"}
                                />
                                <StatusPill
                                    label={
                                        isTooFar
                                            ? "خیلی دور"
                                            : isTooClose
                                                ? "خیلی نزدیک"
                                                : "فاصله مناسب"
                                    }
                                    tone={isTooFar || isTooClose ? "warn" : "ok"}
                                />
                                <StatusPill
                                    label={hasOcclusion ? "انسداد صورت" : "صورت آزاد"}
                                    tone={hasOcclusion ? "bad" : "ok"}
                                />
                                <StatusPill
                                    label={glassesBlocked ? "عینک شناسایی شد" : "بدون عینک مزاحم"}
                                    tone={glassesBlocked ? "warn" : "ok"}
                                />
                                <StatusPill
                                    label={`پلک‌ها: ${metrics.blinkCount}`}
                                    tone="neutral"
                                />
                            </div>

                            <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-amber-300 via-sky-300 to-emerald-400"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${holdProgress * 100}%` }}
                                    transition={{ duration: 0.15 }}
                                />
                            </div>
                            {activeChallenge && (
                                <p className="text-center text-xs text-slate-300 mt-2">
                                    {activeChallenge.hint}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-3 overflow-hidden flex flex-col">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-xs text-slate-300">چالش‌های زنده</p>
                                <h3 className="text-lg font-semibold">الزام‌های امنیتی</h3>
                            </div>
                            <span className="text-sm text-slate-300">
                                {currentIndex}/{challengeQueue.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {challengeQueue.map((c, idx) => {
                                const state =
                                    idx < currentIndex
                                        ? "done"
                                        : idx === currentIndex && !completed
                                            ? "active"
                                            : "pending";
                                return (
                                    <div
                                        key={c.id}
                                        className={cn(
                                            "p-3 rounded-2xl border flex items-center justify-between",
                                            state === "done"
                                                ? "border-emerald-400/40 bg-emerald-500/10"
                                                : state === "active"
                                                    ? "border-amber-400/40 bg-amber-500/5"
                                                    : "border-white/10 bg-white/5",
                                        )}
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-white">{c.label}</p>
                                            <p className="text-xs text-slate-300 mt-0.5">{c.hint}</p>
                                        </div>
                                        {state === "done" ? (
                                            <ShieldCheck size={22} className="text-emerald-300" />
                                        ) : state === "active" ? (
                                            <Sparkles size={20} className="text-amber-300" />
                                        ) : (
                                            <AlertTriangle size={20} className="text-slate-400" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur shadow-lg space-y-3 flex-1 overflow-hidden">
                        {phase === "intro" && (
                            <div className="space-y-3">
                                <h4 className="text-lg font-semibold text-white">مراحل انجام کار</h4>
                                <p className="text-sm text-slate-200">
                                    بدون اسکرول، سه چالش کوتاه را پشت سر هم انجام دهید.
                                </p>
                                <Button
                                    className="w-full h-12 rounded-2xl"
                                    onClick={startSession}
                                >
                                    شروع تشخیص زنده بودن
                                </Button>
                            </div>
                        )}

                        {phase === "denied" && (
                            <div className="space-y-3 text-amber-200">
                                <div className="flex items-center gap-2 text-amber-300">
                                    <CameraOff size={20} />
                                    <span>دسترسی دوربین مسدود است.</span>
                                </div>
                                <p className="text-sm text-slate-200">
                                    از تنظیمات مرورگر، اجازه دسترسی به دوربین را فعال و صفحه را تازه کنید.
                                </p>
                                <Button className="w-full rounded-2xl" onClick={startSession}>
                                    تلاش مجدد
                                </Button>
                            </div>
                        )}

                        {phase === "error" && (
                            <div className="space-y-3 text-rose-200">
                                <div className="flex items-center gap-2 text-rose-300">
                                    <AlertTriangle size={20} />
                                    <span>مشکل فنی در تشخیص.</span>
                                </div>
                                <p className="text-sm text-slate-200">
                                    {error || "دوباره تلاش کنید یا صفحه را تازه نمایید."}
                                </p>
                                <Button className="w-full rounded-2xl" onClick={startSession}>
                                    تلاش دوباره
                                </Button>
                            </div>
                        )}

                        {phase === "success" && (
                            <div className="space-y-3 text-emerald-200">
                                <div className="flex items-center gap-2 text-emerald-300">
                                    <ShieldCheck size={20} />
                                    <span>همه چالش‌ها با موفقیت انجام شد.</span>
                                </div>
                                <p className="text-sm text-slate-200">
                                    داده لندمارک بدون انسداد، نور کافی و فاصله مناسب تأیید شد.
                                </p>
                                <Button className="w-full rounded-2xl" onClick={resetSession}>
                                    شروع دوباره
                                </Button>
                            </div>
                        )}

                        {phase === "live" && (
                            <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-xs text-slate-400 mb-1">EAR (پلک)</p>
                                    <p className="text-lg font-semibold">{metrics.ear.toFixed(2)}</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-xs text-slate-400 mb-1">Yaw/Pitch</p>
                                    <p className="text-lg font-semibold">
                                        {metrics.yaw.toFixed(1)}° / {metrics.pitch.toFixed(1)}°
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-xs text-slate-400 mb-1">روشنایی</p>
                                    <p className="text-lg font-semibold">
                                        {Math.round(health.brightness)} / 255
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-xs text-slate-400 mb-1">ثبات فریم</p>
                                    <p className="text-lg font-semibold">
                                        {(metrics.stability * 100).toFixed(0)}%
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
