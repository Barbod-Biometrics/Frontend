import {
  type LucideIcon,
  Activity,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  FileText,
  Fingerprint,
  Layers,
  ScanFace,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Language } from "../../types";

export type ServiceCta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
};

export type ServiceVisual = {
  from: string;
  to: string;
  accent?: string;
  icon?: LucideIcon;
};

export type ServiceFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ServiceHighlight = {
  title: string;
  description: string;
  visual: ServiceVisual;
  align?: "left" | "right";
  cta?: ServiceCta;
};

export type ServiceBottomCta = {
  title: string;
  detail: string;
  secondaryDetail: string;
  primary: ServiceCta;
  secondary: ServiceCta;
};

export type ServicePageContent = {
  hero: {
    title: string;
    description: string;
    visual: ServiceVisual;
    primaryCta: ServiceCta;
    secondaryCta: ServiceCta;
  };
  features: ServiceFeature[];
  highlights: ServiceHighlight[];
  bottomCta: ServiceBottomCta;
};

export type ServicePageContentByLanguage = Record<Language, ServicePageContent>;

export const servicesContent: Record<string, ServicePageContentByLanguage> = {
  "face-recognition": {
    [Language.EN]: {
      hero: {
        title: "Face recognition",
        description:
          "Verify identity with deep-learning powered face matching. The capture is analyzed with advanced computer vision and compared against trusted references to approve or decline with high confidence.",
        visual: {
          from: "#0ea5e9",
          to: "#6366f1",
          accent: "#22d3ee",
          icon: ScanFace,
        },
        primaryCta: { label: "Request service", href: "/contact-sales" },
        secondaryCta: { label: "Test service", href: "/test-admin-panel", variant: "secondary" },
      },
      features: [
        {
          title: "Strong security",
          description:
            "Advanced biometric algorithms keep data private and block unauthorized access to sensitive information.",
          icon: ShieldCheck,
        },
        {
          title: "Fast processing",
          description: "Face matching completes in under 5 seconds with extremely low error rates.",
          icon: Zap,
        },
        {
          title: "Successful captures",
          description: "Capture attempts are logged with clear pass/fail signals for full visibility.",
          icon: BadgeCheck,
        },
        {
          title: "High accuracy",
          description: "Deep-learning models handle lighting, pose, and accessories with very high precision.",
          icon: BarChart3,
        },
      ],
      highlights: [
        {
          title: "Precise face matching",
          description:
            "Face recognition compares the user capture against reference data using advanced computer vision and deep learning to approve or reject with high accuracy.",
          visual: { from: "#2563eb", to: "#22d3ee", accent: "#38bdf8", icon: ScanFace },
          align: "left",
        },
        {
          title: "Facial feature analysis",
          description:
            "Key facial landmarks and geometry are automatically extracted and analyzed to guide reliable matching and reduce false results.",
          visual: { from: "#22d3ee", to: "#7c3aed", accent: "#8b5cf6", icon: Sparkles },
          align: "right",
        },
        {
          title: "Source verification & identity",
          description:
            "In the final step, extracted data is checked in real time against trusted sources to confirm user identity and return the result instantly.",
          visual: { from: "#2563eb", to: "#1e3a8a", accent: "#0ea5e9", icon: ShieldCheck },
          align: "left",
          cta: { label: "Test service", href: "/test-admin-panel", variant: "secondary" },
        },
      ],
      bottomCta: {
        title: "Use Barbod services",
        detail: "Create an account to access Barbod services for growth and onboarding.",
        secondaryDetail: "Need a tailored package for your business? Contact our sales team.",
        primary: { label: "Create account", href: "/login" },
        secondary: { label: "Contact sales", href: "/contact-sales", variant: "secondary" },
      },
    },
    [Language.FA]: {
      hero: {
        title: "تطبیق چهره",
        description:
          "با استفاده از سرویس تطبیق چهره، هویت کاربر از طریق تحلیل تصویر و الگوریتم‌های پیشرفته پردازش تصویری بررسی شده و در گام بعد با پایگاه داده تطبیق داده می‌شود. این سرویس طیف گسترده‌ای از سناریوهای هویت و تمامی فرآیندهای حسابی قابل استفاده است.",
        visual: {
          from: "#0ea5e9",
          to: "#6366f1",
          accent: "#22d3ee",
          icon: ScanFace,
        },
        primaryCta: { label: "درخواست سرویس", href: "/contact-sales" },
        secondaryCta: { label: "تست سرویس", href: "/test-admin-panel", variant: "secondary" },
      },
      features: [
        {
          title: "امنیت قوی",
          description:
            "طبق الگوریتم‌های پیشرفته‌ی شناسایی چهره، امنیت بالا و حفظ حریم خصوصی کاربران تضمین شده و اجازه دسترسی افراد غیر مجاز داده نمی‌شود.",
          icon: ShieldCheck,
        },
        {
          title: "پردازش سریع",
          description: "پردازش و تطبیق چهره در کمتر از ۵ ثانیه انجام شده و خطای سیستم نیز بسیار پایین است.",
          icon: Zap,
        },
        {
          title: "اخذ صورت‌های موفق",
          description:
            "تمامی مراحل تشخیص با ثبت نتایج موفق یا ناموفق پایش می‌شود تا گزارش دقیقی از وضعیت تطبیق در اختیار شما باشد.",
          icon: BadgeCheck,
        },
        {
          title: "دقت بالا",
          description:
            "با کمک مدل‌ها و الگوهای یادگیری عمیق در پردازش تصویر، دقت تطبیق چهره بسیار بالا بوده و خطای سیستم به حداقل می‌رسد.",
          icon: BarChart3,
        },
      ],
      highlights: [
        {
          title: "تطبیق دقیق چهره",
          description:
            "سرویس تطبیق چهره با الگوریتم‌های پیشرفته پردازش تصویر و یادگیری عمیق، تصویر کاربر را با داده‌های مرجع مقایسه می‌کند و هویت او را با دقت بسیار بالا تایید یا رد می‌کند.",
          visual: { from: "#2563eb", to: "#22d3ee", accent: "#38bdf8", icon: ScanFace },
          align: "left",
        },
        {
          title: "تحلیل ویژگی‌های چهره",
          description:
            "سیستم تشخیص چهره به‌طور خودکار ویژگی‌های کلیدی صورت شامل ساختار صورت و فاصله اجزا را استخراج و تحلیل کرده و مسیر تطبیق دقیق و مطمئن را انجام می‌دهد.",
          visual: { from: "#22d3ee", to: "#7c3aed", accent: "#8b5cf6", icon: Sparkles },
          align: "right",
        },
        {
          title: "استعلام مبدا و تایید هویت",
          description:
            "در مرحله نهایی، داده‌های استخراج‌شده به‌صورت برخط با پایگاه‌های رسمی تطبیق داده می‌شود تا صحت هویت کاربر تایید شده و نتیجه به‌صورت لحظه‌ای ارائه گردد.",
          visual: { from: "#2563eb", to: "#1e3a8a", accent: "#0ea5e9", icon: ShieldCheck },
          align: "left",
          cta: { label: "تست سرویس", href: "/test-admin-panel", variant: "secondary" },
        },
      ],
      bottomCta: {
        title: "استفاده از سرویس‌های باربد",
        detail: "با ایجاد حساب کاربری به خدمات باربد برای رشد و ارتقا کسب و کارتان دسترسی داشته باشید.",
        secondaryDetail: "برای ایجاد بسته اختصاصی کسب و کارتان با ما تماس بگیرید.",
        primary: { label: "ایجاد حساب کاربری", href: "/login" },
        secondary: { label: "تماس با تیم فروش", href: "/contact-sales", variant: "secondary" },
      },
    },
  },
  liveness: {
    [Language.EN]: {
      hero: {
        title: "Liveness detection",
        description:
          "Detect spoofing attempts with deep-learning liveness checks. The service analyzes facial depth and motion to reduce fraudulent actions, and fits seamlessly into login flows and identity verification journeys.",
        visual: { from: "#1d4ed8", to: "#8b5cf6", accent: "#a855f7", icon: Fingerprint },
        primaryCta: { label: "Request service", href: "/contact-sales" },
        secondaryCta: { label: "Test service", href: "/test-admin-panel", variant: "secondary" },
      },
      features: [
        {
          title: "Attack resistance",
          description:
            "Resists spoof attempts such as mask, print, and display attacks by analyzing depth and live facial cues.",
          icon: Shield,
        },
        {
          title: "Response speed",
          description: "Liveness checks return results quickly while keeping accuracy high for real traffic.",
          icon: Activity,
        },
        {
          title: "Successful captures",
          description: "Live capture attempts are monitored with clear pass/fail visibility.",
          icon: BadgeCheck,
        },
        {
          title: "High precision",
          description:
            "Motion and depth analysis powered by deep learning keeps false accepts and rejects very low.",
          icon: BarChart3,
        },
      ],
      highlights: [
        {
          title: "Live face analysis",
          description:
            "The service ingests the user image and uses deep-learning models to analyze live facial cues and natural movements, then determines if the face is real or spoofed.",
          visual: { from: "#1d4ed8", to: "#8b5cf6", accent: "#a855f7", icon: Fingerprint },
          align: "left",
        },
        {
          title: "Spoof attack prevention",
          description:
            "Subsequent checks evaluate mask, print, and display attacks. Intelligent safeguards flag suspicious attempts and block fraudulent access.",
          visual: { from: "#9333ea", to: "#ec4899", accent: "#fb7185", icon: ShieldCheck },
          align: "right",
        },
        {
          title: "Source verification & identity",
          description:
            "In the final step, live results are validated against trusted sources so the decision can be returned instantly.",
          visual: { from: "#2563eb", to: "#0ea5e9", accent: "#38bdf8", icon: CheckCircle2 },
          align: "left",
          cta: { label: "Test service", href: "/test-admin-panel", variant: "secondary" },
        },
      ],
      bottomCta: {
        title: "Use Barbod services",
        detail: "Create an account to access Barbod services for growth and onboarding.",
        secondaryDetail: "Need a tailored package for your business? Contact our sales team.",
        primary: { label: "Create account", href: "/login" },
        secondary: { label: "Contact sales", href: "/contact-sales", variant: "secondary" },
      },
    },
    [Language.FA]: {
      hero: {
        title: "تشخیص زنده‌بودن چهره",
        description:
          "این سرویس با استفاده از الگوریتم‌های عمیق پردازش تصویر و هوش مصنوعی زنده بودن چهره کاربر را تشخیص داده و با شناسایی میزان عمق و حالت‌های صورت، احتمال جعل و عملیات غیر مجاز را کاهش می‌دهد. این سرویس در انواع سیستم‌های ورود و فرآیندهای احراز هویت قابل استفاده است.",
        visual: { from: "#1d4ed8", to: "#8b5cf6", accent: "#a855f7", icon: Fingerprint },
        primaryCta: { label: "درخواست سرویس", href: "/contact-sales" },
        secondaryCta: { label: "تست سرویس", href: "/test-admin-panel", variant: "secondary" },
      },
      features: [
        {
          title: "مقاومت در برابر حملات",
          description:
            "سیستم در برابر حملات جعلی مانند Mask & Print Attack و Display Attack مقاوم است و الگوهای ساختگی را تشخیص می‌دهد.",
          icon: Shield,
        },
        {
          title: "نرخ پاسخ‌دهی",
          description: "پاسخ‌دهی و تشخیص زنده بودن چهره در زمان کوتاه و با دقت بالا انجام می‌شود.",
          icon: Zap,
        },
        {
          title: "اخذ صورت‌های موفق",
          description:
            "صورت‌های ثبت‌شده به‌صورت لحظه‌ای پایش می‌شود تا نتیجه موفق یا ناموفق فرآیند مشخص شود.",
          icon: BadgeCheck,
        },
        {
          title: "دقت بالا",
          description:
            "مدل‌های یادگیری عمیق با تحلیل حرکت و عمق چهره، دقت تشخیص را به سطح بالا می‌رسانند.",
          icon: BarChart3,
        },
      ],
      highlights: [
        {
          title: "تحلیل زنده‌بودن چهره",
          description:
            "سرویس ابتدا تصویر کاربر را دریافت کرده و با استفاده از مدل‌های یادگیری عمیق، الگوهای زنده‌بودن چهره و حرکات طبیعی را بررسی می‌کند و تعیین می‌کند که آیا چهره واقعی است یا خیر.",
          visual: { from: "#1d4ed8", to: "#8b5cf6", accent: "#a855f7", icon: Fingerprint },
          align: "left",
        },
        {
          title: "شناسایی و جلوگیری از حملات جعل",
          description:
            "در مرحله بعد سیستم انواع حملات جعل مانند Mask و Print Attack و Display Attack را بررسی می‌کند. با تحلیل فاکتورهای امنیتی، حملات جعلی شناسایی و درخواست رد می‌شود.",
          visual: { from: "#9333ea", to: "#ec4899", accent: "#fb7185", icon: ShieldCheck },
          align: "right",
        },
        {
          title: "استعلام مبدا و تایید هویت",
          description:
            "در مرحله نهایی، داده‌های استخراج‌شده به‌صورت برخط با پایگاه‌های رسمی تطبیق داده می‌شود تا صحت هویت کاربر تایید شده و نتیجه به‌صورت لحظه‌ای ارائه گردد.",
          visual: { from: "#2563eb", to: "#0ea5e9", accent: "#38bdf8", icon: CheckCircle2 },
          align: "left",
          cta: { label: "تست سرویس", href: "/test-admin-panel", variant: "secondary" },
        },
      ],
      bottomCta: {
        title: "استفاده از سرویس‌های باربد",
        detail: "با ایجاد حساب کاربری به خدمات باربد برای رشد و ارتقا کسب و کارتان دسترسی داشته باشید.",
        secondaryDetail: "برای ایجاد بسته اختصاصی کسب و کارتان با ما تماس بگیرید.",
        primary: { label: "ایجاد حساب کاربری", href: "/login" },
        secondary: { label: "تماس با تیم فروش", href: "/contact-sales", variant: "secondary" },
      },
    },
  },
  ocr: {
    [Language.EN]: {
      hero: {
        title: "OCR & national ID lookup",
        description:
          "Extract national ID card data automatically with computer vision, then verify it against official sources to return instant decisions.",
        visual: { from: "#0ea5e9", to: "#60a5fa", accent: "#38bdf8", icon: FileText },
        primaryCta: { label: "Request service", href: "/contact-sales" },
        secondaryCta: { label: "Test service", href: "/test-admin-panel", variant: "secondary" },
      },
      features: [
        {
          title: "Integration & scale",
          description: "OCR and lookup are delivered through APIs for easy integration and high throughput.",
          icon: Layers,
        },
        {
          title: "Response speed",
          description: "Decisions are returned quickly so onboarding flows stay smooth.",
          icon: Zap,
        },
        {
          title: "Processed documents",
          description: "ID cards are parsed accurately and delivered as structured, clean data.",
          icon: FileText,
        },
        {
          title: "Success rate",
          description: "High success in both extraction and verification to keep downstream quality high.",
          icon: BarChart3,
        },
      ],
      highlights: [
        {
          title: "Smart ID data extraction",
          description:
            "OCR analyzes the national ID card with advanced vision and machine learning to extract text and key fields precisely, returning a clean payload.",
          visual: { from: "#60a5fa", to: "#38bdf8", accent: "#0ea5e9", icon: FileText },
          align: "left",
        },
        {
          title: "Data analysis & validation",
          description:
            "After extraction, the system analyzes the data automatically, checks consistency, and flags anomalies before use.",
          visual: { from: "#0ea5e9", to: "#6366f1", accent: "#60a5fa", icon: ShieldCheck },
          align: "right",
        },
        {
          title: "Official source lookup",
          description:
            "In the final step the extracted data is queried against official sources to validate identity and deliver instant results.",
          visual: { from: "#2563eb", to: "#0ea5e9", accent: "#38bdf8", icon: CheckCircle2 },
          align: "left",
          cta: { label: "Test service", href: "/test-admin-panel", variant: "secondary" },
        },
      ],
      bottomCta: {
        title: "Use Barbod services",
        detail: "Create an account to access Barbod services for growth and onboarding.",
        secondaryDetail: "Need a tailored package for your business? Contact our sales team.",
        primary: { label: "Create account", href: "/login" },
        secondary: { label: "Contact sales", href: "/contact-sales", variant: "secondary" },
      },
    },
    [Language.FA]: {
      hero: {
        title: "سرویس OCR و استعلام کارت ملی",
        description:
          "این سرویس با استفاده از هوش مصنوعی و پردازش تصویر، اطلاعات کارت ملی را به‌صورت خودکار استخراج و به داده‌های دیجیتال تبدیل می‌کند. سپس با استعلام از مراجع رسمی، صحت اطلاعات بررسی شده و نتیجه به‌صورت آنی ارائه می‌شود.",
        visual: { from: "#0ea5e9", to: "#60a5fa", accent: "#38bdf8", icon: FileText },
        primaryCta: { label: "درخواست سرویس", href: "/contact-sales" },
        secondaryCta: { label: "تست سرویس", href: "/test-admin-panel", variant: "secondary" },
      },
      features: [
        {
          title: "یکپارچگی و مقیاس‌پذیری",
          description:
            "سرویس OCR و استعلام کارت ملی به‌صورت API ارائه می‌شود و قابلیت اتصال به سامانه‌های مختلف و پردازش در مقیاس بالا را دارد.",
          icon: Layers,
        },
        {
          title: "نرخ پاسخگویی",
          description: "نتیجه پردازش و استعلام کارت ملی در کوتاه‌ترین زمان اعلام می‌شود.",
          icon: Zap,
        },
        {
          title: "کارت‌های پردازش‌شده",
          description: "کارت‌های ملی با دقت بالا پردازش شده و داده‌های استخراج‌شده بدون خطا ارائه می‌شود.",
          icon: FileText,
        },
        {
          title: "نرخ موفقیت",
          description: "نرخ موفقیت سرویس در استخراج و تطبیق اطلاعات بسیار بالا بوده و کیفیت نتیجه تضمین می‌شود.",
          icon: BarChart3,
        },
      ],
      highlights: [
        {
          title: "استخراج هوشمند اطلاعات از کارت ملی",
          description:
            "سرویس OCR کارت ملی با استفاده از الگوریتم‌های پیشرفته پردازش تصویر و یادگیری ماشین اطلاعات متن و ویژگی‌های کارت را دقیق استخراج کرده و خروجی آماده به سیستم شما تحویل می‌دهد.",
          visual: { from: "#60a5fa", to: "#38bdf8", accent: "#0ea5e9", icon: FileText },
          align: "left",
        },
        {
          title: "تحلیل و اعتبارسنجی داده‌ها",
          description:
            "پس از استخراج اطلاعات، سیستم به‌صورت خودکار داده‌ها را تحلیل و صحت آن‌ها را با الگوریتم‌های داخلی بررسی کرده و خطاها یا تناقض‌ها را تشخیص می‌دهد.",
          visual: { from: "#0ea5e9", to: "#6366f1", accent: "#60a5fa", icon: ShieldCheck },
          align: "right",
        },
        {
          title: "استعلام مربوط از مراجع رسمی",
          description:
            "در مرحله آخر اطلاعات استخراج‌شده به‌صورت برخط با مراجع رسمی استعلام می‌شود تا داده‌ها تایید شده و نتیجه به‌صورت لحظه‌ای ارائه شود.",
          visual: { from: "#2563eb", to: "#0ea5e9", accent: "#38bdf8", icon: CheckCircle2 },
          align: "left",
          cta: { label: "تست سرویس", href: "/test-admin-panel", variant: "secondary" },
        },
      ],
      bottomCta: {
        title: "استفاده از سرویس‌های باربد",
        detail: "با ایجاد حساب کاربری به خدمات باربد برای رشد و ارتقا کسب و کارتان دسترسی داشته باشید.",
        secondaryDetail: "برای ایجاد بسته اختصاصی کسب و کارتان با ما تماس بگیرید.",
        primary: { label: "ایجاد حساب کاربری", href: "/login" },
        secondary: { label: "تماس با تیم فروش", href: "/contact-sales", variant: "secondary" },
      },
    },
  },
};
