"use client";

import { ContactAccessSection } from "../../components/ContactAccessSection";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <ContactAccessSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
