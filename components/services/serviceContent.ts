import { Language } from "../../types";

export type LocalizedString = {
  en: string;
  fa: string;
};

export type FeatureCard = {
  icon: "shield" | "bolt" | "user" | "chart" | "spark" | "doc" | "layers";
  title: LocalizedString;
  description: LocalizedString;
};

export type StepSection = {
  title: LocalizedString;
  description: LocalizedString;
  visual: "analysis" | "shield" | "document" | "compare" | "scan";
};

export type PricingPlan = {
  name: LocalizedString;
  requests: LocalizedString;
  price: LocalizedString;
  features: LocalizedString;
};

export type ServiceContent = {
  slug: string;
  accent: { from: string; to: string };
  hero: {
    eyebrow?: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    primaryCta: LocalizedString;
    secondaryCta: LocalizedString;
    visual: "face" | "liveness" | "ocr" | "match";
  };
  features: FeatureCard[];
  steps: StepSection[];
  pricing?: {
    title: LocalizedString;
    note: LocalizedString;
    plans: PricingPlan[];
  };
  finalCta?: {
    title: LocalizedString;
    description: LocalizedString;
    primary: LocalizedString;
    secondary?: LocalizedString;
  };
};

const t = (en: string, fa: string): LocalizedString => ({ en, fa });

