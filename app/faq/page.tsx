"use client";

import React, { useState } from "react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { Card } from "../../components/ui/Card";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";
import { useLanguage } from "../../lib/useLanguage";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";

interface FAQItem {
  questionFA: string;
  questionEN: string;
  answerFA: string;
  answerEN: string;
}

export default function FAQPage() {
  const { language, dir } = useLanguage();
  const isFA = language === "fa";
  const router = useRouter();

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      questionFA: "چرا کسب‌وکار من باید از احراز هویت بیومتریک استفاده کند؟",
      questionEN: "Why should my business use biometric authentication?",
      answerFA:
        "استفاده از احراز هویت بیومتریک به کسب‌وکارها کمک می‌کند تا از سوءاستفاده‌ها، جعل هویت، ورود ربات‌ها و ثبت‌نام‌های غیرواقعی جلوگیری کنند. این روش باعث کاهش ریسک‌های مالی، حقوقی و افزایش اعتماد کاربران می‌شود.",
      answerEN:
        "Implementing biometric authentication helps businesses prevent fraud, identity theft, bot entries, and fake registrations. It reduces financial and legal risks while boosting user trust.",
    },
    {
      questionFA: "تشخیص چهره چگونه کار می‌کند؟",
      questionEN: "How does face recognition work?",
      answerFA:
        "سیستم با استفاده از الگوریتم‌های پیشرفته هوش مصنوعی تصویر کاربر را تحلیل کرده و ویژگی‌های بیومتریک استخراج‌شده را با تصویر مرجع مقایسه می‌کند. تصاویر خام ذخیره نمی‌شوند و تنها الگوهای رمزنگاری شده بررسی می‌شوند.",
      answerEN:
        "The system analyzes user images using advanced AI algorithms and compares extracted biometric features with a reference image. Raw images are not stored; only encrypted patterns are verified.",
    },
    {
      questionFA: "تشخیص زنده بودن (Liveness) یعنی چه؟",
      questionEN: "What is Liveness detection?",
      answerFA:
        "تشخیص زنده بودن تضمین می‌کند که فرد واقعی مقابل دوربین است و نه عکس، ویدیو یا ماسک. این فرآیند بخش مهمی از احراز هویت است و جلوی جعل هویت را می‌گیرد.",
      answerEN:
        "Liveness detection ensures that a real person is in front of the camera, not a photo, video, or mask. This process is essential to prevent identity fraud.",
    },
    {
      questionFA: "آیا تصاویر کاربران ذخیره می‌شوند؟",
      questionEN: "Are user images stored?",
      answerFA:
        "خیر، تصاویر خام کاربران ذخیره نمی‌شوند. فقط الگوهای بیومتریک رمزنگاری‌شده در سرورها نگهداری می‌شوند و در شرایط قانونی و طبق سیاست‌های امنیتی مورد استفاده قرار می‌گیرند.",
      answerEN:
        "No, raw user images are not stored. Only encrypted biometric patterns are maintained on servers and are used according to legal requirements and security policies.",
    },
    {
      questionFA: "OCR کارت ملی چگونه کار می‌کند؟",
      questionEN: "How does national ID OCR work?",
      answerFA:
        "کارت ملی کاربر با استفاده از دوربین اسکن می‌شود و اطلاعات متنی مانند نام، کد ملی و تاریخ تولد با الگوریتم OCR استخراج می‌شوند. این فرآیند سریع، دقیق و کاملاً امن است.",
      answerEN:
        "The user's national ID card is scanned using a camera, and textual information such as name, national ID, and birthdate is extracted via OCR algorithms. The process is fast, accurate, and secure.",
    },
    {
      questionFA: "آیا سرویس OCR خطا دارد؟",
      questionEN: "Does the OCR service make mistakes?",
      answerFA:
        "در شرایط نور مناسب و کیفیت تصویر بالا، دقت این سرویس بالای ۹۸٪ است. در صورت بروز خطا، کاربر می‌تواند تصویر جدید آپلود کرده یا از پشتیبانی کمک بگیرد.",
      answerEN:
        "Under good lighting and high image quality, the OCR accuracy exceeds 98%. If errors occur, users can upload a new image or contact support.",
    },
    {
      questionFA: "اطلاعات من کجا ذخیره می‌شود؟",
      questionEN: "Where is my data stored?",
      answerFA:
        "تمام داده‌ها در سرورهای امن داخل کشور و با رعایت استانداردهای رمزنگاری سطح بالا ذخیره می‌شوند. بدون اجازه کاربر هیچ داده‌ای با شخص ثالث به اشتراک گذاشته نمی‌شود.",
      answerEN:
        "All data is stored on secure domestic servers with high-level encryption standards. No data is shared with third parties without user consent.",
    },
    {
      questionFA: "آیا استفاده از این سرویس‌ها امن است؟",
      questionEN: "Is using these services secure?",
      answerFA:
        "بله، سرویس‌ها از رمزنگاری پیشرفته، توکن‌سازی و استانداردهای امنیتی سطح بانک استفاده می‌کنند تا امنیت کامل اطلاعات کاربران تضمین شود.",
      answerEN:
        "Yes, services employ advanced encryption, tokenization, and bank-level security standards to fully protect user information.",
    },
    {
      questionFA: "فرآیند احراز هویت چقدر طول می‌کشد؟",
      questionEN: "How long does the authentication process take?",
      answerFA:
        "معمولاً بین ۱۰ تا ۳۰ ثانیه طول می‌کشد، بسته به سرعت اینترنت و کیفیت دوربین کاربر. این فرآیند سریع و بدون دردسر طراحی شده است.",
      answerEN:
        "Typically, it takes 10 to 30 seconds depending on internet speed and camera quality. The process is designed to be fast and seamless.",
    },
    {
      questionFA: "چه کسب‌وکارهایی می‌توانند از خدمات شما استفاده کنند؟",
      questionEN: "Which businesses can use your services?",
      answerFA:
        "فین‌تک‌ها، صرافی‌ها و پلتفرم‌های رمزارز، بانک‌ها، مؤسسات مالی، پلتفرم‌های وام‌دهی، بازارهای آنلاین، خدمات رزرو، بیمه و کارگزاری می‌توانند از خدمات ما بهره‌مند شوند.",
      answerEN:
        "Fintechs, cryptocurrency exchanges, banks, financial institutions, lending platforms, online marketplaces, booking services, insurance, and brokerage firms can leverage our services.",
    },
    {
      questionFA: "آیا سرویس شما API دارد؟",
      questionEN: "Do you offer an API?",
      answerFA:
        "بله، تمام سرویس‌ها شامل API کامل Restful هستند و سند جامع برای استفاده توسعه‌دهندگان ارائه می‌شود.",
      answerEN:
        "Yes, all services come with a complete Restful API and comprehensive documentation for developers.",
    },
    {
      questionFA: "اگر پاسخ سوال خود را پیدا نکردم چه کنم؟",
      questionEN: "What if I cannot find the answer to my question?",
      answerFA:
        "اگر پاسخ سوال خود را پیدا نکردید، می‌توانید با تیم پشتیبانی ما تماس بگیرید. ما آماده پاسخگویی سریع و کامل به تمامی سوالات شما هستیم.",
      answerEN:
        "If you cannot find your answer, you can contact our support team. We are ready to provide quick and thorough assistance for any inquiries.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <Navbar/>
    <Section spacing="lg" className="min-h-screen" dir={dir}>
      <Container size="lg" className="flex flex-col gap-8">
        {/* Header */}
        <Typography variant="h1" className="font-bold text-center text-[color:var(--brand-azure)]">
          {isFA ? "سوالات متداول" : "Frequently Asked Questions"}
        </Typography>
        <Typography variant="body-lg" className="text-center text-[color:var(--text-secondary)]">
          {isFA
           ? "در این بخش پاسخ دقیق و کامل به مهم‌ترین سوالات شما درباره سرویس‌های ما ارائه شده است."
            : "Find detailed and comprehensive answers to the most important questions about our services."}
        </Typography>

        {/* FAQ Items */}
        <div className="flex flex-col gap-4">
          {faqs.map((item, i) => (
            <Card
              key={i}
              variant="filled"
              className="p-4 cursor-pointer transition-all hover:shadow-[var(--elevation-2)]"
              onClick={() => toggleFAQ(i)}
            >
              <div className="flex justify-between items-center">
                <Typography variant="body-lg" className="font-semibold">
                  {isFA ? item.questionFA : item.questionEN}
                </Typography>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-[color:var(--brand-azure)]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[color:var(--brand-azure)]" />
                )}
              </div>
              {openIndex === i && (
                <Typography variant="body-lg" className="mt-2 text-[color:var(--text-secondary)]">
                  {isFA ? item.answerFA : item.answerEN}
                </Typography>
              )}
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <Card variant="filled" className="mt-12 p-6 text-center">
          <Typography variant="h5" className="mb-3">
            {isFA ? "جواب سوال خود را پیدا نکردید؟" : "Can't find the answer to your question?"}
          </Typography>
          <Typography variant="body-lg" className="mb-4">
            {isFA
              ? "می‌توانید با تیم پشتیبانی ما تماس بگیرید و سوال خود را مطرح کنید."
              : "You can contact our support team for assistance."}
          </Typography>
          <Button
            variant="primary"
            size="lg"
            className="rounded-full px-10"
            onClick={() => router.push("/contact-us")}
          >
            {isFA ? "تماس با ما" : "Contact Us"}
          </Button>
        </Card>
      </Container>
    </Section>
    </>
  );
}
