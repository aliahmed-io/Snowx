import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LiveChat } from "@/components/ui/LiveChat";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { notFound } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnowX | Premium Digital Subscriptions, Delivered Cold",
  description: "Get discounted access to GPT, Netflix, Spotify, and more. Premium digital subscriptions at frozen prices.",
  keywords: ["digital subscriptions", "GPT", "Netflix", "Spotify", "discount", "premium"],
  openGraph: {
    title: "SnowX | Premium Digital Subscriptions",
    description: "Premium digital subscriptions at frozen prices.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure valid locale
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <LiveChat />
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
