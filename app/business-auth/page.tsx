"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthSidebar } from "../../components/business-auth/sideBar";
import { AccountType } from "../../components/business-auth/accountType";
import { PersonalInfo } from "../../components/business-auth/personalInfo";
import { BusinessInfo } from "../../components/business-auth/businessInfo";
import { LocationInfo } from "../../components/business-auth/locationInfo";
import { ServiceIntro } from "../../components/business-auth/serviceIntro";
import { InfoChecking } from "../../components/business-auth/infoChecking";
import { Button } from "../../components/ui/Button";
import { Typography } from "../../components/ui/Typography";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  bootstrapBusinessProfile,
  createBusinessProfile,
  saveBusinessInfo,
  saveLocationInfo,
  savePersonalInfo,
  selectCurrentStep,
  selectBusinessProfile,
  selectBusinessProfileStatuses,
  selectCompletedSections,
  setCurrentStep,
  submitBusinessProfile,
  type ProfileStep,
} from "../../store/businessProfileSlice";
import { getPhoneNumber } from "../../lib/auth-storage";
import {
  AccountKind,
  BusinessInfoPayload,
  LocationPayload,
  PersonalInfoPayload,
} from "../../types/businessProfile";

type StepId = ProfileStep;
const DEFAULT_ITEM_ID: StepId = "account-type";
const PROFILE_STORAGE_PREFIX = "business-profile-id";
const getProfileStorageKey = (phone?: string | null) =>
  phone ? `${PROFILE_STORAGE_PREFIX}-${phone}` : PROFILE_STORAGE_PREFIX;
const STEP_STORAGE_PREFIX = "business-profile-step";
const CONNECTION_ERROR_TEXT = "در برقراری ارتباط با سرور مشکلی پیش آمد. لطفاً بعداً دوباره تلاش کنید.";
const VALID_STEPS: StepId[] = [
  "account-type",
  "personal-info",
  "business-info",
  "location",
  "services-intro",
  "review-info",
];

const isValidStep = (value: string | null): value is StepId =>
  Boolean(value && VALID_STEPS.includes(value as StepId));

const getStepStorageKey = (profileId: string) => `${STEP_STORAGE_PREFIX}-${profileId}`;

function LoadingFallback() {
  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">
        <Typography
          variant="body-lg"
          className="text-[color:var(--md-sys-color-on-surface-variant)]"
        >
          Loading...
        </Typography>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BusinessAuthPage />
    </Suspense>
  );
}

