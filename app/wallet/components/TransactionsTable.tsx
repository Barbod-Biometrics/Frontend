
"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { 
  setCurrentPage, 
  goToNextPage, 
  goToPrevPage 
} from '../../../store/walletSlice';
import { Language } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import TransactionsPagination from './TransactionsPagination';

interface TransactionsTableProps {
  loading: boolean;
}

export default function TransactionsTable({ loading }: TransactionsTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const language = useSelector((state: RootState) => state.language.language);
  const { 
    transactions, 
    currentPage, 
    itemsPerPage, 
    totalPages 
  } = useSelector((state: RootState) => state.wallet);
  
  // Calculate current page transactions
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const translations = {
    transactions: {
      en: 'Recent Transactions',
      fa: 'تراکنش‌های اخیر'
    },
    noTransactions: {
      en: 'No transactions yet',
      fa: 'هنوز تراکنشی وجود ندارد'
    },
    description: {
      en: 'Description',
      fa: 'شرح'
    },
    amount: {
      en: 'Amount',
      fa: 'مبلغ'
    },
    date: {
      en: 'Date',
      fa: 'تاریخ'
    },
    status: {
      en: 'Status',
      fa: 'وضعیت'
    },
    type: {
      en: 'Type',
      fa: 'نوع'
    },
    depositType: {
      en: 'Deposit',
      fa: 'واریز'
    },
    withdrawalType: {
      en: 'Withdrawal',
      fa: 'برداشت'
    },
    completed: {
      en: 'Completed',
      fa: 'تکمیل شده'
    },
    pending: {
      en: 'Pending',
      fa: 'در انتظار'
    },
    failed: {
      en: 'Failed',
      fa: 'ناموفق'
    },
    currency: {
      en: 'Toman',
      fa: 'تومان'
    },
    loading: {
      en: 'Loading...',
      fa: 'در حال بارگذاری...'
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString(language === Language.FA ? 'fa-IR' : 'en-US');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === Language.FA) {
      return date.toLocaleDateString('fa-IR');
    }
    return date.toLocaleDateString('en-US');
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handlePrevPage = () => {
    dispatch(goToPrevPage());
  };

  const handleNextPage = () => {
    dispatch(goToNextPage());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: 'bg-green-500/10', text: 'text-green-600', dot: 'bg-green-500' };
      case 'pending': return { bg: 'bg-yellow-500/10', text: 'text-yellow-600', dot: 'bg-yellow-500' };
      case 'failed': return { bg: 'bg-red-500/10', text: 'text-red-600', dot: 'bg-red-500' };
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-600', dot: 'bg-gray-500' };
    }
  };

  return (
    <Card variant="filled" className="overflow-hidden mt-10">
      <div className="p-6 border-b border-[color:var(--md-sys-color-outline-variant)]">
        <Typography variant="h5">
          {translations.transactions[language]}
        </Typography>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <Typography variant="body-md" className="text-muted">
            {translations.loading[language]}
          </Typography>
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-8 text-center">
          <Typography variant="body-md" className="text-muted">
            {translations.noTransactions[language]}
          </Typography>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--md-sys-color-outline-variant)]">
                  <th className="text-right p-4">
                    <Typography variant="body-md" className="text-muted font-normal">
                      {translations.description[language]}
                    </Typography>
                  </th>
                  <th className="text-right p-4">
                    <Typography variant="body-md" className="text-muted font-normal">
                      {translations.type[language]}
                    </Typography>
                  </th>
                  <th className="text-right p-4">
                    <Typography variant="body-md" className="text-muted font-normal">
                      {translations.amount[language]}
                    </Typography>
                  </th>
                  <th className="text-right p-4">
                    <Typography variant="body-md" className="text-muted font-normal">
                      {translations.date[language]}
                    </Typography>
                  </th>
                  <th className="text-right p-4">
                    <Typography variant="body-md" className="text-muted font-normal">
                      {translations.status[language]}
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => {
                  const statusColors = getStatusColor(transaction.status);
                  return (
                    <tr
                      key={transaction.id}
                      className="border-b border-[color:var(--md-sys-color-outline-variant)]/30 hover:bg-[color:var(--md-sys-color-surface-container-high)] transition-colors"
                    >
                      <td className="p-4">
                        <Typography variant="body-md">
                          {transaction.description}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1 px-4 py-1 rounded-full ${
                          transaction.type === 'deposit'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-red-500/10 text-red-600'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          <Typography variant="caption">
                            {transaction.type === 'deposit'
                              ? translations.depositType[language]
                              : translations.withdrawalType[language]}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="body-md"
                          className={
                            transaction.type === 'deposit'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {transaction.type === 'deposit' ? '+' : '-'}
                          {formatNumber(transaction.amount)}
                          <span className="text-sm text-muted mr-1">
                            {translations.currency[language]}
                          </span>
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="body-md">
                          {formatDate(transaction.date)}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${statusColors.bg} ${statusColors.text}`}>
                          <div className={`w-2 h-2 rounded-full ${statusColors.dot}`}></div>
                          <Typography variant="caption">
                            {translations[transaction.status][language]}
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          {totalPages > 1 && (
            <TransactionsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={transactions.length}
              onPageChange={handlePageChange}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
              language={language}
            />
          )}
        </>
      )}
    </Card>
  );
}