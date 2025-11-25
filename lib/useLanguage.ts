"use client";

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { setLanguage as setLanguageAction } from '../store/languageSlice';
import {
  DEFAULT_LANGUAGE,
  RTL_LANGUAGES,
  translations,
} from './translations';
import { Language } from '../types';

interface UseLanguageResult {
  language: Language;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
  setLanguage: (language: Language) => void;
}

export function useLanguage(): UseLanguageResult {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language.language);

  // Removed side-effects (useEffect) from here.
  // Initialization and Persistence are now handled by LanguageProvider.tsx

  const setLanguage = useCallback(
    (nextLanguage: Language) => {
      dispatch(setLanguageAction(nextLanguage));
    },
    [dispatch],
  );

  const dir = useMemo<'rtl' | 'ltr'>(
    () => (RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr'),
    [language],
  );

  const t = useCallback(
    (key: string) => {
      const dictionary = translations[language] ?? translations[DEFAULT_LANGUAGE];
      return dictionary[key] ?? key;
    },
    [language],
  );

  return {
    language,
    dir,
    t,
    setLanguage,
  };
}
