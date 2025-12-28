"use client";

import  { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {  fetchWalletSummary,  fetchWalletTransactions, resetWalletForProfileChange } from '../../store/walletSlice';
import { loadUserProfiles } from '../../store/selectedProfileSlice';
import { Container } from '../../components/ui/Container';
import { Section } from '../../components/ui/Section';
import { Typography } from '../../components/ui/Typography';
import { Wallet, AlertCircle } from 'lucide-react';
import BalanceCard from './components/BalanceCard';
import StatsCards from './components/StatsCards';
import TransactionsTable from './components/TransactionsTable';
import DepositModal from './components/DepositModal';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Notification } from '../../components/Notification'; 

export default function WalletPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { language } = useSelector((state: RootState) => state.language);
  const { apiLoading, currentProfileId } = useSelector((state: RootState) => state.wallet);
  const { currentProfile, allProfiles, loading: profilesLoading, error: profilesError } = useSelector((state: RootState) => state.selectedProfile);
  
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [showNoProfileAlert, setShowNoProfileAlert] = useState(false);
  
  const lastFetchedProfileId = useRef<string | null>(null);
  const isInitialLoad = useRef(true);

  const loadWalletData = useCallback(async (profileId: string, isProfileChange: boolean = false) => {
    try {
      console.log(`Loading wallet data for profile: ${profileId}, isProfileChange: ${isProfileChange}`);
      
      if (isProfileChange) {
        dispatch(resetWalletForProfileChange(profileId));
        lastFetchedProfileId.current = profileId;
      }
      
      if (lastFetchedProfileId.current === profileId && !isProfileChange) {
        console.log('Skipping duplicate fetch for same profile');
        return;
      }
      
  
      await Promise.all([
        dispatch(fetchWalletSummary({ profileId })),
        dispatch(fetchWalletTransactions({ 
          page: 1, 
          pageSize: 10,
          profileId,
          reset: true 
        }))
      ]);
      
      lastFetchedProfileId.current = profileId;
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      showNotification(
        language === 'fa' ? 'خطا در بارگذاری داده‌ها' : 'Failed to load data',
        'error'
      );
    }
  }, [dispatch]);

  
  useEffect(() => {
    if (!isInitialLoad.current) return;
    
    const initializeData = async () => {
      try {
        
        const profilesResult = await dispatch(loadUserProfiles()).unwrap();
        
        if (!profilesResult || profilesResult.length === 0) {
          setShowNoProfileAlert(true);
          return;
        }
        
        setShowNoProfileAlert(false);
    
        if (currentProfile?.id) {
          await loadWalletData(currentProfile.id, true);
        } 
       
        else if (profilesResult.length > 0) {
          const firstProfileId = profilesResult[0].id;
          await loadWalletData(firstProfileId, true);
        }
        
        isInitialLoad.current = false;
      } catch (error) {
        console.error('Initialization failed:', error);
        setShowNoProfileAlert(true);
      }
    };
    
    initializeData();
  }, [dispatch, loadWalletData]);

  useEffect(() => {
   
    if (isInitialLoad.current || !currentProfile?.id) return;
    
    if (currentProfile.id !== lastFetchedProfileId.current) {
      console.log('Profile changed in Redux:', currentProfile.id);
      loadWalletData(currentProfile.id, true);
    }
  }, [currentProfile?.id, loadWalletData]);

  useEffect(() => {
    const handleProfileChangedEvent = async (e: Event) => {
      const customEvent = e as unknown as CustomEvent<{ profileId: string }>;
      const { profileId } = customEvent.detail;
      
      console.log('Profile change event received:', profileId);
      
  
      if (profileId !== lastFetchedProfileId.current) {
        await loadWalletData(profileId, true);
      }
    };

    window.addEventListener('profile-changed', handleProfileChangedEvent);
    
    return () => {
      window.removeEventListener('profile-changed', handleProfileChangedEvent);
    };
  }, [loadWalletData]);

  
  useEffect(() => {
    if (currentProfileId && currentProfile?.id && currentProfileId !== currentProfile.id) {
      console.warn('Profile mismatch detected! Fixing...');
      loadWalletData(currentProfile.id, true);
    }
  }, [currentProfileId, currentProfile?.id, loadWalletData]);

  const handleDepositClick = () => {
    if (!currentProfile && allProfiles.length === 0) {
      setShowNoProfileAlert(true);
      return;
    }
    
    setIsDepositModalOpen(true);
  };

  const translations = {
    pageTitle: {
      en: 'Wallet',
      fa: 'کیف پول'
    },
    pageDescription: {
      en: 'Manage your balance and track transactions',
      fa: 'موجودی خود را مدیریت و تراکنش‌ها را پیگیری کنید'
    },
    noProfileTitle: {
      en: 'No Business Profile Found',
      fa: 'هیچ کسب‌وکاری یافت نشد'
    },
    noProfileDescription: {
      en: 'You need to create a business profile first to use wallet features.',
      fa: 'برای استفاده از امکانات کیف پول، ابتدا باید یک کسب‌وکار ایجاد کنید.'
    },
    loadingProfiles: {
      en: 'Loading profiles...',
      fa: 'در حال بارگذاری پروفایل‌ها...'
    }
  };

    const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
      setNotification({
        show: true,
        message,
        type
      });
      
      
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    };

   
    const closeNotification = () => {
      setNotification(prev => ({ ...prev, show: false }));
    };

     
      const pageContent = () => {
        if (profilesLoading) {
          return (
            <Container size="xl">
              <Section spacing="md">
                <div className="flex justify-center items-center h-64">
                  <Typography variant="body-lg">
                    {translations.loadingProfiles[language]}
                  </Typography>
                </div>
              </Section>
            </Container>
          );
        }

    if (showNoProfileAlert && allProfiles.length === 0) {
      return (
        <Container size="xl">
          <Section spacing="md">
            <div className="mb-8 mt-14">
              <div className="flex items-center gap-4 mb-5">
                <Wallet className="w-8 h-8" />
                <Typography variant="h2" component="h1" className="font-bold">
                  {translations.pageTitle[language]}
                </Typography>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <Typography variant="h6" className="text-yellow-800 dark:text-yellow-300 mb-2">
                    {translations.noProfileTitle[language]}
                  </Typography>
                  <Typography variant="body-md" className="text-yellow-700 dark:text-yellow-400 mb-4">
                    {translations.noProfileDescription[language]}
                  </Typography>
                </div>
              </div>
            </div>
          </Section>
        </Container>
      );
    }

    return (
        <>
        {notification.show && (
          <Notification
            message={notification.message}
            type={notification.type}
            duration={5000}
            onClose={closeNotification}
          />
        )}
      <Container size="xl">
        <Section spacing="md">
          {/* Page Header */}
          <div className="mb-8 mt-14">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <div className="absolute inset-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl blur-md opacity-30"></div>
                
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
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
            <Typography variant="body-lg" tone="muted">
              {translations.pageDescription[language]}
            </Typography>
          </div>

          {profilesError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <Typography variant="body-md" className="text-red-600 dark:text-red-400">
                {profilesError}
              </Typography>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="lg:col-span-2">
              <BalanceCard 
                onDepositClick={handleDepositClick} 
                disabled={!currentProfile && allProfiles.length === 0}
              />
            </div>
            
            <div className="space-y-4">
              <StatsCards />
            </div>
          </div>

          <TransactionsTable loading={apiLoading.transactions || apiLoading.summary} />

          {currentProfile && (
            <DepositModal
              isOpen={isDepositModalOpen}
              onClose={() => setIsDepositModalOpen(false)}
              onDepositSuccess={(message, type) => {
      
      showNotification(message, type);
    }}
              profileId={currentProfile.id}
            />
          )}
        </Section>
      </Container>
      </>
    );
  };

  return <DashboardLayout>{pageContent()}</DashboardLayout>;
}
