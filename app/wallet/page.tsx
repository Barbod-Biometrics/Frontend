// app/wallet/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchWalletSummary, fetchWalletTransactions  } from '../../store/walletSlice';
import { Container } from '../../components/ui/Container';
import { Section } from '../../components/ui/Section';
import { Typography } from '../..//components/ui/Typography';
import { Wallet } from 'lucide-react';
import BalanceCard from './components/BalanceCard';
import StatsCards from './components/StatsCards';
import TransactionsTable from './components/TransactionsTable';
import DepositModal from './components/DepositModal';

export default function WalletPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { language } = useSelector((state: RootState) => state.language);
  const { theme } = useSelector((state: RootState) => state.theme);
   const { apiLoading } = useSelector((state: RootState) => state.wallet);
  
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

   useEffect(() => {
   
    const loadWalletData = async () => {
      try {
        await dispatch(fetchWalletSummary()).unwrap();
        await dispatch(fetchWalletTransactions({ page: 1, pageSize: 10 })).unwrap();
      } catch (error) {
        console.error('Failed to load wallet data:', error);
      }
    };
    
    loadWalletData();
  }, [dispatch]);

  const translations = {
    pageTitle: {
      en: 'Wallet',
      fa: 'کیف پول'
    },
    pageDescription: {
      en: 'Manage your balance and track transactions',
      fa: 'موجودی خود را مدیریت و تراکنش‌ها را پیگیری کنید'
    }
  };

  return (
    <Container size="xl">
      <Section spacing="md">
        {/* Page Header */}
        <div className="mb-8 mt-14">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              {/* Background circle with gradient */}
              <div className="absolute inset-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl blur-md opacity-30"></div>
              
              {/* Main icon container */}
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                {/* Inner icon with white background */}
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <Typography variant="h2" component="h1" className="font-bold">
                {translations.pageTitle[language]}
              </Typography>
            </div>
          </div>
          <Typography variant="body-lg" className="text-muted">
            {translations.pageDescription[language]}
          </Typography>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Balance Card - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <BalanceCard onDepositClick={() => setIsDepositModalOpen(true)} />
          </div>
          
          {/* Stats Cards - Takes 1/3 width on large screens */}
          <div className="space-y-4">
            <StatsCards />
          </div>
        </div>

        {/* Transactions Table */}
        <TransactionsTable loading={apiLoading.transactions || apiLoading.summary} />

        {/* Deposit Modal */}
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
        />
      </Section>
    </Container>
  );
}