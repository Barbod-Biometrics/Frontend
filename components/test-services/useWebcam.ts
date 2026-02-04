"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";

type UseWebcamResult = {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  isActive: boolean;
  isStarting: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  setError: (value: string | null) => void;
};

type WebcamCopy = {
  unsupported: string;
  unableToAccess: string;
};

const WEBCAM_COPY: Record<Language, WebcamCopy> = {
  [Language.EN]: {
    unsupported: "Camera access is not supported in this browser.",
    unableToAccess: "Unable to access the camera.",
  },
  [Language.FA]: {
    unsupported: "دسترسی به دوربین در این مرورگر پشتیبانی نمی شود.",
    unableToAccess: "امکان دسترسی به دوربین وجود ندارد.",
  },
};

export function useWebcam(): UseWebcamResult {
  const { language } = useLanguage();
  const copy = WEBCAM_COPY[language] ?? WEBCAM_COPY[Language.EN];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    if (stream || isStarting) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(copy.unsupported);
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(nextStream);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : copy.unableToAccess;
      setError(message);
    } finally {
      setIsStarting(false);
    }
  }, [copy, isStarting, stream]);

  const stop = useCallback(() => {
    setStream((current) => {
      current?.getTracks().forEach((track) => track.stop());
      return null;
    });
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    if (stream) {
      videoRef.current.srcObject = stream;
    } else {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  useEffect(() => () => stop(), [stop]);

  return {
    videoRef,
    stream,
    isActive: Boolean(stream),
    isStarting,
    error,
    start,
    stop,
    setError,
  };
}