export const servicesContent: Record<string, ServiceContent> = {
  liveness: {
    slug: "liveness",
    accent: { from: "#2563eb", to: "#7c3aed" },
    hero: {
      eyebrow: t("AI-powered security", "امنیت با هوش مصنوعی"),
      title: t("Face Liveness Detection", "تشخیص زنده‌بودن چهره"),
      description: t(
        "Detect spoofs and deepfakes in milliseconds with camera-only checks that block display, print, and mask attacks. Perfect for high-risk onboarding and payments.",
        "با الگوریتم‌های یادگیری عمیق، حملات جعلی مانند نمایش تصویر، چاپ و ماسک را در چند میلی‌ثانیه شناسایی می‌کند و برای احراز هویت حساس ایده‌آل است."
      ),
      primaryCta: t("Request service", "درخواست سرویس"),
      secondaryCta: t("Run a test", "تست سرویس"),
      visual: "liveness",
    },
    features: [
      {
        icon: "shield",
        title: t("Spoof resistance", "مقاومت در برابر حملات"),
        description: t(
          "Blocks display, replay, mask, and print attacks with ISO 30107-3 aligned defenses.",
          "حملات تصویر، ویدیو، ماسک و چاپ را مطابق استاندارد ISO 30107-3 مسدود می‌کند."
        ),
      },
      {
        icon: "bolt",
        title: t("Fast responses", "نرخ پاسخ‌دهی"),
        description: t(
          "Sub-500ms responses for seamless flows on web and mobile.",
          "زمان پاسخ کمتر از ۵۰۰ میلی‌ثانیه برای تجربه روان در وب و موبایل."
        ),
      },
      {
        icon: "user",
        title: t("Trusted outcomes", "احراز هویت‌های موفق"),
        description: t(
          "High success rates built on billions of verified sessions.",
          "نرخ موفقیت بالا مبتنی بر میلیون‌ها احراز هویت موفق."
        ),
      },
      {
        icon: "chart",
        title: t("High precision", "دقت بالا"),
        description: t(
          "Advanced models catch subtle spoofs while keeping false rejects low.",
          "مدل‌های پیشرفته همزمان با رد حملات ظریف، خطای رد نادرست را پایین نگه می‌دارند."
        ),
      },
    ],
    steps: [
      {
        title: t("Liveness analysis", "تحلیل زنده‌بودن چهره"),
        description: t(
          "Analyzes light patterns, micro-movements, and 3D cues to confirm a real face is present.",
          "الگوهای نوری، حرکات ریز و سرنخ‌های سه‌بعدی بررسی می‌شود تا زنده‌بودن چهره تایید گردد."
        ),
        visual: "analysis",
      },
      {
        title: t("Spoof detection", "شناسایی حملات جعلی"),
        description: t(
          "Detects replay, print, and mask artifacts with anti-spoof models trained on diverse attacks.",
          "آثار حملات نمایش، چاپ و ماسک با مدل‌های ضدجعل آموزش‌دیده روی سناریوهای متنوع شناسایی می‌شود."
        ),
        visual: "shield",
      },
      {
        title: t("Instant verification", "استعلام برخط و تأیید هویت"),
        description: t(
          "Combines liveness with ID checks to return a decision instantly for onboarding flows.",
          "همراه با استعلام هویت، نتیجه لحظه‌ای برای فرایندهای ثبت‌نام و احراز هویت ارائه می‌شود."
        ),
        visual: "scan",
      },
    ],
    pricing: {
      title: t("Liveness pricing", "تعرفه‌های سرویس تشخیص زنده‌بودن چهره"),
      note: t("10% VAT applies to all plans.", "۱۰٪ مالیات بر ارزش افزوده به مبالغ اضافه می‌گردد."),
      plans: [
        {
          name: t("Starter", "پایه"),
          requests: t("Up to 1,000 / month", "تا ۱,۰۰۰ درخواست ماهانه"),
          price: t("7,000 IRR per request", "۷,۰۰۰ ریال به ازای هر درخواست"),
          features: t("Liveness checks and instant results.", "تشخیص زنده‌بودن و استعلام لحظه‌ای."),
        },
        {
          name: t("Pro", "حرفه‌ای"),
          requests: t("Up to 10,000 / month", "تا ۱۰,۰۰۰ درخواست ماهانه"),
          price: t("6,500 IRR per request", "۶,۵۰۰ ریال به ازای هر درخواست"),
          features: t("Liveness, reporting, and API access.", "تشخیص زنده‌بودن، گزارش‌گیری و دسترسی API."),
        },
        {
          name: t("Enterprise", "سازمانی"),
          requests: t("Up to 50,000 / month", "تا ۵۰,۰۰۰ درخواست ماهانه"),
          price: t("6,000 IRR per request", "۶,۰۰۰ ریال به ازای هر درخواست"),
          features: t("Priority support, uptime SLAs, full reports.", "پشتیبانی اولویت‌دار، SLA و گزارش‌های جامع."),
        },
      ],
    },
    finalCta: {
      title: t("Ready to block spoofing?", "آماده مقابله با جعل هستید؟"),
      description: t(
        "Set up in minutes with our SDKs and start securing onboarding today.",
        "با SDK ما در چند دقیقه راه‌اندازی کنید و همین امروز احراز هویت امن را آغاز کنید."
      ),
      primary: t("Start now", "همین حالا شروع کنید"),
      secondary: t("Talk to sales", "تماس با تیم فروش"),
    },
  },
  "face-recognition": {
    slug: "face-recognition",
    accent: { from: "#0ea5e9", to: "#6366f1" },
    hero: {
      title: t("Face Liveness Detection", "تشخیص زنده‌بودن چهره"),
      description: t(
        "AI-powered face liveness that blocks photo, video, and mask attacks so only real users pass your checks. Built for secure onboarding and high-risk journeys.",
        "این سرویس با استفاده از الگوریتم‌های عمیق پردازش تصویر و هوش مصنوعی، زنده‌بودن چهره کاربر را تشخیص می‌دهد و از حملات جعل هویتی مانند نمایش تصویر، ویدئو یا ماسک جلوگیری می‌کند. این سرویس امنیت احراز هویت دیجیتال را چندین برابر کرده و برای ثبت‌نام، ورود و فرآیندهای حساس اجباری است."
      ),
      primaryCta: t("Request service", "درخواست سرویس"),
      secondaryCta: t("Run a test", "اجرای تست"),
      visual: "liveness",
    },
    features: [
      {
        icon: "chart",
        title: t("High accuracy", "دقت بالا"),
        description: t(
          "Deep-learning models deliver 99%+ liveness precision and minimize spoof risk.",
          "استفاده از مدل‌های به‌روز یادگیری عمیق، دقت تشخیص زنده‌بودن را به بیش از ۹۹٪ رسانده و احتمال خطای انسانی یا حملات جعلی را به حداقل می‌رساند."
        ),
      },
      {
        icon: "user",
        title: t("Proven at scale", "احراز هویت های موفق"),
        description: t(
          "80,000+ successful live authentications validate reliability in production.",
          "تاکنون بیش از ۸۰,۰۰۰ احراز هویت زنده‌بودن توسط سرویس با موفقیت انجام شده است. این تعداد بالای تراکنش‌های موفق، اعتماد به دقت و پایداری سرویس را تضمین می‌کند."
        ),
      },
      {
        icon: "bolt",
        title: t("Under 1 second response", "نرخ پاسخ‌دهی"),
        description: t(
          "Median decision times under one second keep high-volume funnels smooth.",
          "میانگین زمان پردازش و تشخیص زنده‌بودن کمتر از یک ثانیه بوده و برای کاربردهای پرترافیک و سرویس‌های سازمانی کاملاً مناسب است."
        ),
      },
      {
        icon: "shield",
        title: t("Attack resistance", "مقاومت در برابر حملات"),
        description: t(
          "Detects display, print, and mask attacks with robust anti-spoof defenses.",
          "سیستم توانایی شناسایی انواع حملات از جمله Display Attack ، Print Attack و Mask Attack را داشته و امنیت لایه بیومتریک را به‌طور قابل‌توجهی افزایش می‌دهد."
        ),
      },
    ],
    steps: [
      {
        title: t("Live-face analysis", "تحلیل زنده‌بودن چهره"),
        description: t(
          "Examines light patterns, facial texture, and natural micro-movements to ensure the subject is real.",
          "سرویس ابتدا تصویر کاربر را دریافت کرده و با استفاده از مدل‌های یادگیری عمیق، الگوهای نوری، بافت چهره و حرکات طبیعی را بررسی می‌کند. این مرحله تعیین می‌کند که آیا چهره واقعی است یا خیر."
        ),
        visual: "analysis",
      },
      {
        title: t("Spoof attack detection", "شناسایی و جلوگیری از حملات جعل"),
        description: t(
          "Identifies print, display, and mask artifacts with dedicated anti-spoofing models.",
          "در مرحله بعد، سیستم انواع حملات جعل مانند Print Attack، Display Attack و Mask Attack را بررسی می‌کند. الگوریتم‌های ضدجعل با دقت بالا رفتارهای غیرطبیعی، انعکاس‌های ساختگی و تلاش‌های تقلیدی را شناسایی کرده و درخواست غیرواقعی را رد می‌کنند."
        ),
        visual: "shield",
      },
      {
        title: t("Real-time identity check", "استعلام برخط و تأیید هویت"),
        description: t(
          "Matches extracted data against official sources in real time for instant verification.",
          "در مرحله نهایی، داده‌های استخراج‌شده به‌صورت برخط با پایگاه‌های رسمی تطبیق داده می‌شوند تا صحت هویت کاربر تأیید شود و نتیجه به‌صورت لحظه‌ای ارائه گردد."
        ),
        visual: "scan",
      },
    ],
  },
  ocr: {
    slug: "ocr",
    accent: { from: "#22c55e", to: "#0ea5e9" },
    hero: {
      eyebrow: t("Automated ID data", "استخراج هوشمند اطلاعات"),
      title: t("OCR & National ID Verification", "سرویس OCR و استعلام کارت ملی"),
      description: t(
        "Extract and validate ID data instantly with high accuracy. Perfect for onboarding, KYC, and automated form fill.",
        "اطلاعات کارت ملی را با دقت بالا استخراج و به‌صورت لحظه‌ای اعتبارسنجی می‌کند؛ مناسب ثبت‌نام، KYC و تکمیل خودکار فرم‌ها."
      ),
      primaryCta: t("Request service", "درخواست سرویس"),
      secondaryCta: t("Run a test", "تست سرویس"),
      visual: "ocr",
    },
    features: [
      {
        icon: "layers",
        title: t("Integrated & scalable", "یکپارچگی و مقیاس‌پذیری"),
        description: t(
          "Secure APIs that plug into your CRM, onboarding, or banking apps.",
          "API امن برای اتصال به CRM، سامانه‌های ثبت‌نام یا اپلیکیشن‌های بانکی."
        ),
      },
      {
        icon: "bolt",
        title: t("Quick responses", "نرخ پاسخگویی"),
        description: t(
          "Low-latency OCR for real-time flows on web and mobile.",
          "OCR کم‌تاخیر برای جریان‌های لحظه‌ای وب و موبایل."
        ),
      },
      {
        icon: "doc",
        title: t("Processed IDs", "کارت‌های پردازش‌شده"),
        description: t(
          "Battle-tested on hundreds of thousands of IDs in production.",
          "روی صدها هزار کارت در محیط عملیاتی تست و بهینه شده است."
        ),
      },
      {
        icon: "chart",
        title: t("High success rate", "نرخ موفقیت"),
        description: t(
          "Cutting-edge vision models deliver top extraction accuracy.",
          "مدل‌های بینایی پیشرفته دقت بالایی در استخراج اطلاعات فراهم می‌کنند."
        ),
      },
    ],
    steps: [
      {
        title: t("Smart extraction", "استخراج هوشمند اطلاعات"),
        description: t(
          "Reads ID fields with deep learning and layout-aware parsing.",
          "فیلدهای کارت با یادگیری عمیق و تحلیل ساختار صفحه خوانده می‌شود."
        ),
        visual: "document",
      },
      {
        title: t("Data validation", "تحلیل و اعتبارسنجی داده‌ها"),
        description: t(
          "Checks formats, birthdates, and ID control rules automatically.",
          "قالب داده‌ها، تاریخ تولد و قوانین کنترل شماره ملی به‌صورت خودکار بررسی می‌شود."
        ),
        visual: "analysis",
      },
      {
        title: t("Official verification", "استعلام برخط از مراجع رسمی"),
        description: t(
          "Optional online checks against official registries for instant confirmation.",
          "امکان استعلام برخط با پایگاه‌های رسمی برای تأیید لحظه‌ای.",
        ),
        visual: "scan",
      },
    ],
    pricing: {
      title: t("OCR pricing", "تعرفه‌های سرویس OCR و استعلام کارت ملی"),
      note: t("10% VAT applies to all plans.", "۱۰٪ مالیات بر ارزش افزوده به مبالغ اضافه می‌گردد."),
      plans: [
        {
          name: t("Starter", "پایه"),
          requests: t("Up to 1,000 / month", "تا ۱,۰۰۰ درخواست ماهانه"),
          price: t("2,000 IRR per request", "۲,۰۰۰ ریال به ازای هر درخواست"),
          features: t("OCR + basic verification.", "OCR و استعلام پایه."),
        },
        {
          name: t("Pro", "حرفه‌ای"),
          requests: t("Up to 10,000 / month", "تا ۱۰,۰۰۰ درخواست ماهانه"),
          price: t("1,500 IRR per request", "۱,۵۰۰ ریال به ازای هر درخواست"),
          features: t("OCR + verification + API access.", "OCR، استعلام و دسترسی API."),
        },
        {
          name: t("Enterprise", "سازمانی"),
          requests: t("Up to 50,000 / month", "تا ۵۰,۰۰۰ درخواست ماهانه"),
          price: t("1,000 IRR per request", "۱,۰۰۰ ریال به ازای هر درخواست"),
          features: t("Full access, priority support, detailed reports.", "دسترسی کامل، پشتیبانی اولویت‌دار و گزارش جامع."),
        },
      ],
    },
    finalCta: {
      title: t("Automate your onboarding", "فرآیند ثبت‌نام را خودکار کنید"),
      description: t(
        "Drop our OCR flow into your KYC and capture clean data instantly.",
        "جریان OCR ما را به KYC اضافه کنید و بلافاصله داده‌های تمیز دریافت کنید."
      ),
      primary: t("Start OCR", "شروع OCR"),
      secondary: t("Contact sales", "تماس با تیم فروش"),
    },
  },
};

export const resolveCopy = (text: LocalizedString, language: Language) =>
  language === Language.FA ? text.fa : text.en;
