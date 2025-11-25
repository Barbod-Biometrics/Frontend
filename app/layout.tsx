import type { Metadata } from "next";
import localFont from "next/font/local";

import Providers from "./providers";
import "./globals.css";

const geistSans = localFont({
  src: "../public/fonts/Vazirmatn-VariableFont_wght.ttf",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/Vazirmatn-VariableFont_wght.ttf",
  variable: "--font-geist-mono",
  display: "swap",
});

const vazirLocal = localFont({
  src: "../public/fonts/Vazirmatn-VariableFont_wght.ttf",
  variable: "--font-vazirmatn",
  display: "swap",
});

const orbitronLocal = localFont({
  src: "../public/fonts/Orbitron-VariableFont_wght.ttf",
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Barbod | Biometric Identity Platform",
  description:
    "Biometric verification, liveness, and digital identity orchestration for modern onboarding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vazirLocal.variable} ${orbitronLocal.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
