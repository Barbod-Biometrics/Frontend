"use client";

import { useEffect, useRef } from "react";
import { KeyRound } from "lucide-react";
import { DashboardLayout } from "../../../components/DashboardLayout";
import { LivenessApiKeyPage } from "../../../components/api-key-gen/LivenessApiKeyPage";
import { ApiKeyRegenerationPanel } from "../../../components/api-key-gen/ApiKeyRegenerationPanel";
import { Typography } from "../../../components/ui/Typography";
import { useSelectedProfile } from "../../../lib/useSelectedProfile";

const LIVENESS_SERVICE_TITLE = "تشخیص زنده بودن";

function LoadingState() {
  return (
    <section dir="rtl" className="font-vazirmatn w-full px-4 pb-8 pt-6">
      <div className="mx-auto flex h-56 w-full max-w-3xl items-center justify-center rounded-[24px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-1)]">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-[color:var(--md-sys-color-primary)] border-t-transparent"
          role="status"
          aria-label="Loading"
        />
      </div>
    </section>
  );
}

function NoProfileState() {
  return (
    <section dir="rtl" className="font-vazirmatn w-full px-4 pb-8 pt-6">
      <div className="mx-auto w-full max-w-3xl rounded-[24px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-6 text-right shadow-[var(--elevation-1)]">
        <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)]">
          پروفایل کسب و کار پیدا نشد
        </Typography>
        <Typography
          variant="body-sm"
          className="mt-2 text-[color:var(--md-sys-color-on-surface-variant)]"
        >
          برای استفاده از سرویس تشخیص چهره زنده ابتدا یک پروفایل بسازید.
        </Typography>
      </div>
    </section>
  );
}

function ApiKeyActiveState() {
  return (
    <section dir="rtl" className="font-vazirmatn w-full px-4 pb-8 pt-6">
      <div className="mx-auto w-full max-w-3xl rounded-[24px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-6 shadow-[var(--elevation-1)]">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-primary)]/12 text-[color:var(--md-sys-color-primary)]">
            <KeyRound className="h-5 w-5" />
          </span>
          <div className="text-right">
            <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)]">
              کلید API فعال است
            </Typography>
            <Typography
              variant="body-sm"
              className="mt-1 text-[color:var(--md-sys-color-on-surface-variant)]"
            >
              سرویس تشخیص چهره زنده آماده استفاده است.
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BusinessLivenessServicePage() {
  const { currentProfile, loading, loadProfiles } = useSelectedProfile();
  const hasLoaded = useRef(false);
  const hasApiKey = Boolean(currentProfile?.has_api_key ?? currentProfile?.has_apikey);

  useEffect(() => {
    if (hasLoaded.current) return;
    loadProfiles();
    hasLoaded.current = true;
  }, [loadProfiles]);

  let content = <LivenessApiKeyPage />;

  if (loading && !currentProfile) {
    content = <LoadingState />;
  } else if (!currentProfile) {
    content = <NoProfileState />;
  } else if (hasApiKey) {
    content = <ApiKeyRegenerationPanel title={LIVENESS_SERVICE_TITLE} />;
  }

  return <DashboardLayout>{content}</DashboardLayout>;
}
