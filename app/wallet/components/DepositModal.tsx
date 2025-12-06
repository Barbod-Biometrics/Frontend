"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { createDeposit } from '../../../store/walletSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import { Language } from '../../../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess?: () => void;
}

export default function DepositModal({ isOpen, onClose, onDepositSuccess }: DepositModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const language = useSelector((state: RootState) => state.language.language);
  const { apiLoading } = useSelector((state: RootState) => state.wallet);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const translations = {
    title: {
      en: 'Deposit Funds',
      fa: 'واریز وجه'
    },
    description: {
      en: 'Enter the amount you want to deposit to your wallet',
      fa: 'مبلغ مورد نظر برای واریز به کیف پول را وارد کنید'
    },
    amountLabel: {
      en: 'Amount (Toman)',
      fa: 'مبلغ (تومان)'
    },
    descriptionLabel: {
      en: 'Description (Optional)',
      fa: 'توضیحات (اختیاری)'
    },
    quickAmounts: {
      en: 'Quick Amounts',
      fa: 'مبالغ سریع'
    },
    confirm: {
      en: 'Confirm Deposit',
      fa: 'تأیید واریز'
    },
    cancel: {
      en: 'Cancel',
      fa: 'انصراف'
    },
    depositing: {
      en: 'Processing...',
      fa: 'در حال پردازش...'
    },
    success: {
      en: 'Deposit successful!',
      fa: 'واریز با موفقیت انجام شد!'
    },
    placeholder: {
      en: 'Amount in Toman',
      fa: 'مبلغ به تومان'
    },
    errorMinAmount: {
      en: 'Minimum amount is 1,000 Toman',
      fa: 'حداقل مبلغ ۱,۰۰۰ تومان است'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const amountNum = parseInt(amount);
    
    if (!amount || amountNum <= 0) {
      setError(translations.errorMinAmount[language]);
      return;
    }
    
    if (amountNum < 1000) {
      setError(translations.errorMinAmount[language]);
      return;
    }

    try {
      await dispatch(createDeposit({ 
        amount: amountNum, 
        description: description || undefined 
      })).unwrap();
      
      setAmount('');
      setDescription('');
      onClose();
      
      if (onDepositSuccess) {
        onDepositSuccess();
      }
    } catch (error: any) {
      setError(error || 'An error occurred');
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card variant="elevated" className="w-full max-w-xl"> 
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <Typography variant="h4">
              {translations.title[language]}
            </Typography>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={apiLoading.deposit}
            >
              <X className="w-6 h-6" /> 
            </Button>
          </div>

          <Typography variant="body-lg" className="mb-8 text-muted"> 
            {translations.description[language]}
          </Typography>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <Typography variant="body-sm" className="text-red-600 dark:text-red-400">
                {error}
              </Typography>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-3 text-lg font-medium"> 
                {translations.amountLabel[language]}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="w-full px-5 py-4 text-lg rounded-lg border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]"
                placeholder={translations.placeholder[language]}
                required
                min="1000"
                step="1000"
                disabled={apiLoading.deposit}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-3 text-lg font-medium"> 
                {translations.descriptionLabel[language]}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-4 text-lg rounded-lg border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]"
                placeholder={language === Language.FA ? 'توضیحات واریز' : 'Deposit description'}
                disabled={apiLoading.deposit}
              />
            </div>

            <div className="mb-10"> 
              <Typography variant="body-md" className="mb-4"> 
                {translations.quickAmounts[language]}
              </Typography>
              <div className="grid grid-cols-3 gap-3"> 
                {[100000, 500000, 1000000, 2000000, 5000000, 10000000].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={amount === value.toString() ? 'primary' : 'outline'}
                    size="md"
                    onClick={() => handleQuickAmount(value)}
                    className="py-3"
                    disabled={apiLoading.deposit}
                  >
                    {value.toLocaleString(language === Language.FA ? 'fa-IR' : 'en-US')}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-4"> 
              <Button
                type="button"
                variant="outline"
                size="lg" 
                className="flex-1 py-4" 
                onClick={onClose}
                disabled={apiLoading.deposit}
              >
                {translations.cancel[language]}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg" 
                className="flex-1 py-4"
                disabled={apiLoading.deposit || !amount || parseInt(amount) < 1000}
              >
                {apiLoading.deposit ? translations.depositing[language] : translations.confirm[language]}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}