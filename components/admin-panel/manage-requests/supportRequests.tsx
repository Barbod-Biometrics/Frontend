"use client";

import { Typography } from "../../ui/Typography";

export default function SupportRequests() {
  return (
    <section
      dir="rtl"
      className="font-vazirmatn flex-1 overflow-hidden bg-[color:var(--md-sys-color-surface-container-lowest)] px-4 pb-10 pt-8 md:px-10"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-4 shadow-[var(--elevation-2)]">
          <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)]">
            تماس با پشتیبانی
          </Typography>
          <Typography
            variant="body-md"
            className="mt-2 text-[color:var(--md-sys-color-on-surface-variant)]"
          >
            این بخش به‌زودی فعال می‌شود.
          </Typography>
        </div>
      </div>
    </section>
  );
}
