"use client";

import Link from "next/link";
import { useState } from "react";

const currencies = ["SAR", "AED", "USD"] as const;
const languages = ["EN", "AR"] as const;

type Currency = (typeof currencies)[number];
type Language = (typeof languages)[number];

export function Navbar() {
    const [activeCurrency, setActiveCurrency] = useState<Currency>("SAR");
    const [activeLanguage, setActiveLanguage] = useState<Language>("EN");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                            Home
                        </Link>
                        <div className="relative group">
                            <button className="text-white/80 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                                Products
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <Link href="/about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                            About
                        </Link>
                        <Link href="/support" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                            Support
                        </Link>
                    </div>

                    {/* Currency & Language Switchers */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Currency Switcher */}
                        <div className="flex items-center bg-white rounded-full p-1 h-8">
                            {currencies.map((currency) => (
                                <button
                                    key={currency}
                                    onClick={() => setActiveCurrency(currency)}
                                    className={`
                    px-3 py-0.5 rounded-full text-xs font-bold transition-all duration-200
                    ${activeCurrency === currency
                                            ? "bg-transparent text-black"
                                            : "bg-transparent text-gray-400 hover:text-gray-600"}
                  `}
                                >
                                    {currency}
                                </button>
                            ))}
                        </div>

                        {/* Language Switcher */}
                        <div className="flex items-center bg-white rounded-full p-1 h-8">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveLanguage(lang)}
                                    className={`
                    px-3 py-0.5 rounded-full text-xs font-bold transition-all duration-200
                    ${activeLanguage === lang
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
                                Home
                            </Link>
                            <Link href="/products" className="text-white hover:text-snow-accent transition-colors">
                                Products
                            </Link>
                            <Link href="/about" className="text-white hover:text-snow-accent transition-colors">
                                About
                            </Link>
                            <Link href="/support" className="text-white hover:text-snow-accent transition-colors">
                                Support
                            </Link>

                            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                                    {currencies.map((currency) => (
                                        <button
                                            key={currency}
                                            onClick={() => setActiveCurrency(currency)}
                                            className={`switcher-btn ${activeCurrency === currency ? "active" : ""}`}
                                        >
                                            {currency}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setActiveLanguage(lang)}
                                            className={`switcher-btn ${activeLanguage === lang ? "active" : ""}`}
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
