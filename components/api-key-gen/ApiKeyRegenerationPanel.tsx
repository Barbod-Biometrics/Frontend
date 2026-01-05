"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { ApiKeyModal } from "./ApiKeyModal";
import { Notification } from "../Notification";
import { regenerateApiKey } from "../../lib/api/apiKey";
import type { RootState } from "../../store/store";
import { loadUserProfiles, setProfileApiKeyStatus } from "../../store/selectedProfileSlice";

type ApiKeyRegenerationPanelProps = {
  title: string;
};

const REGEN_DESCRIPTION = "در صورت فراموشی کلید API، می‌توانید آن را دوباره تولید کنید.";

const resolveErrorMessage = (error: unknown) => {
  if (typeof error === "string" && error.trim()) return error;
  if (error instanceof Error && error.message) return error.message;
  return "خطا در دریافت کلید جدید. دوباره تلاش کنید.";
};

export function ApiKeyRegenerationPanel({ title }: ApiKeyRegenerationPanelProps) {
  const dispatch = useDispatch();
  const currentProfile = useSelector((state: RootState) => state.selectedProfile.currentProfile);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
  };

  const handleRegenerate = async () => {
    if (isRegenerating) return;
    if (!currentProfile?.id) {
      showNotification("پروفایل فعالی انتخاب نشده است.", "error");
      return;
    }

    try {
      setIsRegenerating(true);
      const result = await regenerateApiKey(currentProfile.id);
      setGeneratedKey(result.apiKey);
      setIsModalOpen(true);
    } catch (error) {
      showNotification(resolveErrorMessage(error), "error");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleConfirm = () => {
    if (!currentProfile?.id) return;
    dispatch(setProfileApiKeyStatus({ profileId: currentProfile.id, hasApiKey: true }));
    dispatch(loadUserProfiles());
    showNotification("کلید API با موفقیت دوباره تولید شد.", "success");
  };

  return (
    <section dir="rtl" className="font-vazirmatn w-full px-4 pb-8 pt-6">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative overflow-hidden rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-2)]">
          <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.12),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(37,99,235,0.08),transparent_30%)]" />

          <div className="relative space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-primary)]/12 text-[color:var(--md-sys-color-primary)] shadow-[0_8px_20px_rgba(37,99,235,0.16)]">
                  <KeyRound className="h-6 w-6" />
                </span>
                <div className="text-right">
                  <Typography
                    variant="h5"
                    className="text-[color:var(--md-sys-color-on-surface)]"
                  >
                    تولید مجدد کلید API {title}
                  </Typography>
                  <Typography
                    variant="body-sm"
                    className="text-[color:var(--md-sys-color-on-surface-variant)]"
                  >
                    {REGEN_DESCRIPTION}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                variant="gradient"
                className="min-w-[180px]"
                onClick={handleRegenerate}
                disabled={isRegenerating}
              >
                {isRegenerating ? "در حال تولید..." : "تولید مجدد کلید API"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        apiKey={generatedKey}
        serviceTitle={title}
      />
    </section>
  );
}
