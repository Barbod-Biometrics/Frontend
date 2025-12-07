"use client";

import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { ServicePageTemplate } from "../../../components/services/ServicePageTemplate";
import { servicesContent } from "../../../components/services/serviceContent";
import { useLanguage } from "../../../lib/useLanguage";

export default function OCRPage() {
  const { language, dir } = useLanguage();
  const content = servicesContent["ocr"];

  return (
    <div className="min-h-screen bg-[color:var(--md-sys-color-surface)] text-[color:var(--text-primary)]" dir={dir}>
      <Navbar />
      <main>
        <ServicePageTemplate content={content} language={language} dir={dir} />
      </main>
      <Footer />
    </div>
  );
}
