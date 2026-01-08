import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { Footer } from "@/components/layout/Footer";
import { LiveChat } from "@/components/ui/LiveChat";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { CartSidebar } from "@/components/shop/CartSidebar";
import { notFound } from "next/navigation";
import AppInitializer from "@/components/shared/app-initializer";
import ClientProviders from "@/components/shared/client-providers";
import { db } from "@/lib/db";
import { ClientSetting } from "@/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Navbar } from "@/components/layout/Navbar";

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

  // Fetch settings from DB (or use default if none exist yet)
  let setting: ClientSetting | null = null;

  try {
    const systemSetting = await db.systemSetting.findUnique({
      where: { key: 'client-settings' }
    });

    if (systemSetting && systemSetting.value) {
      setting = JSON.parse(systemSetting.value) as ClientSetting;
    }
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    // setting remains null, triggering fallback below
  }
  if (!setting) {
    // Fallback to minimal setting if DB is empty or during first run
    setting = {
      common: { pageSize: 9, isMaintenanceMode: false, freeShippingMinPrice: 0, defaultTheme: "light", defaultColor: "gold" },
      site: { name: "SnowX", slogan: "Premium Subscriptions", logo: "/snowx2-icon.png", url: "", description: "", keywords: "", email: "", phone: "", author: "", copyright: "", address: "" },
      availableLanguages: [{ code: 'en-US', name: 'English' }, { code: 'ar', name: 'Arabic' }],
      defaultLanguage: 'en-US',
      availableCurrencies: [{ name: 'USD', code: 'USD', symbol: '$', convertRate: 1 }],
      defaultCurrency: 'USD',
      availablePaymentMethods: [{ name: 'Stripe', commission: 0 }],
      defaultPaymentMethod: 'Stripe',
      availableDeliveryDates: [],
      defaultDeliveryDate: '',
      carousels: [],
      currency: 'USD'
    };
  } else {
    setting.currency = setting.defaultCurrency;
  }

  const messages = await getMessages();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

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
                  <Navbar user={user} />
                  <CartSidebar />
                  <main className="min-h-screen">{children}</main>
                  <Footer />
                  <LiveChat />
                </CartProvider>
              </CurrencyProvider>
            </NextIntlClientProvider>
          </ClientProviders>
        </AppInitializer>
      </body>
    </html>
  );
}
