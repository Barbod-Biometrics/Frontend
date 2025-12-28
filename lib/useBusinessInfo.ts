
import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchBusinessInfo, clearBusinessInfo } from '../store/businessInfoSlice';

interface ProcessedData {
  accountInfo: {
    name: string;
    type: 'business' | 'person';
    isActive: boolean;
    verificationStatus: string;
    balance: number;
    createdAt: string;
  };
  personalInfo: {
    firstName: string;
    lastName: string;
    nationalId: string;
    dob: string;
    mobileNumber: string;
  };
  businessInfo: {
    brandName: string;
    fieldOfWork: string;
    websiteUrl: string;
    businessNationalId?: string;
  };
  locationInfo: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    fixedPhone: string;
    unit: string;
    plateNumber: string;
  };
}

export const useBusinessInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  

  const { data, loading, error, lastFetchedProfileId } = useSelector(
    (state: RootState) => state.businessInfo
  );
  
  const currentProfileId = useSelector((state: RootState) => 
    state.selectedProfile.currentProfile?.id
  );
  
  const currentProfile = useSelector((state: RootState) => 
    state.selectedProfile.currentProfile
  );

  
  const fetchProfileData = useCallback(() => {
    if (currentProfileId && currentProfileId !== 'undefined') {
      dispatch(fetchBusinessInfo(currentProfileId));
    }
  }, [currentProfileId, dispatch]);


  const clearData = useCallback(() => {
    dispatch(clearBusinessInfo());
  }, [dispatch]);

  useEffect(() => {
    if (!currentProfileId || currentProfileId === 'undefined') {
      return;
    }
    
    const shouldFetch = 
      !data || 
      lastFetchedProfileId !== currentProfileId || 
      error !== null;
    
    if (shouldFetch) {
      console.log('🔄 Fetching business info for profile:', currentProfileId);
      fetchProfileData();
    }
  }, [currentProfileId, data, error, lastFetchedProfileId, fetchProfileData]);


  const processedData: ProcessedData | null = data ? {
    accountInfo: {
      name: data.name,
      type: data.type === 'business' ? 'business' : 'person',
      isActive: data.is_active,
      verificationStatus: data.verification_status,
      balance: data.balance,
      createdAt: data.created_at,
    },
    personalInfo: {
      firstName: data.type === 'business' 
        ? data.business_details?.rep_first_name || ''
        : data.person_details?.first_name || '',
      lastName: data.type === 'business'
        ? data.business_details?.rep_last_name || ''
        : data.person_details?.last_name || '',
      nationalId: data.type === 'business'
        ? data.business_details?.rep_national_id || ''
        : data.person_details?.national_id || '',
      dob: data.type === 'business'
        ? data.business_details?.rep_dob || ''
        : data.person_details?.dob || '',
      mobileNumber: data.type === 'business'
        ? data.business_details?.rep_mobile_number || ''
        : data.person_details?.mobile_number || '',
    },
    businessInfo: {
      brandName: data.type === 'business'
        ? data.business_details?.business_info?.brand_name || ''
        : data.person_details?.business_info?.brand_name || '',
      fieldOfWork: data.type === 'business'
        ? data.business_details?.business_info?.field_of_work || ''
        : data.person_details?.business_info?.field_of_work || '',
      websiteUrl: data.type === 'business'
        ? data.business_details?.business_info?.website_url || ''
        : data.person_details?.business_info?.website_url || '',
      ...(data.type === 'business' ? {
        businessNationalId: data.business_details?.business_national_id || ''
      } : {})
    },
    locationInfo: {
      address: data.type === 'business'
        ? data.business_details?.location_info?.address || ''
        : data.person_details?.location_info?.address || '',
      city: data.type === 'business'
        ? data.business_details?.location_info?.city || ''
        : data.person_details?.location_info?.city || '',
      province: data.type === 'business'
        ? data.business_details?.location_info?.province || ''
        : data.person_details?.location_info?.province || '',
      postalCode: data.type === 'business'
        ? data.business_details?.location_info?.postal_code || ''
        : data.person_details?.location_info?.postal_code || '',
      fixedPhone: data.type === 'business'
        ? data.business_details?.location_info?.fixed_phone || ''
        : data.person_details?.location_info?.fixed_phone || '',
      unit: data.type === 'business'
        ? data.business_details?.location_info?.unit || ''
        : data.person_details?.location_info?.unit || '',
      plateNumber: data.type === 'business'
        ? data.business_details?.location_info?.plate_number || ''
        : data.person_details?.location_info?.plate_number || '',
    },
  } : null;

  const hasProfile = !!currentProfileId && currentProfileId !== 'undefined';

  return {
  
    data,
    processedData,
    loading,
    error,
    currentProfileId,
    currentProfile,
   
    refreshProfile: fetchProfileData,
    clearData,
    hasProfile,
    isBusinessAccount: data?.type === 'business',
    lastFetchedProfileId,
  };
};