'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';
import { Logo } from './Logo';
import { Container } from './ui/Container';
import { Typography } from './ui/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../store/store';
import { setTheme } from '../store/themeSlice';
import { Theme, Language } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../lib/useLanguage';

import Image from 'next/image';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; icon?: string }[];
};

const navCopy: Record<
  Language,
  {
    search: string;
    signup: string;
    themeToggle: string;
    services: string;
    docs: string;
    status: string;
    faceRecognition: string;
    livenessDetection: string;
    ocr: string;
  }
> = {
  [Language.EN]: {
    search: 'Search',
    signup: 'Get started',
    themeToggle: 'Toggle theme',
    services: 'Services',
    docs: 'Docs',
    status: 'Status',
    faceRecognition: 'Face Recognition',
    livenessDetection: 'Liveness Detection',
    ocr: 'OCR',
  },
  [Language.FA]: {
    search: 'جستجو',
    signup: 'شروع کنید',
    themeToggle: 'تغییر تم',
    services: 'سرویس‌ها',
    docs: 'مستندات',
    status: 'وضعیت',
    faceRecognition: 'تشخیص چهره',
    livenessDetection: 'تشخیص زنده‌بودن',
    ocr: 'تشخیص نوشتار',
  },
};

export function Navbar({ onNavigate = () => { } }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const { language, dir } = useLanguage();
  const copy = navCopy[language];
  const isFa = language === Language.FA;

  const navItems: NavItem[] = [
    {
      label: copy.services,
      href: 'services',
      children: [
        { label: copy.faceRecognition, href: '/services/face-recognition' },
        { label: copy.livenessDetection, href: '/services/liveness' },
        { label: copy.ocr, href: '/services/ocr' },
      ],
    },
    { label: copy.docs, href: 'docs' },
    { label: language === Language.FA ? 'تماس با تیم فروش' : 'Contact sales', href: '/contact-sales' },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('/')) {
      window.location.assign(href);
    } else {
      onNavigate(href);
    }
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK));
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const surfaceClass = isScrolled
    ? 'bg-[color:var(--md-sys-color-surface-container)]/80 backdrop-blur-md shadow-[var(--elevation-2)] rounded-full mx-4 mt-4 top-4 border border-[color:var(--md-sys-color-outline-variant)]'
    : 'bg-transparent border-b border-transparent';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky z-50 transition-all duration-300 ${surfaceClass} ${isFa ? 'font-vazirmatn' : ''}`}
      dir={dir}
    >
      <div className="relative">
        <Container className={`${isScrolled ? 'py-3.5' : 'py-5'}`}>
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-10">
              <button
                onClick={() => handleNavClick('home')}
                className="flex-shrink-0 rounded-full p-2 transition-colors hover:bg-[color:var(--md-sys-color-surface-variant)]/10"
              >
                <Logo size="medium" />
              </button>

              <div className="hidden items-center gap-1 md:flex">
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => !item.children && handleNavClick(item.href)}
                      className="rounded-full px-6 py-3 text-base font-medium text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-on-surface)]"
                      iconTrailing={item.children && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                        />
                      )}
                    >
                      {item.label}
                    </Button>

                    {item.children && (
                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full mt-2 min-w-[280px] rounded-[var(--radius-lg)] bg-[color:var(--md-sys-color-surface-container)]/95 backdrop-blur-xl border border-[color:var(--md-sys-color-outline-variant)] shadow-[var(--elevation-3)] overflow-hidden"
                            style={{ [dir === 'rtl' ? 'right' : 'left']: 0 }}
                          >
                            <div className="p-2">
                              {item.children.map((child) => (
                                <button
                                  key={child.label}
                                  onClick={() => handleNavClick(child.href)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-sys-color-surface-container-high)] hover:text-[color:var(--md-sys-color-on-surface)] transition-all group text-start"
                                >
                                  {child.icon && (
                                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black/20 border border-white/10 shadow-inner">
                                      <Image
                                        src={child.icon}
                                        alt=""
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                      />
                                    </div>
                                  )}
                                  <span>{child.label}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />

              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface-variant)]"
                aria-label={copy.themeToggle}
              >
                {theme === Theme.DARK ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <div className="hidden items-center gap-2 md:flex">
                <Button
                  size="lg"
                  className="h-12 rounded-full px-9 text-base"
                  onClick={() => handleNavClick('/login')}
                >
                  {copy.signup}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface-variant)] md:hidden"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[color:var(--border-hairline)] bg-[color:var(--surface-elevated)] shadow-[var(--shadow-md)] overflow-hidden"
          >
            <div className="space-y-3 px-4 py-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Button
                    variant="ghost"
                    onClick={() => !item.children && handleNavClick(item.href)}
                    className="w-full justify-start px-4 py-3 text-base text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                  >
                    {item.label}
                  </Button>
                  {item.children && (
                    <div className="mt-1 space-y-1 pl-4">
                      {item.children.map((child) => (
                        <Button
                          key={child.label}
                          variant="ghost"
                          onClick={() => handleNavClick(child.href)}
                          className="w-full justify-start px-4 py-2 text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                        >
                          {child.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="grid gap-2 pt-2">
                <Button
                  size="lg"
                  className="w-full rounded-[var(--radius-md)] text-base shadow-[var(--shadow-sm)] h-14"
                  onClick={() => handleNavClick('/login')}
                >
                  {copy.signup}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
