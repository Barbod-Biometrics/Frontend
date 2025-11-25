import { Language, Translations } from '../types';

export const DEFAULT_LANGUAGE = Language.EN;
export const RTL_LANGUAGES = [Language.FA];

// Note: Most content is handled directly in components in the user's example,
// but we provide this map for shared keys if needed.
export const translations: Record<Language, Translations> = {
  [Language.EN]: {
    greeting: 'Hello',
  },
  [Language.FA]: {
    greeting: 'سلام',
  },
};
