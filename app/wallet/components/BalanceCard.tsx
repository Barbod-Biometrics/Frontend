
"use client";

import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Language, Theme } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import { ArrowUpRight, Sparkles, Shield, Zap } from 'lucide-react';

interface BalanceCardProps {
  onDepositClick: () => void;
   disabled?: boolean;
}

export default function BalanceCard({ onDepositClick ,disabled = false}: BalanceCardProps) {
  const language = useSelector((state: RootState) => state.language.language);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const { balance, lastUpdated } = useSelector((state: RootState) => state.wallet);

  const translations = {
    availableBalance: {
      en: 'Available Balance',
      fa: 'موجودی قابل استفاده'
    },
    deposit: {
      en: 'Quick Deposit',
      fa: 'واریز سریع'
    },
    currency: {
      en: 'Toman',
      fa: 'تومان'
    },
    lastUpdated: {
      en: 'Last updated',
      fa: 'آخرین بروزرسانی'
    },
    secure: {
      en: 'Secure & Verified',
      fa: 'امن و تأیید شده'
    },
    instant: {
      en: 'Instant Processing',
      fa: 'پردازش آنی'
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString(language === Language.FA ? 'fa-IR' : 'en-US');
  };

  const formatLastUpdated = (dateString?: string) => {
    if (!dateString) return language === Language.FA ? 'هم اکنون' : 'Just now';
    
    const date = new Date(dateString);
    if (language === Language.FA) {
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const cardGradient = theme === Theme.DARK
    ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950'
    : 'bg-gradient-to-br from-white to-slate-100';

  const textColor = theme === Theme.DARK ? 'text-white' : 'text-gray-900';
  
  const badgeBgSecure = theme === Theme.DARK 
    ? 'bg-emerald-500/20' 
    : 'bg-emerald-500/10';
  
  const badgeTextSecure = theme === Theme.DARK 
    ? 'text-emerald-300' 
    : 'text-emerald-600';
  
  const badgeBgInstant = theme === Theme.DARK 
    ? 'bg-blue-500/20' 
    : 'bg-blue-500/10';
  
  const badgeTextInstant = theme === Theme.DARK 
    ? 'text-blue-300' 
    : 'text-blue-600';

  const infoBoxBg = theme === Theme.DARK
    ? 'bg-white/10'
    : 'bg-gray-900/5';
  
  const infoBoxBorder = theme === Theme.DARK
    ? 'border-white/20'
    : 'border-gray-900/10';

  const balanceGradient = theme === Theme.DARK 
    ? 'bg-gradient-to-r from-white to-gray-300' 
    : 'bg-gradient-to-r from-gray-900 to-gray-700';

  return (
    <Card
      variant="elevated"
      hover
      className={`p-8 h-full flex flex-col relative overflow-hidden group border border-[color:var(--md-sys-color-outline-variant)]/70 ${cardGradient}`}
    >
     
      <div className={`absolute inset-0 bg-gradient-to-br ${
        theme === Theme.DARK 
          ? 'from-blue-500/5 via-purple-500/5 to-pink-500/5' 
          : 'from-blue-500/10 via-purple-500/10 to-pink-500/10'
      }`} />
      
      {/* Animated sparkles */}
      <div className="absolute top-4 right-4 animate-pulse">
        <Sparkles className={`w-5 h-5 ${
          theme === Theme.DARK ? 'text-yellow-400/50' : 'text-yellow-500/40'
        }`} />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-10">
          <Typography variant="body-lg" tone="muted" className="mb-2">
            {translations.availableBalance[language]}
          </Typography>
          
          {/* Large balance amount */}
          <div className="flex items-baseline gap-3 mb-6">
            <Typography variant="h1" className={`font-bold ${balanceGradient} bg-clip-text text-transparent`}>
              {formatNumber(balance)}
            </Typography>
            <Typography variant="h3" tone="muted" className="text-3xl font-normal">
              {translations.currency[language]}
            </Typography>
          </div>
          
          {/* Features */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${badgeBgSecure} ${badgeTextSecure}`}>
              <Shield className="w-4 h-4" />
              <Typography variant="caption" className="font-medium">
                {translations.secure[language]}
              </Typography>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${badgeBgInstant} ${badgeTextInstant}`}>
              <Zap className="w-4 h-4" />
              <Typography variant="caption" className="font-medium">
                {translations.instant[language]}
              </Typography>
            </div>
          </div>
        </div>

        {/* Last updated */}
        <div className={`mb-8 p-4 rounded-xl ${infoBoxBg} backdrop-blur-sm border ${infoBoxBorder}`}>
          <div className="flex items-center justify-between">
            <Typography variant="body-sm" tone="muted">
              {translations.lastUpdated[language]}
            </Typography>
            <Typography variant="body-sm" tone="default" className="font-medium">
              {formatLastUpdated(lastUpdated)}
            </Typography>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-auto">
          <Button
            variant="primary"
            size="lg"
            iconLeading={<ArrowUpRight className="w-5 h-5" />}
            onClick={onDepositClick}
            disabled={disabled}
            className={`w-full justify-center py-5 text-lg font-bold rounded-xl 
                      bg-gradient-to-r from-blue-600 to-indigo-600 
                      hover:from-blue-700 hover:to-indigo-700 
                      shadow-xl hover:shadow-2xl 
                      transition-all duration-300 
                      border-0 transform hover:scale-[1.02] ${textColor}`}
          >
            <span className="drop-shadow-md">{translations.deposit[language]}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
