// src/constants/promptConstants.ts

import type { AspectRatio } from "../types/promptTypes";

export const SHOT_TYPES = [
  "Extreme Close-Up",
  "Close-Up",
  "Medium Close-Up",
  "Medium Shot",
  "Medium Full Shot",
  "Full Shot",
  "Long Shot",
  "Extreme Long Shot",
];

export const CAMERA_ANGLES = [
  "Eye Level",
  "High Angle",
  "Low Angle",
  "Bird's Eye View",
  "Worm's Eye View",
  "Dutch Angle",
  "Over-the-Shoulder",
];

export const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
  { label: "Cuadrado (1:1)", value: "1:1" },
  { label: "Vertical (3:4)", value: "3:4" },
  { label: "Vertical (9:16)", value: "9:16" },
  { label: "Horizontal (4:3)", value: "4:3" },
  { label: "Horizontal (16:9)", value: "16:9" },
];
