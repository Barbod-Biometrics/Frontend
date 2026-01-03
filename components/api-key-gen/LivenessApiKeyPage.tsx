"use client";

import { ApiKeyGenerationPage } from "./ApiKeyGenerationPage";

const LIVENESS_DESCRIPTION =
  "به منظور جلوگیری از جعل هویت با استفاده از عکس یا ویدیو، این سرویس حضور واقعی کاربر را با تحلیل حرکات، عمق تصویر و واکنش‌های زنده تشخیص می‌دهد. امنیت احراز هویت را به سطح ۳ بعدی می‌برد.";

const STATIC_API_KEY = "barbod_live_01x9a7b2c4d5e6f7g8h9";

export function LivenessApiKeyPage() {
  return (
    <ApiKeyGenerationPage
      title="تشخیص چهره زنده"
      description={LIVENESS_DESCRIPTION}
      apiKey={STATIC_API_KEY}
    />
  );
}
