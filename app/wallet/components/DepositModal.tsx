
"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { addTransaction } from '../../../store/walletSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import { Language } from '../../../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const language = useSelector((state: RootState) => state.language.language);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseInt(amount) <= 0) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTransaction = {
      id: Date.now().toString(),
      type: 'deposit' as const,
      amount: parseInt(amount),
      date: new Date().toISOString().split('T')[0],
      description: language === Language.FA ? 'واریز از طریق درگاه' : 'Deposit via gateway',
      status: 'completed' as const
    };
    
    dispatch(addTransaction(newTransaction));
    setLoading(false);
    setAmount('');
    onClose();
    
    // Show success message (in real app use toast)
    alert(translations.success[language]);
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
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
            >
              <X className="w-6 h-6" /> 
            </Button>
          </div>

          <Typography variant="body-lg" className="mb-8 text-muted"> 
            {translations.description[language]}
          </Typography>

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block mb-3 text-lg font-medium"> 
                {translations.amountLabel[language]}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-5 py-4 text-lg rounded-lg border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]" /* py-4 و text-lg اضافه شد */
                placeholder={translations.placeholder[language]}
                required
                min="1000"
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
                disabled={loading}
              >
                {translations.cancel[language]}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg" 
                className="flex-1 py-4"
                disabled={loading || !amount}
              >
                {loading ? translations.depositing[language] : translations.confirm[language]}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}