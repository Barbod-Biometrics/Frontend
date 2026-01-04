"use client";

import { ApiKeyGenerationPage } from "./ApiKeyGenerationPage";

const OCR_DESCRIPTION =
  "این سرویس با استفاده از الگوریتم‌های هوش مصنوعی، اطلاعات موجود در کارت ملی را به‌صورت خودکار شناسایی و به داده‌های دیجیتال تبدیل می‌کند. این سرویس دقت بالا، پشتیبانی از چند زبان و سرعت پردازش آنی را در اختیار کسب‌وکارها قرار می‌دهد.";

export function OcrApiKeyPage() {
  return (
    <ApiKeyGenerationPage
      title="تشخیص هوشمند مدارک (OCR)"
      description={OCR_DESCRIPTION}
    />
  );
}
