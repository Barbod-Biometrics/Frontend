"use client";

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setTheme } from '../store/themeSlice';
import { Theme } from '../types';

const THEME_STORAGE_KEY = 'barbod-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const hasHydratedTheme = useRef(false);

  // Hydrate theme from localStorage or prefers-color-scheme on first load
  useEffect(() => {
    if (typeof window === 'undefined' || hasHydratedTheme.current) return;
    
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme && (Object.values(Theme).includes(storedTheme))) {
      dispatch(setTheme(storedTheme));
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(prefersDark ? Theme.DARK : Theme.LIGHT));
    }

    hasHydratedTheme.current = true;
  }, [dispatch]);

  // Sync theme to DOM and LocalStorage
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    
    // Update data-theme attribute for CSS variables
    root.setAttribute('data-theme', theme);

    if (typeof window !== 'undefined' && hasHydratedTheme.current) {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  return <>{children}</>;
}
