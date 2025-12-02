"use client";
import { useMemo, useState } from "react";
import { AuthSidebar } from "../../components/auth/sideBar";
import { AccountType } from "../../components/auth/accountType";
import { PersonalInfo } from "../../components/auth/personalInfo";
import { BusinessInfo } from "../../components/auth/businessInfo";
import { LocationInfo } from "../../components/auth/locationInfo";
import { ServiceIntro } from "../../components/auth/serviceIntro";
import { FaceDetection } from "../../components/auth/faceDetection";
import { LivenessDetection } from "../../components/auth/livenessDetection";
import { OcrDetection } from "../../components/auth/OCR";

const DEFAULT_ITEM_ID = "account-type";

export default function Page() {
  const [activeItemId, setActiveItemId] = useState<string>(DEFAULT_ITEM_ID);

  const content = useMemo(() => {
    switch (activeItemId) {
      case "account-type":
        return (
          <AccountType
            onContinue={() => setActiveItemId("personal-info")}
            onBack={() => setActiveItemId("account-type")}
          />
        );
      case "personal-info":
        return (
          <PersonalInfo
            onBack={() => setActiveItemId("account-type")}
            onContinue={() => setActiveItemId("business-info")}
          />
        );
      case "business-info":
        return (
          <BusinessInfo
            onBack={() => setActiveItemId("personal-info")}
            onContinue={() => setActiveItemId("location")}
          />
        );
      case "location":
        return (
          <LocationInfo
            onBack={() => setActiveItemId("business-info")}
            onContinue={() => setActiveItemId("services-intro")}
          />
        );
      case "services-intro":
        return (
          <ServiceIntro
            onBack={() => setActiveItemId("location")}
            onContinue={(serviceId) => {
              if (serviceId === "face-recognition") return setActiveItemId("face");
              if (serviceId === "liveness-detection") return setActiveItemId("liveness");
              if (serviceId === "smart-ocr") return setActiveItemId("smart-doc");
              return setActiveItemId("face");
            }}
          />
        );
      case "face":
        return (
          <FaceDetection
            onBack={() => setActiveItemId("services-intro")}
            onContinue={() => setActiveItemId("liveness")}
            onSkip={() => setActiveItemId("liveness")}
          />
        );
      case "liveness":
        return (
          <LivenessDetection
            onBack={() => setActiveItemId("face")}
            onContinue={() => setActiveItemId("smart-doc")}
            onSkip={() => setActiveItemId("smart-doc")}
          />
        );
      case "smart-doc":
        return (
          <OcrDetection
            onBack={() => setActiveItemId("liveness")}
            onContinue={() => setActiveItemId("review-info")}
            onSkip={() => setActiveItemId("review-info")}
          />
        );
      default:
        return (
          <div
            dir="rtl"
            className="font-vazirmatn flex h-full min-h-[420px] items-center justify-center rounded-[28px] border border-dashed border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface-variant)]"
          >
            برای این بخش به زودی فرم مخصوص نمایش داده می‌شود.
          </div>
        );
    }
  }, [activeItemId]);

  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <div
        dir="rtl"
        className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-stretch gap-6 px-6 py-10 md:ml-auto md:mr-0 md:flex-row md:items-start md:justify-end"
      >
        <div className="md:sticky md:top-6 md:self-start">
          <AuthSidebar activeItemId={activeItemId} onItemSelect={setActiveItemId} />
        </div>

        <div className="flex-1">{content}</div>
      </div>
    </main>
  );
}
