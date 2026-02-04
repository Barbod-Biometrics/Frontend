"use client";

const PERSIAN_DIGITS = [
  "\u06f0",
  "\u06f1",
  "\u06f2",
  "\u06f3",
  "\u06f4",
  "\u06f5",
  "\u06f6",
  "\u06f7",
  "\u06f8",
  "\u06f9",
];

const ARABIC_DIGITS = [
  "\u0660",
  "\u0661",
  "\u0662",
  "\u0663",
  "\u0664",
  "\u0665",
  "\u0666",
  "\u0667",
  "\u0668",
  "\u0669",
];

export const toEnglishDigits = (value: string) => {
  let result = value;
  PERSIAN_DIGITS.forEach((digit, index) => {
    result = result.replace(new RegExp(digit, "g"), index.toString());
  });
  ARABIC_DIGITS.forEach((digit, index) => {
    result = result.replace(new RegExp(digit, "g"), index.toString());
  });
  return result;
};

export const toPersianDigits = (value: string) =>
  value.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);

export const normalizeNumericInput = (value: string, maxLength?: number) => {
  const english = toEnglishDigits(value);
  const digitsOnly = english.replace(/\D/g, "");
  if (typeof maxLength === "number") {
    return digitsOnly.slice(0, maxLength);
  }
  return digitsOnly;
};

export const normalizeDateInput = (value: string) => {
  const english = toEnglishDigits(value);
  return english.replace(/[^0-9-]/g, "").slice(0, 10);
};
