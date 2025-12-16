"use client";

import { useSelector } from "react-redux";

import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Navbar } from "../components/Navbar";
import { SalesConnector } from "../components/SalesConnector";
import { ServicesSection } from "../components/ServicesSection";
import { StatsSection } from "../components/StatsSection";
import { BiometricSignature } from "../components/BiometricSignature";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { useLanguage } from "../lib/useLanguage";
import { RootState } from "../store/store";

export default function Home() {
  const { language, dir } = useLanguage();
  const theme = useSelector((state: RootState) => state.theme.theme);

  return (
    <div className="flex min-h-screen flex-col text-[color:var(--text-primary)] transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        <Hero language={language} theme={theme} dir={dir} />
        <ServicesSection />
        <StatsSection />
        <Section dir={dir}>
          <Container>
            <SalesConnector />
          </Container>
        </Section>
        <BiometricSignature />
      </main>

      <Footer />
    </div>
  );
}
