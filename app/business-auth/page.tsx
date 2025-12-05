"use client";

import React, { useEffect, useState } from "react";
import { AuthSidebar } from "../../components/business-auth/sideBar";
import { AccountType } from "../../components/business-auth/accountType";
import { PersonalInfo } from "../../components/business-auth/personalInfo";
import { BusinessInfo } from "../../components/business-auth/businessInfo";
import { LocationInfo } from "../../components/business-auth/locationInfo";
import { ServiceIntro } from "../../components/business-auth/serviceIntro";
import { InfoChecking } from "../../components/business-auth/infoChecking";
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

export default function Page() {
  const [activeItemId, setActiveItemId] = useState<string>(DEFAULT_ITEM_ID);
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectBusinessProfile);
  const statuses = useAppSelector(selectBusinessProfileStatuses);
  const completedSections = useAppSelector(selectCompletedSections);
  const profileId = profile?.id;
  const [currentAccountType, setCurrentAccountType] = useState<AccountKind>("legal");
  const accountType = profile?.type;

  useEffect(() => {
    const storedId =
      typeof window !== "undefined" ? window.localStorage.getItem(PROFILE_STORAGE_KEY) : null;
    if (storedId && !profileId && statuses.bootstrap === "idle") {
      dispatch(bootstrapBusinessProfile({ profileId: storedId }));
    }
  }, [dispatch, profileId, statuses.bootstrap]);

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
    setCurrentAccountType(selectedType);
    try {
      await dispatch(createBusinessProfile({ accountType: selectedType, accountName })).unwrap();
      setActiveItemId("personal-info");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePersonalContinue = async (data: PersonalInfoPayload) => {
    try {
      await dispatch(savePersonalInfo(data)).unwrap();
      setActiveItemId("business-info");
    } catch (error) {
      console.error(error);
    }
  };

  const handleBusinessContinue = async (data: BusinessInfoPayload) => {
    try {
      await dispatch(saveBusinessInfo(data)).unwrap();
      setActiveItemId(currentAccountType === "real" ? "services-intro" : "location");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocationContinue = async (data: LocationPayload) => {
    try {
      await dispatch(saveLocationInfo(data)).unwrap();
      setActiveItemId("services-intro");
    } catch (error) {
      console.error(error);
    }
  };

  const handleServiceContinue = () => setActiveItemId("review-info");

  const handleSubmitProfile = async () => {
    try {
      await dispatch(submitBusinessProfile()).unwrap();
    } catch (error) {
      console.error(error);
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
          servicesRequestedCount={0}
          isSubmitting={statuses.submit === "loading"}
          onEditSection={(section) => {
            if (section === "personal") return setActiveItemId("personal-info");
            if (section === "business") return setActiveItemId("business-info");
            if (section === "location") {
              return setActiveItemId(currentAccountType === "real" ? "business-info" : "location");
            }
            if (section === "services") return setActiveItemId("services-intro");
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
  );
}