function BusinessAuthPage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectBusinessProfile);
  const statuses = useAppSelector(selectBusinessProfileStatuses);
  const completedSections = useAppSelector(selectCompletedSections);
  const activeItemId = useAppSelector(selectCurrentStep);
  const profileId = profile?.id;
  const [currentAccountType, setCurrentAccountType] = useState<AccountKind>("legal");
  const accountType = profile?.type;
  const searchParams = useSearchParams();
  const urlProfileId = searchParams?.get("profileId") ?? searchParams?.get("id");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const phoneNumber = typeof window !== "undefined" ? getPhoneNumber() : null;
  const hasHydratedStep = useRef(false);
  const lastProfileId = useRef<string | null>(null);

  const persistStep = (step: StepId, id?: string) => {
    if (!id || typeof window === "undefined") return;
    window.localStorage.setItem(getStepStorageKey(id), step);
  };

  const setActiveStep = (step: StepId) => {
    dispatch(setCurrentStep(step));
    persistStep(step, profileId);
  };

  useEffect(() => {
    const profileStorageKey = getProfileStorageKey(phoneNumber);
    const storedId =
      typeof window !== "undefined" ? window.localStorage.getItem(profileStorageKey) : null;
    const bootstrapId = urlProfileId ?? storedId;
    if (bootstrapId && !profileId && statuses.bootstrap === "idle") {
      dispatch(bootstrapBusinessProfile({ profileId: bootstrapId }));
    }
  }, [dispatch, phoneNumber, profileId, statuses.bootstrap, urlProfileId]);

  useEffect(() => {
    if (!profileId) {
      hasHydratedStep.current = false;
      lastProfileId.current = null;
      return;
    }

    if (lastProfileId.current !== profileId) {
      lastProfileId.current = profileId;
      const storedStep =
        typeof window !== "undefined"
          ? window.localStorage.getItem(getStepStorageKey(profileId))
          : null;
      if (isValidStep(storedStep)) {
        dispatch(setCurrentStep(storedStep));
      } else {
        dispatch(setCurrentStep(DEFAULT_ITEM_ID));
      }
      hasHydratedStep.current = true;
    }
  }, [dispatch, profileId]);

  useEffect(() => {
    if (profileId && typeof window !== "undefined") {
      window.localStorage.setItem(getProfileStorageKey(phoneNumber), profileId);
    }
  }, [phoneNumber, profileId]);

  useEffect(() => {
    if (profileId && isValidStep(activeItemId)) {
      persistStep(activeItemId, profileId);
    }
  }, [activeItemId, profileId]);

  useEffect(() => {
    if (accountType) {
      setCurrentAccountType(accountType);
    }
  }, [accountType]);

  const handleAccountContinue = async (selectedType: AccountKind, accountName: string) => {
    const trimmedName = accountName.trim();
    if (!trimmedName) return;
    const hasExistingDraft =
      Boolean(profile?.id) && Boolean(profile?.type) && Boolean(profile?.name?.trim());
    setCurrentAccountType(selectedType);
    setErrorMessage(null);

    if (hasExistingDraft) {
      setActiveStep("personal-info");
      return;
    }

    try {
      const createdProfile = await dispatch(
        createBusinessProfile({ accountType: selectedType, accountName: trimmedName }),
      ).unwrap();
      if (createdProfile?.id && typeof window !== "undefined") {
        window.localStorage.setItem(getProfileStorageKey(phoneNumber), createdProfile.id);
      }
      setActiveStep("personal-info");
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_TEXT);
    }
  };

  const handlePersonalContinue = async (data: PersonalInfoPayload) => {
    try {
      await dispatch(savePersonalInfo(data)).unwrap();
      setActiveStep("business-info");
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_TEXT);
    }
  };

  const handleBusinessContinue = async (data: BusinessInfoPayload) => {
    try {
      await dispatch(saveBusinessInfo(data)).unwrap();
      setActiveStep("location");
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_TEXT);
    }
  };

  const handleLocationContinue = async (data: LocationPayload) => {
    try {
      await dispatch(saveLocationInfo(data)).unwrap();
      setActiveStep("services-intro");
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_TEXT);
    }
  };

  const handleServiceContinue = () => setActiveStep("review-info");

  const handleSubmitProfile = async () => {
    try {
      await dispatch(submitBusinessProfile()).unwrap();
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_TEXT);
    }
  };

  const handleSidebarSelect = (step: string) => {
    if (isValidStep(step)) {
      setActiveStep(step);
    }
  };

  let content: React.ReactNode = null;

  switch (activeItemId) {
    case "account-type":
      content = (
        <AccountType
          initialType={profile?.type}
          initialName={profile?.name}
          isLoading={statuses.accountType === "loading"}
          onContinue={handleAccountContinue}
          onTypeChange={setCurrentAccountType}
          onBack={() => setActiveStep("account-type")}
        />
      );
      break;
    case "personal-info":
      content = (
        <PersonalInfo
          initialData={profile?.personalInfo}
          isLoading={statuses.personalInfo === "loading"}
          onBack={() => setActiveStep("account-type")}
          onContinue={handlePersonalContinue}
        />
      );
      break;
    case "business-info":
      content = (
        <BusinessInfo
          accountType={currentAccountType}
          initialData={profile?.businessInfo}
          isLoading={statuses.businessInfo === "loading"}
          onBack={() => setActiveStep("personal-info")}
          onContinue={handleBusinessContinue}
        />
      );
      break;
    case "location":
      content = (
        <LocationInfo
          accountType={currentAccountType}
          initialData={profile?.locationInfo}
          isLoading={statuses.location === "loading"}
          onBack={() => setActiveStep("business-info")}
          onContinue={handleLocationContinue}
        />
      );
      break;
    case "services-intro":
      content = (
        <ServiceIntro
          isLoading={false}
          onBack={() => setActiveStep("location")}
          onContinue={handleServiceContinue}
        />
      );
      break;
    case "review-info":
      content = (
        <InfoChecking
          accountType={currentAccountType}
          onBack={() => setActiveStep("services-intro")}
          onSubmit={handleSubmitProfile}
          completedSections={completedSections}
          isSubmitting={statuses.submit === "loading"}
          onEditSection={(section) => {
            if (section === "personal") return setActiveStep("personal-info");
            if (section === "business") return setActiveStep("business-info");
            if (section === "location") {
              return setActiveStep(currentAccountType === "real" ? "business-info" : "location");
            }
          }}
        />
      );
      break;
    default:
      content = (
        <div
          dir="rtl"
          className="font-vazirmatn flex h-full min-h-[420px] items-center justify-center rounded-[28px] border border-dashed border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface-variant)]"
        >
          مرحله نامعتبر است.
        </div>
      );
  }

  return (
    <>
      <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
        <div
          dir="rtl"
          className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-stretch gap-6 px-6 py-10 md:ml-auto md:mr-0 md:flex-row md:items-start md:justify-end"
        >
          <div className="md:sticky md:top-6 md:self-start">
            <AuthSidebar
              activeItemId={activeItemId}
              onItemSelect={handleSidebarSelect}
              accountType={currentAccountType}
            />
          </div>

          <div className="flex-1">{content}</div>
        </div>
      </main>

      {errorMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          onClick={() => setErrorMessage(null)}
        >
          <div
            className="w-full max-w-md rounded-[24px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] p-6 shadow-[var(--elevation-3)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <Typography
                  variant="body-lg"
                  className="font-semibold text-[color:var(--md-sys-color-on-surface)]"
                >
                  بروز خطا در ایجاد پروفایل
                </Typography>
                <Typography
                  variant="body-sm"
                  className="text-[color:var(--md-sys-color-on-surface-variant)] leading-6"
                >
                  {errorMessage}
                </Typography>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="rounded-full p-2 text-[color:var(--md-sys-color-on-surface-variant)] transition hover:bg-[color:var(--md-sys-color-primary)]/10 hover:text-[color:var(--md-sys-color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)]/50"
                aria-label="بستن"
              >
                ×
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="min-w-[120px]"
              >
                باشه
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
