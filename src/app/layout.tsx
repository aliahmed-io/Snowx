import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LiveChat } from "@/components/ui/LiveChat";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
        <LiveChat />
      </body>
    </html>
  );
}
