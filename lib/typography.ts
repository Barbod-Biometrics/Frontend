import React from 'react';
import { Language } from '../types';

const KASHIDA = '\u0640';
const RTL_CHAR_PATTERN = /[\u0600-\u06FF]/;

type KashidaOptions = {
  amount?: number;
  minLength?: number;
};

const defaultOptions: Required<KashidaOptions> = {
  amount: 5,
  minLength: 12,
};

function hasRTL(text: string) {
  return RTL_CHAR_PATTERN.test(text);
}

function lastRTLIndex(text: string) {
  for (let i = text.length - 1; i >= 0; i -= 1) {
    if (RTL_CHAR_PATTERN.test(text[i])) {
      return i;
    }
  }
  return -1;
}

/**
 * Adds kashida characters before the last RTL letter of a string to visually justify the last line.
 * Keeps punctuation and trailing whitespace untouched.
 */
export function applyKashida(
  text: string,
  { amount, minLength }: KashidaOptions = defaultOptions,
) {
  if (!text) return text;

  const finalAmount = Math.max(1, amount ?? defaultOptions.amount);
  const threshold = minLength ?? defaultOptions.minLength;
  const trimmed = text.trimEnd();

  if (trimmed.length < threshold || trimmed.includes(KASHIDA)) {
    return text;
  }

  const rtlIndex = lastRTLIndex(trimmed);
  if (rtlIndex < 0) return text;

  const before = trimmed.slice(0, rtlIndex);
  const target = trimmed[rtlIndex];
  const after = trimmed.slice(rtlIndex + 1);
  const trailingWhitespace = text.slice(trimmed.length);

  return `${before}${KASHIDA.repeat(finalAmount)}${target}${after}${trailingWhitespace}`;
}

/**
 * Applies kashida only when the language is Farsi (or text is RTL).
 */
export function applyKashidaIfNeeded(
  text: string,
  language?: Language,
  options?: KashidaOptions,
) {
  const langIsRTL = language === Language.FA;
  if (!langIsRTL && !hasRTL(text)) return text;
  return applyKashida(text, options);
}

/**
 * Walks React children and applies kashida to string nodes for RTL content.
 */
export function applyKashidaToChildren(
  children: React.ReactNode,
  language?: Language,
  options?: KashidaOptions,
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return applyKashidaIfNeeded(child, language, options);
    }

    if (Array.isArray(child)) {
      return applyKashidaToChildren(child, language, options);
    }

    if (React.isValidElement(child) && child.props?.children) {
      return React.cloneElement(child, {
        children: applyKashidaToChildren(child.props.children, language, options),
      });
    }

    return child;
  });
}

/**
 * Recursively applies kashida to every string value of a copy object/array.
 */
export function applyKashidaToCopy<T>(
  value: T,
  language?: Language,
  options?: KashidaOptions,
): T {
  if (typeof value === 'string') {
    return applyKashidaIfNeeded(value, language, options) as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => applyKashidaToCopy(item, language, options)) as unknown as T;
  }

  if (value && typeof value === 'object') {
    const next: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, val]) => {
      next[key] = applyKashidaToCopy(val, language, options);
    });
    return next as T;
  }

  return value;
}
