
import { apiFetch } from './api-client';

export interface BusinessProfileResponse {
  id: string;
  name: string;
  type: 'business' | 'person';
  is_active: boolean;
  verification_status: string;
  balance: number;
  created_at: string;
  business_details?: {
    business_info: {
      brand_name: string;
      field_of_work: string;
      website_url: string;
    };
    business_national_id: string;
    location_info: {
      address: string;
      city: string;
      fixed_phone: string;
      plate_number: string;
      postal_code: string;
      province: string;
      unit: string;
    };
    rep_dob: string;
    rep_first_name: string;
    rep_last_name: string;
    rep_mobile_number: string;
    rep_national_id: string;
    signatories: Array<{
      dob: string;
      documents: {
        id_book_page_one: string;
        national_card_back: string;
        national_card_front: string;
      };
      first_name: string;
      last_name: string;
      mobile_number: string;
      national_id: string;
      signatory_id: number;
    }>;
  };
  person_details?: {
    business_info: {
      brand_name: string;
      field_of_work: string;
      website_url: string;
    };
    dob: string;
    documents: {
      id_book_page_one: string;
      national_card_back: string;
      national_card_front: string;
    };
    first_name: string;
    last_name: string;
    location_info: {
      address: string;
      city: string;
      fixed_phone: string;
      plate_number: string;
      postal_code: string;
      province: string;
      unit: string;
    };
    mobile_number: string;
    national_id: string;
  };
}

export async function getBusinessInfo(profileId: string): Promise<BusinessProfileResponse> {
  try {
    const response = await apiFetch<BusinessProfileResponse>(`/profiles/${profileId}`);
    return response;
  } catch (error: any) {
    console.error('Error in getBusinessInfo API:', error);
    throw error;
  }
}

export async function getBusinessInfoSummary(profileId: string) {
  try {
    const data = await getBusinessInfo(profileId);
    
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      isActive: data.is_active,
      verificationStatus: data.verification_status,
      balance: data.balance,
    };
  } catch (error) {
    throw error;
  }
}

export async function checkProfileVerificationStatus(profileId: string): Promise<{
  isVerified: boolean;
  status: string;
  canProceed: boolean;
}> {
  try {
    const data = await getBusinessInfo(profileId);
    
    return {
      isVerified: data.verification_status === 'verified',
      status: data.verification_status,
      canProceed: ['verified', 'pending'].includes(data.verification_status),
    };
  } catch (error) {
    throw error;
  }
}

export async function getProfileAddress(profileId: string) {
  try {
    const data = await getBusinessInfo(profileId);
    
    if (data.type === 'business' && data.business_details) {
      return data.business_details.location_info;
    } else if (data.type === 'person' && data.person_details) {
      return data.person_details.location_info;
    }
    
    throw new Error('اطلاعات آدرس یافت نشد');
  } catch (error) {
    throw error;
  }
}

export async function getProfileContactInfo(profileId: string) {
  try {
    const data = await getBusinessInfo(profileId);
    
    if (data.type === 'business' && data.business_details) {
      return {
        mobileNumber: data.business_details.rep_mobile_number,
        fixedPhone: data.business_details.location_info.fixed_phone,
       
      };
    } else if (data.type === 'person' && data.person_details) {
      return {
        mobileNumber: data.person_details.mobile_number,
        fixedPhone: data.person_details.location_info.fixed_phone,
      
      };
    }
    
    throw new Error('اطلاعات تماس یافت نشد');
  } catch (error) {
    throw error;
  }
}