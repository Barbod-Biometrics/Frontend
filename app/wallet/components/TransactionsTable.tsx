
"use client";

import  { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import {  setCurrentPage,  goToNextPage,  goToPrevPage, fetchWalletTransactions} from '../../../store/walletSlice';
import { Language } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import TransactionsPagination from './TransactionsPagination';

interface TransactionsTableProps {
  loading: boolean;
}

export default function TransactionsTable({ loading: propLoading }: TransactionsTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const language = useSelector((state: RootState) => state.language.language);
  const { 
    transactions, 
    currentPage, 
    itemsPerPage, 
    totalPages,
    transactionCount,
    currentProfileId,
    apiLoading
  } = useSelector((state: RootState) => state.wallet);
  
  const [prevProfileId, setPrevProfileId] = useState<string | undefined>(undefined);

  useEffect(() => {
  if (!currentProfileId) {
    return;
  }
  
  
  dispatch(fetchWalletTransactions({ 
    page: currentPage, 
    pageSize: itemsPerPage,
    profileId: currentProfileId,
    reset: currentPage === 1 
  }));
  
}, [dispatch, currentPage, currentProfileId, itemsPerPage]);

  
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, transactionCount);
  
 
  const displayTransactions = transactions.length > 0 ? transactions : [];
  
 
  const isLoading = propLoading || apiLoading.transactions;

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
    try {
      const date = new Date(dateString);
      if (language === Language.FA) {
        return date.toLocaleDateString('fa-IR');
      }
      return date.toLocaleDateString('en-US');
    } catch {
      return dateString;
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(goToPrevPage());
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(goToNextPage());
    }
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
    <Card variant="contrast" className="overflow-hidden mt-4">
      <div className="p-5 border-b border-[color:var(--md-sys-color-outline-variant)]">
        <Typography variant="h5">
          {translations.transactions[language]}
        </Typography>
      </div>

      {isLoading ? (
        <div className="p-6 text-center">
          <Typography variant="body-md" tone="muted">
            {translations.loading[language]}
          </Typography>
        </div>
      ) : displayTransactions.length === 0 ? (
        <div className="p-6 text-center">
          <Typography variant="body-md" tone="muted">
            {translations.noTransactions[language]}
          </Typography>
        </div>
      ) : (
        <>
          <div className="max-h-[32vh] overflow-x-auto overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-right p-4 border-b border-[color:var(--md-sys-color-outline)]/70">
                    <Typography variant="body-md" tone="muted" className="font-normal">
                      {translations.description[language]}
                    </Typography>
                  </th>
                 
                  <th className="text-right p-4">
                    <Typography variant="body-md" tone="muted" className="font-normal">
                      {translations.amount[language]}
                    </Typography>
                  </th>
                  <th className="text-right p-4">
                    <Typography variant="body-md" tone="muted" className="font-normal">
                      {translations.date[language]}
                    </Typography>
                  </th>
                  <th className="text-right p-4">
                    <Typography variant="body-md" tone="muted" className="font-normal">
                      {translations.status[language]}
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayTransactions.map((transaction) => {
                  const statusColors = getStatusColor(transaction.status);
                  return (
                    <tr
                      key={transaction.id}
                      className="hover:bg-[color:var(--md-sys-color-surface-container-high)] transition-colors"
                    >
                      <td className="p-4 border-b border-[color:var(--md-sys-color-outline)]/60">
                        <Typography variant="body-md">
                          {transaction.description}
                        </Typography>
                      </td>
                      
                      <td className="p-4 border-b border-[color:var(--md-sys-color-outline)]/60">
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
                          <Typography component="span" variant="body-sm" tone="muted" className="mr-1">
                            {translations.currency[language]}
                          </Typography>
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-[color:var(--md-sys-color-outline)]/60">
                        <Typography variant="body-md">
                          {formatDate(transaction.date)}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-[color:var(--md-sys-color-outline)]/60">
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
          {totalPages > 1 && transactionCount > 0 && (
            <TransactionsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={transactionCount}
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
