"use client";

import React, { useEffect, useState } from "react";
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
  selectBusinessProfile,
  selectBusinessProfileStatuses,
  selectCompletedSections,
  submitBusinessProfile,
} from "../../store/businessProfileSlice";
import {
  AccountKind,
  BusinessInfoPayload,
  LocationPayload,
  PersonalInfoPayload,
} from "../../types/businessProfile";

const DEFAULT_ITEM_ID = "account-type";
const PROFILE_STORAGE_KEY = "business-profile-id";
const CONNECTION_ERROR_TEXT = "در برقراری ارتباط با سرور مشکلی پیش آمد. لطفاً بعداً دوباره تلاش کنید.";

export default function Page() {
  const [activeItemId, setActiveItemId] = useState<string>(DEFAULT_ITEM_ID);
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectBusinessProfile);
  const statuses = useAppSelector(selectBusinessProfileStatuses);
  const completedSections = useAppSelector(selectCompletedSections);
  const profileId = profile?.id;
  const [currentAccountType, setCurrentAccountType] = useState<AccountKind>("legal");
  const accountType = profile?.type;
  const searchParams = useSearchParams();
  const urlProfileId = searchParams?.get("profileId") ?? searchParams?.get("id");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedId =
      typeof window !== "undefined" ? window.localStorage.getItem(PROFILE_STORAGE_KEY) : null;
    const bootstrapId = urlProfileId ?? storedId;
    if (bootstrapId && !profileId && statuses.bootstrap === "idle") {
      dispatch(bootstrapBusinessProfile({ profileId: bootstrapId }));
    }
  }, [dispatch, profileId, statuses.bootstrap, urlProfileId]);

  useEffect(() => {
    if (profileId && typeof window !== "undefined") {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, profileId);
    }
  }, [profileId]);

  useEffect(() => {
    if (accountType) {
      setCurrentAccountType(accountType);
    }
  }, [accountType]);

  useEffect(() => {
    if (currentAccountType === "real" && activeItemId === "location") {
      setActiveItemId("services-intro");
    }
  }, [currentAccountType, activeItemId]);

  const handleAccountContinue = async (selectedType: AccountKind, accountName: string) => {
    const trimmedName = accountName.trim();
    if (!trimmedName) return;
    const hasExistingDraft =
      Boolean(profile?.id) && Boolean(profile?.type) && Boolean(profile?.name?.trim());
    setCurrentAccountType(selectedType);
    setErrorMessage(null);

    if (hasExistingDraft) {
      setActiveItemId("personal-info");
      return;
    }

    try {
      const createdProfile = await dispatch(
        createBusinessProfile({ accountType: selectedType, accountName: trimmedName }),
      ).unwrap();
      if (createdProfile?.id && typeof window !== "undefined") {
        window.localStorage.setItem(PROFILE_STORAGE_KEY, createdProfile.id);
      }
      setActiveItemId("personal-info");
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_TEXT);
    }
  };

  const handlePersonalContinue = async (data: PersonalInfoPayload) => {
    try {
      await dispatch(savePersonalInfo(data)).unwrap();
      setActiveItemId("business-info");
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_TEXT);
    }
  };

  const handleBusinessContinue = async (data: BusinessInfoPayload) => {
    try {
      await dispatch(saveBusinessInfo(data)).unwrap();
      setActiveItemId(currentAccountType === "real" ? "services-intro" : "location");
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_TEXT);
    }
  };

  const handleLocationContinue = async (data: LocationPayload) => {
    try {
      await dispatch(saveLocationInfo(data)).unwrap();
      setActiveItemId("services-intro");
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_TEXT);
    }
  };

  const handleServiceContinue = () => setActiveItemId("review-info");

  const handleSubmitProfile = async () => {
    try {
      await dispatch(submitBusinessProfile()).unwrap();
    } catch (error) {
      console.error(error);
      setErrorMessage(CONNECTION_ERROR_TEXT);
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
          onBack={() => setActiveItemId("account-type")}
        />
      );
      break;
    case "personal-info":
      content = (
        <PersonalInfo
          initialData={profile?.personalInfo}
          isLoading={statuses.personalInfo === "loading"}
          onBack={() => setActiveItemId("account-type")}
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
          onBack={() => setActiveItemId("personal-info")}
          onContinue={handleBusinessContinue}
        />
      );
      break;
    case "location":
      content = (
        <LocationInfo
          initialData={profile?.locationInfo}
          isLoading={statuses.location === "loading"}
          onBack={() => setActiveItemId("business-info")}
          onContinue={handleLocationContinue}
        />
      );
      break;
    case "services-intro":
      content = (
        <ServiceIntro
          isLoading={false}
          onBack={() =>
            setActiveItemId(currentAccountType === "real" ? "business-info" : "location")
          }
          onContinue={handleServiceContinue}
        />
      );
      break;
    case "review-info":
      content = (
        <InfoChecking
          accountType={currentAccountType}
          onBack={() => setActiveItemId("services-intro")}
          onSubmit={handleSubmitProfile}
          completedSections={completedSections}
          isSubmitting={statuses.submit === "loading"}
          onEditSection={(section) => {
            if (section === "personal") return setActiveItemId("personal-info");
            if (section === "business") return setActiveItemId("business-info");
            if (section === "location") {
              return setActiveItemId(currentAccountType === "real" ? "business-info" : "location");
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
          O"OñOUO OUOU+ O"OrO' O"UØ OýU^O_UO U?OñU. U.OrOæU^Oæ U+U.OUOO' O_OO_UØ U.UOƒ?OO'U^O_.
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
              onItemSelect={setActiveItemId}
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
