"use client";

import { useState } from "react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { Card } from "../../components/ui/Card";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";
import { useLanguage } from "../../lib/useLanguage";
import { Navbar } from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { ShieldCheck, FileText, Fingerprint, Lock, UserCheck } from "lucide-react";

export default function TermsPage() {
  const { language, dir } = useLanguage();
  const isFA = language === "fa";
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const terms = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-[color:var(--brand-azure)]" />,
      titleFA: "امنیت و حریم خصوصی",
      titleEN: "Security & Privacy",
      descFA:
        "تمامی اطلاعات بیومتریک شما با استفاده از بالاترین استانداردهای امنیتی رمزگذاری و ذخیره می‌شود. ما متعهد به حفظ حریم خصوصی شما هستیم.",
      descEN:
        "All your biometric information is encrypted and stored using top security standards. We are committed to protecting your privacy.",
    },
    {
      icon: <FileText className="w-7 h-7 text-[color:var(--brand-azure)]" />,
      titleFA: "شرایط استفاده از سرویس",
      titleEN: "Terms of Service",
      descFA:
        "استفاده از این سرویس به منزله پذیرش کلیه شرایط و ضوابط تعیین شده است. لطفاً قبل از ادامه، تمامی موارد را با دقت مطالعه فرمایید.",
      descEN:
        "Using this service means you agree to all defined terms. Please read all points carefully before continuing.",
    },
    {
      icon: <Fingerprint className="w-7 h-7 text-[color:var(--brand-azure)]" />,
      titleFA: "احراز هویت بیومتریک",
      titleEN: "Biometric Verification",
      descFA:
        "سیستم احراز هویت ما از فناوری هوش مصنوعی پیشرفته استفاده می‌کند. داده‌های بیومتریک شما فقط برای تأیید هویت استفاده شده و با شخص ثالث به اشتراک گذاشته نمی‌شود.",
      descEN:
        "Our verification uses advanced AI technology. Your biometric data is used only for identity confirmation and is never shared with third parties.",
    },
    {
      icon: <Lock className="w-7 h-7 text-[color:var(--brand-azure)]" />,
      titleFA: "محرمانگی اطلاعات",
      titleEN: "Data Confidentiality",
      descFA:
        "اطلاعات شخصی و بیومتریک شما کاملاً محرمانه بوده و تحت هیچ شرایطی بدون اجازه شما در اختیار دیگران قرار نمی‌گیرد.",
      descEN:
        "Your personal and biometric information is strictly confidential and will never be shared without your consent.",
    },
    {
      icon: <UserCheck className="w-7 h-7 text-[color:var(--brand-azure)]" />,
      titleFA: "مسئولیت کاربر",
      titleEN: "User Responsibility",
      descFA:
        "شما مسئول حفظ امنیت حساب کاربری و رمز عبور خود هستید. در صورت مشاهده هرگونه فعالیت مشکوک، بلافاصله به تیم پشتیبانی اطلاع دهید.",
      descEN:
        "You are responsible for keeping your account credentials secure. If suspicious activity is detected, contact support immediately.",
    },
  ];

  return (
    <>
    <Navbar />
    <Section spacing="lg" className="min-h-screen" dir={dir}>
      <Container size="lg" className="flex flex-col gap-10">
        <Typography variant="h2" className="font-bold text-center  text-[color:var(--brand-azure)]">
          {isFA ? "قوانین و مقررات" : "Terms & Conditions"}
        </Typography>

        <Typography variant="body-lg" className="text-center text-[color:var(--md-sys-color-on-surface-variant)]">
          {isFA
            ? "لطفاً قوانین زیر را با دقت مطالعه کرده و در صورت موافقت، تایید نمایید."
            : "Please read the terms below carefully and confirm if you agree."}
        </Typography>

        <div className="flex flex-col gap-6">
          {terms.map((item, i) => (
            <Card
              key={i}
              variant="filled"
              className="p-6 bg-[color:var(--md-sys-color-surface-container-low)]"
            >
              <Typography variant="h4" className="font-semibold mb-2 flex items-center gap-2">
                {item.icon}
                {isFA ? item.titleFA : item.titleEN}
              </Typography>

              <Typography variant="body-lg">
                {isFA ? item.descFA : item.descEN}
              </Typography>
            </Card>
          ))}
        </div>

        <div
          className={`flex items-center justify-between mt-6 ${
            isFA ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <label
            className="flex items-center gap-3 cursor-pointer"
            style={{ direction: isFA ? "rtl" : "ltr" }}
          >
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-[color:var(--brand-azure)]"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <Typography variant="body-lg" className="font-medium">
              {isFA ? "شرایط را می‌پذیرم" : "I agree to the terms"}
            </Typography>
          </label>

          <Button size="lg" variant="primary" disabled={!accepted}  onClick={() => router.push("/")}>
            {isFA ? "ادامه" : "Continue"}
          </Button>
        </div>
      </Container>
    </Section>
    </>
  );
}
