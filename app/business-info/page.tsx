
"use client";

import { useEffect, useRef } from 'react';
import { Container } from '../../components/ui/Container';
import { Section } from '../..//components/ui/Section';
import { Typography } from '../..//components/ui/Typography';
import { Button } from '../..//components/ui/Button';
import { useBusinessInfo } from '../..//lib/useBusinessInfo';
import { NoProfileCard } from './components/NoProfileCard';
import { AccountInfoCard } from './components/AccountInfoCard';
import { PersonalInfoCard } from './components/PersonalInfoCard';
import { BusinessDetailsCard } from './components/BusinessDetailsCard';
import { AddressCard } from './components/AddressCard';
import { DashboardLayout } from '../..//components//DashboardLayout';
import { useSelectedProfile } from '../../lib/useSelectedProfile';

export default function BusinessInfoPage() {
  const { loadProfiles } = useSelectedProfile();
  const hasLoaded = useRef(false);
  
  useEffect(() => {
  
    if (!hasLoaded.current) {
      console.log('🔄 Loading profiles (only once)');
      loadProfiles();
      hasLoaded.current = true;
    }
  }, [loadProfiles]);

  return (
    <DashboardLayout>
      <BusinessInfoContent />
    </DashboardLayout>
  );
}

function BusinessInfoContent() {
  const { 
    processedData, 
    loading, 
    error, 
    refreshProfile, 
    hasProfile,
    isBusinessAccount 
  } = useBusinessInfo();


  if (loading) {
    return (
      <Section spacing="md">
        <Container size="xl">
          <div className="flex items-center justify-center h-96">
            <Typography variant="h4" className="text-[color:var(--text-primary)]">
              در حال بارگذاری اطلاعات کسب‌وکار...
            </Typography>
          </div>
        </Container>
      </Section>
    );
  }

 
  if (!hasProfile) {
    return <NoProfileCard />;
  }

  if (error || !processedData) {
    return (
      <Section spacing="md">
        <Container size="xl">
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Typography variant="h4" className="text-center text-rose-500">
              {error || 'خطا در بارگذاری اطلاعات'}
            </Typography>
            <Button variant="primary" onClick={refreshProfile}>
              تلاش مجدد
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const { accountInfo, personalInfo, businessInfo, locationInfo } = processedData;
  const accountTypeLabel = isBusinessAccount ? 'حقوقی' : 'حقیقی';

  return (
    <Section spacing="md">
      <Container size="xl">
        
        <div className="mb-8 mt-6">
          <Typography variant="h2" className="text-[color:var(--text-primary)] mb-2">
            اطلاعات کسب‌وکار
          </Typography>
          <Typography variant="body-md" className="text-[color:var(--text-secondary)]">
            مشاهده و مدیریت اطلاعات پروفایل انتخاب شده
          </Typography>
        </div>
        
       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
          <div className="space-y-6">
            <AccountInfoCard
              accountName={accountInfo.name}
              accountType={accountTypeLabel}
              isActive={accountInfo.isActive}
              verificationStatus={accountInfo.verificationStatus}
            />
            
            <PersonalInfoCard
              firstName={personalInfo.firstName}
              lastName={personalInfo.lastName}
              nationalId={personalInfo.nationalId}
              dob={personalInfo.dob}
              mobileNumber={personalInfo.mobileNumber}
              isBusinessAccount={isBusinessAccount}
            />
          </div>
          
        
          <div className="space-y-6">
           
            <BusinessDetailsCard
              brandName={businessInfo.brandName}
              fieldOfWork={businessInfo.fieldOfWork}
              websiteUrl={businessInfo.websiteUrl}
              businessNationalId={businessInfo.businessNationalId}
            />
            
            <AddressCard
              address={locationInfo.address}
              city={locationInfo.city}
              province={locationInfo.province}
              postalCode={locationInfo.postalCode}
              fixedPhone={locationInfo.fixedPhone}
              unit={locationInfo.unit}
              plate_number={locationInfo.plateNumber}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}