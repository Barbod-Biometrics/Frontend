"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { AuthSidebar } from "../../components/business-auth/sideBar";
import { AccountType } from "../../components/business-auth/accountType";
import { PersonalInfo } from "../../components/business-auth/personalInfo";
import { BusinessInfo } from "../../components/business-auth/businessInfo";
import { LocationInfo } from "../../components/business-auth/locationInfo";
import { ServiceIntro } from "../../components/business-auth/serviceIntro";
import { InfoChecking } from "../../components/business-auth/infoChecking";
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
const CONNECTION_ERROR_TEXT = "در ارتباط با سرور خطایی رخ داد";
const SUCCESS_TOAST_TEXT = "حساب با موفقیت ایجاد شد";
const TOAST_HIDE_DELAY_MS = 2600;
const NAVIGATE_DELAY_MS = 900;
const VALID_STEPS: StepId[] = [
  "account-type",
  "personal-info",
  "business-info",
  "location",
  "services-intro",
  "review-info",
];

const ADMIN_PANEL_RETURN_KEY = "admin-panel-return-view";
const ADMIN_PANEL_BUSINESS_VIEW = "business";

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
      <BusinessAuthPageWithParams />
    </Suspense>
  );
}

function BusinessAuthPageWithParams() {
  const searchParams = useSearchParams();
  const profileIdParam = searchParams.get("id");
  const initialProfileId = profileIdParam?.trim() ? profileIdParam : undefined;
  const forceNewProfile = searchParams.get("new") === "1";
  const isAdminCreationFlow = searchParams.get("admin") === "1";

  return (
    <BusinessAuthPage
      initialProfileId={initialProfileId}
      forceNewProfile={forceNewProfile}
      isAdminCreationFlow={isAdminCreationFlow}
    />
  );
}

type BusinessAuthPageProps = {
  initialProfileId?: string | null;
  forceNewProfile?: boolean;
  isAdminCreationFlow?: boolean;
};

