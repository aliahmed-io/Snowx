"use client";

import { Link, usePathname, useRouter } from "@/navigation";
import { useState, useEffect } from "react";
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
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLanguageChange = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`
                    relative flex items-center justify-between h-20 px-6 rounded-3xl transition-all duration-500
                    ${scrolled ? "bg-snow-primary/80 backdrop-blur-xl border border-white/10 shadow-2xl" : "bg-transparent"}
                `}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <img
                            src="/snowx2-icon.png"
                            alt="SnowX"
                            className="w-16 h-16 object-contain transform group-hover:scale-110 transition-transform duration-500"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {[
                            { label: t('home'), href: "/" },
                            { label: t('products'), href: "/products" },
                            { label: t('about'), href: "/about" },
                            { label: t('support'), href: "/support" }
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                    text-sm font-bold tracking-wide transition-all duration-300
                                    ${pathname === link.href ? "text-snow-accent" : "text-white/70 hover:text-white"}
                                `}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <div className="h-1 w-full bg-snow-accent rounded-full mt-1 animate-in fade-in zoom-in duration-500" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Currency Switcher */}
                        <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1">
                            {currencies.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCurrency(c)}
                                    className={`
                                        px-3 py-1.5 rounded-xl text-[10px] font-black transition-all duration-300
                                        ${currency === c ? "bg-snow-accent text-white shadow-lg shadow-snow-accent/20" : "text-white/40 hover:text-white/70"}
                                    `}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        {/* Language Switcher */}
                        <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageChange(lang)}
                                    className={`
                                        px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all duration-300
                                        ${locale === lang ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white/70"}
                                    `}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white"
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
                    <div className="md:hidden mt-4 bg-snow-primary/95 backdrop-blur-2xl border border-white/10 rounded-4xl p-6 shadow-2xl animate-in slide-in-from-top-10 duration-500 z-50 overflow-hidden relative">
                        {/* Mobile Background Texture */}
                        <div className="absolute inset-0 ice-texture opacity-20 pointer-events-none" />

                        <div className="flex flex-col gap-3 relative z-10">
                            {[
                                { name: t('home'), href: "/" },
                                { name: t('products'), href: "/products" },
                                { name: t('about'), href: "/about" },
                                { name: t('support'), href: "/support" }
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-6 py-4 rounded-2xl transition-all font-bold ${pathname === item.href
                                        ? "bg-snow-accent text-white shadow-xl shadow-snow-accent/20"
                                        : "text-white/70 hover:bg-white/5"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
                                <div className="space-y-3">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black ml-4">Currency</span>
                                    <div className="flex gap-2 bg-white/5 rounded-2xl p-1.5">
                                        {currencies.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => setCurrency(c)}
                                                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${currency === c ? "bg-snow-accent text-white shadow-xl" : "text-white/40"}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black ml-4">Language</span>
                                    <div className="flex gap-2 bg-white/5 rounded-2xl p-1.5">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => handleLanguageChange(lang)}
                                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${locale === lang ? "bg-white text-black shadow-xl" : "text-white/40"}`}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
