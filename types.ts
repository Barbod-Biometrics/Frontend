export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum Language {
  EN = 'en',
  FA = 'fa',
}

export type TranslationKey =
  | 'badge'
  | 'headingTop'
  | 'headingHighlight'
  | 'description'
  | 'primaryCta'
  | 'secondaryCta'
  | 'codeStatus'
  | 'compliance';

export type Translations = Record<string, string>;