function BusinessAuthPage({
  initialProfileId,
  forceNewProfile = false,
  isAdminCreationFlow = false,
}: BusinessAuthPageProps = {}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const profile = useAppSelector(selectBusinessProfile);
  const statuses = useAppSelector(selectBusinessProfileStatuses);
  const completedSections = useAppSelector(selectCompletedSections);
  const activeItemId = useAppSelector(selectCurrentStep);
  const profileId = profile?.id;
  const [currentAccountType, setCurrentAccountType] = useState<AccountKind>("legal");
  const accountType = profile?.type;
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const navigateTimeoutRef = useRef<number | null>(null);
  const phoneNumber = typeof window !== "undefined" ? getPhoneNumber() : null;
  const hasHydratedStep = useRef(false);
  const lastProfileId = useRef<string | null>(null);
  const { personal, business, location, services } = completedSections;
  const hasAccountInfo = Boolean(profile?.id && profile?.name?.trim() && profile?.type);
  const isAdminContext = useMemo(() => {
    if (isAdminCreationFlow) return true;
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(ADMIN_PANEL_RETURN_KEY) === ADMIN_PANEL_BUSINESS_VIEW;
    } catch {
      return false;
    }
  }, [isAdminCreationFlow]);

  const allowedStepIds = useMemo<StepId[]>(() => {
    const allowed: StepId[] = ["account-type"];
    if (!hasAccountInfo) return allowed;
    allowed.push("personal-info");
    if (!personal) return allowed;
    allowed.push("business-info");
    if (!business) return allowed;
    allowed.push("location");
    if (!location) return allowed;
    allowed.push("services-intro");
    if (!services) return allowed;
    allowed.push("review-info");
    return allowed;
  }, [hasAccountInfo, personal, business, location, services]);

  const allowedStepSet = useMemo(() => new Set<StepId>(allowedStepIds), [allowedStepIds]);

  const disabledStepIds = useMemo(
    () => VALID_STEPS.filter((step) => !allowedStepSet.has(step)),
    [allowedStepSet],
  );

  const latestAllowedStep = useMemo(() => {
    for (let i = VALID_STEPS.length - 1; i >= 0; i -= 1) {
      const step = VALID_STEPS[i];
      if (allowedStepSet.has(step)) return step;
    }
    return DEFAULT_ITEM_ID;
  }, [allowedStepSet]);

  const clearToastTimeout = () => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
  };

  const clearNavigateTimeout = () => {
    if (navigateTimeoutRef.current) {
      window.clearTimeout(navigateTimeoutRef.current);
      navigateTimeoutRef.current = null;
    }
  };

  const showToast = (message: string, tone: "success" | "error") => {
    setToast({ message, tone });
    clearToastTimeout();
    if (typeof window !== "undefined") {
      toastTimeoutRef.current = window.setTimeout(() => setToast(null), TOAST_HIDE_DELAY_MS);
    }
  };

  const resolveErrorMessage = (error: unknown) => {
    if (typeof error === "string" && error.trim()) return error;
    if (error instanceof Error && error.message) return error.message;
    return CONNECTION_ERROR_TEXT;
  };

  const handleExit = () => {
    if (isAdminContext) {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  const persistStep = (step: StepId, id?: string) => {
    if (!id || typeof window === "undefined") return;
    window.localStorage.setItem(getStepStorageKey(id), step);
  };

  const setActiveStep = (step: StepId) => {
    dispatch(setCurrentStep(step));
    persistStep(step, profileId);
  };

  useEffect(() => {
    if (!isAdminCreationFlow) return;
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(ADMIN_PANEL_RETURN_KEY, ADMIN_PANEL_BUSINESS_VIEW);
      }
    } catch {
      // ignore storage errors
    }
  }, [isAdminCreationFlow]);

  useEffect(() => {
    return () => {
      clearToastTimeout();
      clearNavigateTimeout();
    };
  }, []);

  useEffect(() => {
    const profileStorageKey = getProfileStorageKey(phoneNumber);
    if (forceNewProfile && typeof window !== "undefined") {
      window.localStorage.removeItem(profileStorageKey);
    }
    const storedId =
      !forceNewProfile && typeof window !== "undefined"
        ? window.localStorage.getItem(profileStorageKey)
        : null;
    const bootstrapId = forceNewProfile ? initialProfileId ?? null : initialProfileId ?? storedId;
    if (bootstrapId && !profileId && statuses.bootstrap === "idle") {
      dispatch(bootstrapBusinessProfile({ profileId: bootstrapId }));
    }
  }, [dispatch, phoneNumber, profileId, statuses.bootstrap, initialProfileId, forceNewProfile]);

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
    if (!isValidStep(activeItemId)) return;
    if (!allowedStepSet.has(activeItemId)) {
      setActiveStep(latestAllowedStep);
    }
  }, [activeItemId, allowedStepSet, latestAllowedStep]);

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
    setToast(null);

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
      showToast(resolveErrorMessage(error), "error");
    }
  };

  const handlePersonalContinue = async (data: PersonalInfoPayload) => {
    try {
      await dispatch(savePersonalInfo(data)).unwrap();
      setActiveStep("business-info");
    } catch (error) {
      console.error(error);
      showToast(resolveErrorMessage(error), "error");
    }
  };

  const handleBusinessContinue = async (data: BusinessInfoPayload) => {
    try {
      await dispatch(saveBusinessInfo(data)).unwrap();
      setActiveStep("location");
    } catch (error) {
      console.error(error);
      showToast(resolveErrorMessage(error), "error");
    }
  };

  const handleLocationContinue = async (data: LocationPayload) => {
    try {
      await dispatch(saveLocationInfo(data)).unwrap();
      setActiveStep("services-intro");
    } catch (error) {
      console.error(error);
      showToast(resolveErrorMessage(error), "error");
    }
  };

  const handleServiceContinue = () => setActiveStep("review-info");

  const handleSubmitProfile = async (isAdminFlow?: boolean) => {
    try {
      await dispatch(submitBusinessProfile()).unwrap();
      if (isAdminFlow) {
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(ADMIN_PANEL_RETURN_KEY, ADMIN_PANEL_BUSINESS_VIEW);
          }
        } catch {
          // ignore storage errors
        }
        showToast(SUCCESS_TOAST_TEXT, "success");
        clearNavigateTimeout();
        if (typeof window !== "undefined") {
          navigateTimeoutRef.current = window.setTimeout(() => {
            router.push("/admin");
          }, NAVIGATE_DELAY_MS);
        } else {
          router.push("/admin");
        }
        return;
      }
      showToast(SUCCESS_TOAST_TEXT, "success");
      clearNavigateTimeout();
      if (typeof window !== "undefined") {
        navigateTimeoutRef.current = window.setTimeout(() => {
          router.push("/user");
        }, NAVIGATE_DELAY_MS);
      } else {
        router.push("/user");
      }
    } catch (error) {
      console.error(error);
      showToast(resolveErrorMessage(error), "error");
    }
  };

  const handleSidebarSelect = (step: string) => {
    if (isValidStep(step) && allowedStepSet.has(step)) {
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
          accountType={currentAccountType}
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
        {toast && (
          <div
            className="pointer-events-none fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
            role={toast.tone === "error" ? "alert" : "status"}
            aria-live={toast.tone === "error" ? "assertive" : "polite"}
          >
            <div
              className={
                "rounded-xl border px-6 py-3 text-center text-sm font-semibold shadow-[var(--elevation-3)] backdrop-blur-sm " +
                (toast.tone === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700")
              }
            >
              {toast.message}
            </div>
          </div>
        )}
        <button
          type="button"
          aria-label="بستن"
          onClick={handleExit}
          className="absolute left-6 top-6 z-40 flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface-variant)] shadow-[var(--elevation-1)] transition hover:border-[color:var(--md-sys-color-primary)] hover:text-[color:var(--md-sys-color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)]/50"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div
          dir="rtl"
          className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-stretch gap-6 px-6 py-10 md:ml-auto md:mr-0 md:flex-row md:items-start md:justify-end"
        >
          <div className="md:sticky md:top-6 md:self-start">
            <AuthSidebar
              activeItemId={activeItemId}
              onItemSelect={handleSidebarSelect}
              accountType={currentAccountType}
              disabledItemIds={disabledStepIds}
            />
          </div>

          <div className="flex-1">{content}</div>
        </div>
      </main>

    </>
  );
}
