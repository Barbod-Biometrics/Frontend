"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { ApiKeyModal } from "./ApiKeyModal";

type ApiKeyGenerationPageProps = {
  title: string;
  description: string;
  apiKey: string;
};

export function ApiKeyGenerationPage({ title, description, apiKey }: ApiKeyGenerationPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section dir="rtl" className="font-vazirmatn w-full px-4 pb-8 pt-6">
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
                    فعال‌سازی سرویس {title}
                  </Typography>
                  <Typography
                    variant="body-sm"
                    className="text-[color:var(--md-sys-color-on-surface-variant)]"
                  >
                    برای شروع کار، ابتدا کلید API بسازید.
                  </Typography>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--md-sys-color-primary)]/30 bg-[color:var(--md-sys-color-primary)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--md-sys-color-primary)]">
                <ShieldCheck className="h-4 w-4" />
                مشترک برای همه سرویس‌ها
              </span>
            </div>

            <div className="rounded-[22px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)]/60 p-4">
              <Typography
                variant="body-md"
                className="text-[color:var(--md-sys-color-on-surface)] leading-8"
              >
                {description}
              </Typography>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 text-right">
                <Typography
                  variant="caption"
                  className="text-[color:var(--md-sys-color-on-surface-variant)]"
                >
                  این کلید فقط یک‌بار نمایش داده می‌شود.
                </Typography>
                <Typography
                  variant="caption"
                  className="text-[color:var(--md-sys-color-on-surface-variant)]"
                >
                  پس از ساخت، همه سرویس‌ها فعال خواهند شد.
                </Typography>
              </div>
              <Button
                variant="gradient"
                className="min-w-[180px]"
                onClick={() => setIsModalOpen(true)}
              >
                ساخت کلید API
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apiKey={apiKey}
        serviceTitle={title}
      />
    </section>
  );
}
