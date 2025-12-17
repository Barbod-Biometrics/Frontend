import { Language } from "../../types";

export type ServicePageContent = {
  title: string;
  subtitle: string;
  description: string;
  features: { title: string; description: string }[];
  cta: { label: string; href: string };
};

export type ServicePageContentByLanguage = Record<Language, ServicePageContent>;

export const servicesContent: Record<string, ServicePageContentByLanguage> = {
  "face-recognition": {
    [Language.EN]: {
      title: "Face recognition",
      subtitle: "High-precision matching with production-ready UX.",
      description:
        "Verify identities with reliable 1:1 and 1:N face matching. Designed for real-world conditions (lighting, pose, aging) and smooth onboarding experiences.",
      features: [
        {
          title: "Fast onboarding",
          description: "Optimized capture flow with guidance to reduce drop-off and retries.",
        },
        {
          title: "High accuracy",
          description: "Robust matching with strong performance across devices and environments.",
        },
        {
          title: "Privacy-first",
          description: "Secure processing pipelines aligned with modern security expectations.",
        },
        {
          title: "Easy integration",
          description: "Simple APIs and SDKs for web/mobile with scalable infrastructure.",
        },
      ],
      cta: { label: "Contact sales", href: "/contact-sales" },
    },
    [Language.FA]: {
      title: "تشخیص چهره",
      subtitle: "تطبیق دقیق، سریع و مناسبِ محیط‌های واقعی",
      description:
        "هویت کاربران را با تطبیق چهره (۱:۱ و ۱:N) با دقت بالا تأیید کنید. طراحی‌شده برای شرایط واقعی (نور، زاویه، تغییرات چهره) و تجربه کاربری روان در مسیر احراز هویت.",
      features: [
        {
          title: "تجربه کاربری روان",
          description: "راهنمایی مرحله‌به‌مرحله برای کاهش خطا و افزایش نرخ تکمیل فرآیند.",
        },
        {
          title: "دقت بالا",
          description: "عملکرد پایدار روی دستگاه‌ها و شرایط مختلف با الگوریتم‌های بهینه.",
        },
        {
          title: "امنیت و حریم خصوصی",
          description: "پردازش امن و سازگار با الزامات امنیتی و حریم خصوصی.",
        },
        {
          title: "یکپارچه‌سازی آسان",
          description: "API و SDK ساده برای وب/موبایل با قابلیت مقیاس‌پذیری.",
        },
      ],
      cta: { label: "تماس با تیم فروش", href: "/contact-sales" },
    },
  },
  liveness: {
    [Language.EN]: {
      title: "Liveness detection",
      subtitle: "Stop spoofing with modern anti-spoof checks.",
      description:
        "Protect your onboarding against printed photos, screen replays, and mask attacks with robust liveness signals and UX-friendly challenges.",
      features: [
        {
          title: "Anti-spoof protection",
          description: "Detect common spoofing attempts and reduce false accept rates.",
        },
        {
          title: "User-friendly flow",
          description: "Short, clear challenges that keep completion rates high.",
        },
        {
          title: "Actionable signals",
          description: "Get liveness confidence signals to power automated decisions.",
        },
        {
          title: "Works at scale",
          description: "Built for high-volume traffic and production reliability.",
        },
      ],
      cta: { label: "Contact sales", href: "/contact-sales" },
    },
    [Language.FA]: {
      title: "تشخیص زنده بودن چهره",
      subtitle: "جلوگیری از جعل با چک‌های ضداسپوفینگ",
      description:
        "با سیگنال‌های زنده‌بودن و چالش‌های کاربرپسند، از حملات جعل (عکس چاپی، نمایش روی صفحه، ویدیو و ماسک) جلوگیری کنید و ریسک تقلب را کاهش دهید.",
      features: [
        {
          title: "ضدجعل قوی",
          description: "شناسایی تلاش‌های رایج جعل و کاهش پذیرش اشتباه (False Accept).",
        },
        {
          title: "چالش‌های کوتاه و واضح",
          description: "فرآیند ساده برای حفظ نرخ تکمیل بالا و تجربه بهتر.",
        },
        {
          title: "سیگنال‌های قابل تصمیم‌گیری",
          description: "امتیاز/سیگنال اطمینان برای اتوماسیون تصمیم‌گیری و بررسی.",
        },
        {
          title: "مقیاس‌پذیر",
          description: "طراحی‌شده برای ترافیک بالا و پایداری در محیط عملیاتی.",
        },
      ],
      cta: { label: "تماس با تیم فروش", href: "/contact-sales" },
    },
  },
  ocr: {
    [Language.EN]: {
      title: "Document OCR",
      subtitle: "Extract identity data securely and instantly.",
      description:
        "Scan IDs and documents to extract structured data with high accuracy. Reduce manual entry, speed up onboarding, and improve data quality.",
      features: [
        {
          title: "Fast extraction",
          description: "Instant parsing to reduce form-filling and user friction.",
        },
        {
          title: "High-quality data",
          description: "Clean, structured outputs to improve downstream verification.",
        },
        {
          title: "Multilingual support",
          description: "Designed for Persian and international document formats.",
        },
        {
          title: "Secure processing",
          description: "Data handled with strong security practices and controls.",
        },
      ],
      cta: { label: "Contact sales", href: "/contact-sales" },
    },
    [Language.FA]: {
      title: "OCR مدارک هویتی",
      subtitle: "استخراج سریع و امن اطلاعات از مدارک",
      description:
        "کارت ملی و مدارک شناسایی را اسکن کنید و اطلاعات ساخت‌یافته را با دقت بالا استخراج کنید. ورود دستی را کاهش دهید، زمان onboarding را کوتاه کنید و کیفیت داده را بالا ببرید.",
      features: [
        {
          title: "استخراج سریع",
          description: "کاهش پرکردن فرم و اصطکاک کاربر با استخراج خودکار.",
        },
        {
          title: "داده ساخت‌یافته",
          description: "خروجی تمیز و قابل استفاده برای مراحل بعدی احراز هویت.",
        },
        {
          title: "پشتیبانی مناسب فارسی",
          description: "طراحی‌شده برای مدارک فارسی و قالب‌های رایج بین‌المللی.",
        },
        {
          title: "پردازش امن",
          description: "مدیریت داده با کنترل‌های امنیتی و استانداردهای مناسب.",
        },
      ],
      cta: { label: "تماس با تیم فروش", href: "/contact-sales" },
    },
  },
};

