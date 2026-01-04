"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Modal } from "../Modal";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

type ApiKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  apiKey: string;
  serviceTitle: string;
};

export function ApiKeyModal({ isOpen, onClose, onConfirm, apiKey, serviceTitle }: ApiKeyModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = apiKey;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(textarea);
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ذخیره کلید API" size="md">
      <div dir="rtl" className="space-y-6">
        <div className="space-y-2 text-right">
          <Typography
            variant="body-lg"
            className="font-semibold text-[color:var(--md-sys-color-on-surface)]"
          >
            کلید API سرویس {serviceTitle}
          </Typography>
          <Typography
            variant="body-sm"
            className="leading-7 text-[color:var(--md-sys-color-on-surface-variant)]"
          >
            این کلید فقط یک‌بار نمایش داده می‌شود. آن را در جای امن نگه دارید و با دیگران
            به اشتراک نگذارید.
          </Typography>
        </div>

        <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 shadow-[var(--elevation-1)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <code
              dir="ltr"
              className="break-all rounded-xl bg-[color:var(--md-sys-color-surface-container-high)] px-3 py-2 text-sm text-[color:var(--md-sys-color-on-surface)]"
            >
              {apiKey}
            </code>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="min-w-[110px]"
            >
              {copied ? "کپی شد" : "کپی"}
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className="min-w-[120px]">
            متوجه شدم
          </Button>
        </div>
      </div>
    </Modal>
  );
}
