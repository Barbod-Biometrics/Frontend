import { describe, expect, it } from "vitest";

import {
  normalizeNumericInput,
  toEnglishDigits,
  toPersianDigits,
} from "@/lib/numberFormat";

describe("numberFormat", () => {
  it("converts Persian and Arabic digits to English", () => {
    const persian = "\u06f1\u06f2\u06f3";
    const arabic = "\u0664\u0665\u0666";
    expect(toEnglishDigits(`${persian}${arabic}`)).toBe("123456");
  });

  it("converts English digits to Persian", () => {
    expect(toPersianDigits("0123")).toBe("\u06f0\u06f1\u06f2\u06f3");
  });

  it("normalizes numeric input and respects max length", () => {
    const input = "+98 (\u06f1\u06f2\u06f3) - \u0664\u0665";
    expect(normalizeNumericInput(input)).toBe("9812345");
    expect(normalizeNumericInput(input, 4)).toBe("9812");
  });
});
