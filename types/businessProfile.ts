export type AccountKind = "legal" | "real";

export type AccountTypePayload = {
  name: string;
  type: AccountKind;
};

export type PersonalInfoPayload = {
  isBusinessOwner?: boolean;
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  phone: string;
};

export type BusinessInfoPayload = {
  brandName: string;
  fieldOfWork: string;
  websiteUrl: string;
  businessNationalId?: string;
};

export type LocationPayload = {
  address: string;
  province: string;
  city: string;
  fixedPhone: string;
  postalCode: string;
  plateNumber: string;
  unit: string;
};

export type BusinessProfile = {
  id: string;
  name: string;
  type: AccountKind;
  verificationStatus?: string;
  isActive?: boolean;
  createdAt?: string;
  balance?: number;
  personalInfo?: PersonalInfoPayload;
  businessInfo?: BusinessInfoPayload;
  locationInfo?: LocationPayload;
};

export type ServiceSelectionPayload = {
  selectedServiceId: string;
};

export type FaceDetectionPayload = {
  requestActivation: boolean;
  allowedIps: string[];
  rawIps: string;
};

export type LivenessDetectionPayload = FaceDetectionPayload;
export type OcrPayload = FaceDetectionPayload;
