"use client";

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Theme } from "../types";
import FaultyTerminal from "./FaultyTerminal";

const TERMINAL_SCALE = 1;
const TERMINAL_GRID: [number, number] = [2, 1];
const TERMINAL_DIGIT_SIZE = 1.5;
const TERMINAL_OPACITY = 0.6;

const DARK_BACKGROUND = "#0c0f16";
const LIGHT_BACKGROUND = "#ffffff";
const DARK_TINT = "#2ea7ff";
const LIGHT_TINT = "#9fd6ff";
const DARK_BRIGHTNESS = 0.55;
const LIGHT_BRIGHTNESS = 0.9;

export default function DashboardTerminalBackground() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isLight = theme === Theme.LIGHT;

  return (
    <FaultyTerminal
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{ opacity: TERMINAL_OPACITY }}
      scale={TERMINAL_SCALE}
      gridMul={TERMINAL_GRID}
      digitSize={TERMINAL_DIGIT_SIZE}
      tint={isLight ? LIGHT_TINT : DARK_TINT}
      backgroundColor={isLight ? LIGHT_BACKGROUND : DARK_BACKGROUND}
      brightness={isLight ? LIGHT_BRIGHTNESS : DARK_BRIGHTNESS}
    />
  );
}
