import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { notFound } from "next/navigation";
import AppInitializer from "@/components/shared/app-initializer";
import ClientProviders from "@/components/shared/client-providers";
import { ClientSetting } from "@/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "SnowX | Premium Digital Subscriptions, Delivered Cold",
  description: "Get discounted access to GPT, Netflix, Spotify, and more. Premium digital subscriptions at frozen prices.",
  keywords: ["digital subscriptions", "GPT", "Netflix", "Spotify", "discount", "premium"],
  openGraph: {
    title: "SnowX | Premium Digital Subscriptions",
    description: "Premium digital subscriptions at frozen prices.",
    type: "website",
  },
};

import { getCachedSettings } from "@/lib/cache";

export async function generateStaticParams() {
  return [
    { locale: 'en-US' },
    { locale: 'ar' }
  ];
}

import { MaintenancePage } from "@/components/shared/MaintenancePage";
import { defaultSettings } from "@/lib/settings";

// ... existing imports

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!['en-US', 'ar'].includes(locale)) {
    notFound();
  }

  // Fetch settings from DB (cached)
  let setting: ClientSetting | null = null;

  try {
    const systemSetting = await getCachedSettings();

    if (systemSetting && systemSetting.value) {
      setting = JSON.parse(systemSetting.value) as ClientSetting;
    }
  } catch (error) {
    console.error("Failed to fetch settings:", error);
  }

  if (!setting) {
    setting = defaultSettings;
  } else {
    // Ensure critical defaults exist if JSON is partial
    setting = { ...defaultSettings, ...setting };
    setting.currency = setting.defaultCurrency || 'USD';
  }

  const messages = await getMessages();

  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  // Determine user role from environment variable
  let userRole: string | null = null;
  if (kindeUser && kindeUser.email) {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
    if (adminEmails.includes(kindeUser.email)) {
      userRole = 'ADMIN';
    }
  }

  // ENFORCE MAINTENANCE MODE
  // If maintenance is on AND user is NOT an admin -> Show Maintenance Page
  if (setting.common.isMaintenanceMode && userRole !== 'ADMIN') {
    return (
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <body className={`${outfit.variable} ${plusJakarta.variable} font-jakarta antialiased`}>
          <MaintenancePage />
        </body>
      </html>
    );
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${plusJakarta.variable} font-jakarta antialiased`}
        suppressHydrationWarning
      >
        <AppInitializer setting={setting}>
          <ClientProviders>
            <NextIntlClientProvider messages={messages}>
              <CurrencyProvider>
                <CartProvider>
                  <ConditionalLayout user={kindeUser} role={userRole}>
                    {children}
                  </ConditionalLayout>
                </CartProvider>
              </CurrencyProvider>
            </NextIntlClientProvider>
          </ClientProviders>
        </AppInitializer>
      </body>
    </html>
  );
}
