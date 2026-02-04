"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { Typography } from "../ui/Typography";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";
import {
  resolveApiErrorMessage,
  runFaceVerification,
  type FaceVerificationResponse,
} from "../../lib/api/testServices";
import { cn } from "../../lib/utils";
import { ResultPanel } from "./ResultPanel";
import { useWebcam } from "./useWebcam";

type RequestStatus = "idle" | "loading" | "success" | "error";

type FaceVerificationDemoProps = {
  title: string;
  description: string;
  confirmationLabel: string;
  autoCapturePhoto?: boolean;
};

type FaceVerificationCopy = {
  cameraTitle: string;
  capturedTitle: string;
  enableCamera: string;
  enabling: string;
  stopCamera: string;
  capturePhoto: string;
  recordVideo: string;
  recording: string;
  stopRecording: string;
  autoCaptureNote: string;
  runVerification: string;
  runningVerification: string;
  noPhoto: string;
  noVideo: string;
  photoAlt: string;
  meta: {
    remainingAttempts: (count: number) => string;
    rechargeIn: (seconds: number) => string;
  };
  errors: {
    cameraNotReady: string;
    enableCamera: string;
    recordingUnsupported: string;
    missingMedia: string;
    faceFailed: string;
    badRequest: string;
    unauthorized: string;
    rateLimited: string;
    server: string;
  };
};

const FACE_VERIFICATION_COPY: Record<Language, FaceVerificationCopy> = {
  [Language.EN]: {
    cameraTitle: "Camera capture",
    capturedTitle: "Captured media",
    enableCamera: "Enable camera",
    enabling: "Enabling...",
    stopCamera: "Stop camera",
    capturePhoto: "Capture photo",
    recordVideo: "Record 3s video",
    recording: "Recording...",
    stopRecording: "Stop recording",
    autoCaptureNote:
      "A still image is captured automatically when you start recording.",
    runVerification: "Run verification",
    runningVerification: "Running verification...",
    noPhoto: "No photo captured yet.",
    noVideo: "No video captured yet.",
    photoAlt: "Captured face",
    meta: {
      remainingAttempts: (count) => `Remaining attempts: ${count}`,
      rechargeIn: (seconds) => `Recharge in: ${seconds}s`,
    },
    errors: {
      cameraNotReady: "Camera is not ready yet.",
      enableCamera: "Enable the camera before recording.",
      recordingUnsupported: "Video recording is not supported in this browser.",
      missingMedia: "Capture a photo and record a video before submitting.",
      faceFailed: "Face verification request failed.",
      badRequest: "Request was rejected. Check the uploaded files.",
      unauthorized: "Unauthorized. Check your API key.",
      rateLimited: "Too many requests. Try again later.",
      server: "Server error. Please try again.",
    },
  },
  [Language.FA]: {
    cameraTitle: "ثبت با دوربین",
    capturedTitle: "رسانه های ثبت شده",
    enableCamera: "فعال کردن دوربین",
    enabling: "در حال فعال سازی...",
    stopCamera: "توقف دوربین",
    capturePhoto: "گرفتن عکس",
    recordVideo: "ضبط ویدئوی 3 ثانیه ای",
    recording: "در حال ضبط...",
    stopRecording: "توقف ضبط",
    autoCaptureNote: "با شروع ضبط، یک تصویر ثابت به صورت خودکار گرفته می شود.",
    runVerification: "اجرای اعتبارسنجی",
    runningVerification: "در حال اجرای اعتبارسنجی...",
    noPhoto: "هنوز عکسی گرفته نشده است.",
    noVideo: "هنوز ویدیویی ضبط نشده است.",
    photoAlt: "چهره ثبت شده",
    meta: {
      remainingAttempts: (count) => `تلاش های باقی مانده: ${count}`,
      rechargeIn: (seconds) => `امکان تلاش مجدد در: ${seconds} ثانیه`,
    },
    errors: {
      cameraNotReady: "دوربین هنوز آماده نیست.",
      enableCamera: "قبل از ضبط، دوربین را فعال کنید.",
      recordingUnsupported: "ضبط ویدئو در این مرورگر پشتیبانی نمی شود.",
      missingMedia: "قبل از ارسال، یک عکس بگیرید و یک ویدئو ضبط کنید.",
      faceFailed: "درخواست تایید چهره ناموفق بود.",
      badRequest: "درخواست پذیرفته نشد. فایل های ارسالی را بررسی کنید.",
      unauthorized: "مجوز دسترسی نامعتبر است. کلید API را بررسی کنید.",
      rateLimited: "تعداد درخواست ها زیاد است. بعدا دوباره تلاش کنید.",
      server: "خطای سرور. لطفا دوباره تلاش کنید.",
    },
  },
};

const renderMeta = (result?: {
  remaining_attempts?: number;
  recharge_in_seconds?: number;
}, labels?: FaceVerificationCopy["meta"]) => {
  if (!labels) return null;

  const rows = [
    result?.remaining_attempts !== undefined
      ? labels.remainingAttempts(result.remaining_attempts)
      : null,
    result?.recharge_in_seconds !== undefined
      ? labels.rechargeIn(result.recharge_in_seconds)
      : null,
  ].filter(Boolean) as string[];

  if (!rows.length) return null;

  return (
    <div className="mt-3 space-y-1 text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
      {rows.map((row) => (
        <div key={row}>{row}</div>
      ))}
    </div>
  );
};

const pickMimeType = () => {
  if (typeof MediaRecorder === "undefined") return "";
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
};

