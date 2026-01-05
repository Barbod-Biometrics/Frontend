"use client";

import { ApiKeyGenerationPage } from "./ApiKeyGenerationPage";

const LIVENESS_DESCRIPTION =
  "به منظور جلوگیری از جعل هویت با استفاده از عکس یا ویدیو، این سرویس حضور واقعی کاربر را با تحلیل حرکات، عمق تصویر و واکنش‌های زنده تشخیص می‌دهد. امنیت احراز هویت را به سطح ۳ بعدی می‌برد.";

export function LivenessApiKeyPage() {
  return (
    <ApiKeyGenerationPage
      title="تشخیص چهره زنده"
      description={LIVENESS_DESCRIPTION}
    />
  );
}
