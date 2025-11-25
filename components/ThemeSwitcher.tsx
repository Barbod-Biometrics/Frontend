"use client";

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setTheme } from '../store/themeSlice';
import { Theme } from '../types';
import { Button } from './ui/Button';

export function ThemeSwitcher() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  const toggleTheme = () => {
    dispatch(setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK));
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === Theme.DARK ? (
            <Sun className="w-5 h-5" />
        ) : (
            <Moon className="w-5 h-5" />
        )}
    </Button>
  );
}