export function FaceVerificationDemo({
  title,
  description,
  confirmationLabel,
  autoCapturePhoto = false,
}: FaceVerificationDemoProps) {
  const { language, dir } = useLanguage();
  const copy = FACE_VERIFICATION_COPY[language] ?? FACE_VERIFICATION_COPY[Language.EN];
  const isRtl = dir === "rtl";
  const alignClass = isRtl ? "text-right" : "text-left";

  const { videoRef, stream, isActive, isStarting, error, start, stop, setError } =
    useWebcam();

  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordTimerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);

  const [status, setStatus] = useState<RequestStatus>("idle");
  const [result, setResult] = useState<FaceVerificationResponse | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const success =
    typeof result?.success === "boolean" ? result.success : null;
  const raw = useMemo(
    () => (result ? JSON.stringify(result, null, 2) : null),
    [result],
  );

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  useEffect(() => {
    if (!videoFile) {
      setVideoPreview(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  useEffect(() => {
    return () => {
      if (recordTimerRef.current) {
        window.clearTimeout(recordTimerRef.current);
      }
      recorderRef.current?.stop();
    };
  }, []);

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (!video.videoWidth || !video.videoHeight) {
      setError(copy.errors.cameraNotReady);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92),
    );
    if (!blob) return;

    const file = new File([blob], `face-${Date.now()}.jpg`, { type: blob.type });
    setPhotoFile(file);
    setRequestError(null);
    setResult(null);
  };

  const startRecording = () => {
    if (!stream) {
      setRecordError(copy.errors.enableCamera);
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      setRecordError(copy.errors.recordingUnsupported);
      return;
    }
    if (recording) return;

    setRecordError(null);
    chunksRef.current = [];

    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "video/webm",
      });
      const file = new File([blob], `liveness-${Date.now()}.webm`, {
        type: blob.type,
      });
      setVideoFile(file);
      setRecording(false);
    };

    recorder.start();
    setRecording(true);

    if (autoCapturePhoto && !photoFile) {
      capturePhoto();
    }

    recordTimerRef.current = window.setTimeout(() => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    }, 3000);
  };

  const stopRecording = () => {
    if (!recorderRef.current) return;
    if (recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    if (recordTimerRef.current) {
      window.clearTimeout(recordTimerRef.current);
      recordTimerRef.current = null;
    }
  };

  const handleRun = async () => {
    if (!photoFile || !videoFile) {
      setRequestError(copy.errors.missingMedia);
      return;
    }

    setStatus("loading");
    setRequestError(null);
    setResult(null);

    try {
      const response = await runFaceVerification(photoFile, videoFile, { mode: "demo" });
      setResult(response);
      setStatus("success");
    } catch (err) {
      const message = resolveApiErrorMessage(
        err,
        {
          400: copy.errors.badRequest,
          401: copy.errors.unauthorized,
          429: copy.errors.rateLimited,
          500: copy.errors.server,
        },
        copy.errors.faceFailed,
      );
      setRequestError(message);
      setStatus("error");
    }
  };

  const disableCapture = !isActive || recording;

  return (
    <Section spacing="lg" dir={dir}>
      <Container className="space-y-10">
        <div className={cn("space-y-3", alignClass)}>
          <Typography variant="h2" className="text-4xl font-bold">
            {title}
          </Typography>
          <Typography
            variant="body-lg"
            className="text-[color:var(--md-sys-color-on-surface-variant)]"
          >
            {description}
          </Typography>
        </div>

        <Card className="border border-[color:var(--md-sys-color-outline-variant)]/60 bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-2)]">
          <CardHeader className={alignClass}>
            <CardTitle>{copy.cameraTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-black/80">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-64 w-full object-cover"
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              {recordError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {recordError}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={start} disabled={isActive || isStarting}>
                  {isStarting ? copy.enabling : copy.enableCamera}
                </Button>
                <Button variant="ghost" onClick={stop} disabled={!isActive || recording}>
                  {copy.stopCamera}
                </Button>
                {!autoCapturePhoto && (
                  <Button variant="secondary" onClick={capturePhoto} disabled={disableCapture}>
                    {copy.capturePhoto}
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={startRecording}
                  disabled={!isActive || recording}
                >
                  {recording ? copy.recording : copy.recordVideo}
                </Button>
                {recording ? (
                  <Button variant="ghost" onClick={stopRecording}>
                    {copy.stopRecording}
                  </Button>
                ) : null}
              </div>

              {autoCapturePhoto ? (
                <Typography
                  variant="body-sm"
                  className="text-[color:var(--md-sys-color-on-surface-variant)]"
                >
                  {copy.autoCaptureNote}
                </Typography>
              ) : null}
            </div>

            <ResultPanel
              title={confirmationLabel}
              success={success}
              isLoading={status === "loading"}
              message={result?.success ? result?.message : result?.reason ?? result?.message}
              error={requestError}
              raw={raw}
              meta={renderMeta(result ?? undefined, copy.meta)}
              dir={dir}
            />
          </CardContent>
        </Card>

        <Card className="border border-[color:var(--md-sys-color-outline-variant)]/60 bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-2)]">
          <CardHeader className={alignClass}>
            <CardTitle>{copy.capturedTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] p-4">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt={copy.photoAlt}
                  className="h-56 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                  {copy.noPhoto}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] p-4">
              {videoPreview ? (
                <video
                  src={videoPreview}
                  controls
                  className="h-56 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                  {copy.noVideo}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className={cn("flex justify-end", isRtl ? "justify-start" : "")}>
          <Button variant="secondary" onClick={handleRun} disabled={status === "loading"}>
            {status === "loading" ? copy.runningVerification : copy.runVerification}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
