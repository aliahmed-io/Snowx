"use client";

import { Link, usePathname, useRouter } from "@/navigation";
import { useState } from "react";
import { useCurrency, CurrencyCode } from "@/components/providers/CurrencyProvider";
import { useLocale, useTranslations } from "next-intl";

const currencies: CurrencyCode[] = ["USD", "SAR", "AED"];
const languages = ["en", "ar"] as const;

export function Navbar() {
    const { currency, setCurrency } = useCurrency();
    const locale = useLocale();
    const t = useTranslations('Navbar');
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-snow-primary/95 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        {/* Icy X Crystal Logo */}
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <defs>
                                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#60a5fa" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                            <path d="M4 4L14 14L24 4" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 24L14 14L24 24" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-white font-bold text-xl">Snow</span>
                            <span className="text-snow-accent font-bold text-xl">X</span>
                        </div>
                        <span className="text-snow-gray text-xs uppercase tracking-wider ml-1">Store</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                            {t('home')}
                        </Link>
                        <Link href="/products" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                            {t('products')}
                        </Link>
                        <Link href="/about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                            {t('about')}
                        </Link>
                        <Link href="/support" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                            {t('support')}
                        </Link>
                    </div>

                    {/* Currency & Language Switchers */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Currency Switcher */}
                        <div className="flex items-center bg-white rounded-full p-1 h-8">
                            {currencies.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCurrency(c)}
                                    className={`
                    px-3 py-0.5 rounded-full text-xs font-bold transition-all duration-200
                    ${currency === c
                                            ? "bg-black text-white"
                                            : "bg-transparent text-gray-400 hover:text-gray-600"}
                  `}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        {/* Language Switcher */}
                        <div className="flex items-center bg-white rounded-full p-1 h-8">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageChange(lang)}
                                    className={`
                    px-3 py-0.5 rounded-full text-xs font-bold transition-all duration-200 uppercase
                    ${locale === lang
                                            ? "bg-black text-white"
                                            : "bg-transparent text-gray-400 hover:text-gray-600"}
                  `}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col gap-4">
                            <Link href="/" className="text-white hover:text-snow-accent transition-colors">
                                {t('home')}
                            </Link>
                            <Link href="/products" className="text-white hover:text-snow-accent transition-colors">
                                {t('products')}
                            </Link>
                            <Link href="/about" className="text-white hover:text-snow-accent transition-colors">
                                {t('about')}
                            </Link>
                            <Link href="/support" className="text-white hover:text-snow-accent transition-colors">
                                {t('support')}
                            </Link>


                            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                                    {currencies.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setCurrency(c)}
                                            className={`px-3 py-1 rounded text-xs font-bold text-white ${currency === c ? "bg-snow-accent text-black" : ""}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => handleLanguageChange(lang)}
                                            className={`px-3 py-1 rounded text-xs font-bold text-white uppercase ${locale === lang ? "bg-snow-accent text-black" : ""}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
