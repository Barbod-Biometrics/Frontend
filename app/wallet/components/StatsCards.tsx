
"use client";

import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Language } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import { Wallet, CreditCard, Receipt } from 'lucide-react';

export default function StatsCards() {
  const language = useSelector((state: RootState) => state.language.language);
  const { totalDeposits, totalWithdrawals, transactionCount } = useSelector(
    (state: RootState) => state.wallet
  );

  const translations = {
    totalDeposits: {
      en: 'Total Deposits',
      fa: 'مجموع واریزی‌ها'
    },
    totalWithdrawals: {
      en: 'Total Withdrawals',
      fa: 'مجموع هزینه ها'
    },
    transactionCount: {
      en: 'Transaction Count',
      fa: 'تعداد تراکنش‌ها'
    },
    currency: {
      en: 'Toman',
      fa: 'تومان'
    },
    transactionsUnit: {
      en: 'transactions',
      fa: 'تراکنش'
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString(language === Language.FA ? 'fa-IR' : 'en-US');
  };

  const stats = [
    {
      title: translations.totalDeposits[language],
      value: totalDeposits,
      icon: Wallet,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      ringColor: 'ring-emerald-500/20',
      formattedValue: `${formatNumber(totalDeposits)} ${translations.currency[language]}`,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      title: translations.totalWithdrawals[language],
      value: totalWithdrawals,
      icon: CreditCard,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      ringColor: 'ring-rose-500/20',
      formattedValue: `${formatNumber(totalWithdrawals)} ${translations.currency[language]}`,
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      title: translations.transactionCount[language],
      value: transactionCount,
      icon: Receipt,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      ringColor: 'ring-indigo-500/20',
      formattedValue: `${formatNumber(transactionCount)} ${translations.transactionsUnit[language]}`,
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <Card
          key={index}
          variant="contrast"
          hover
          className="p-4 group relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
        >
          {/* Background gradient effect - subtle on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-3 transition-opacity duration-300`} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className={`relative p-3 rounded-xl ${stat.bgColor} ${stat.ringColor} ring-1 ring-inset transition-all duration-300 group-hover:scale-105`}>
                {/* Subtle shine effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <stat.icon className={`w-6 h-6 ${stat.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                
              </div>
              
              <div className="flex-1">
                <Typography variant="body-md" tone="muted" className="font-medium">
                  {stat.title}
                </Typography>
              </div>
            </div>
            
            <Typography variant="h4" className="font-bold">
              {stat.formattedValue}
            </Typography>
          </div>
          
          {/* Simple hover effect line - more subtle */}
          <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
        </Card>
      ))}
    </>
  );
}
