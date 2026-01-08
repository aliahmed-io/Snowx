"use client";

import Image from "next/image";
import { Link, usePathname, useRouter } from "@/navigation";
import { useState, useEffect } from "react";
import { useCurrency, CurrencyCode } from "@/components/providers/CurrencyProvider";
import { useLocale, useTranslations } from "next-intl";
import { LoginLink, RegisterLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

const currencies: CurrencyCode[] = ["USD", "SAR", "AED"];
const languages = [
    { code: "en-US", label: "EN" },
    { code: "ar", label: "AR" }
] as const;

interface NavbarProps {
    user: any; // Kinde user type
}

export function Navbar({ user }: NavbarProps) {
    const { currency, setCurrency } = useCurrency();
    const { openCart, itemCount } = useCart();
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

    const navLinks = [
        { label: t('home'), href: "/" },
        { label: "All Products", href: "/products" },
        { label: t('ai'), href: "/ai" },
        { label: t('streaming'), href: "/streaming" },
        { label: t('music'), href: "/music" },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`
                    relative flex items-center justify-between h-20 px-6 rounded-3xl transition-all duration-500
                    ${scrolled ? "bg-snow-primary/80 backdrop-blur-xl border border-white/10 shadow-2xl" : "bg-transparent"}
                `}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <Image
                            src="/snowx2-icon.png"
                            alt="SnowX"
                            width={64}
                            height={64}
                            className="w-16 h-16 object-contain transform group-hover:scale-110 transition-transform duration-500"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
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
                    <div className="flex items-center gap-4">
                        {/* Cart Button */}
                        <button
                            onClick={openCart}
                            className="relative p-2 bg-white/5 rounded-full hover:bg-snow-accent/20 hover:text-snow-accent transition-colors group"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-snow-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </button>

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
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`
                                        px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all duration-300
                                        ${locale === lang.code ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white/70"}
                                    `}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="pl-4 border-l border-white/10 flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link href="/admin" className="relative group">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-snow-accent transition-colors">
                                            {user.picture ? (
                                                <Image
                                                    src={user.picture}
                                                    alt="Profile"
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white/70" />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <LogoutLink className="text-sm font-bold text-white/70 hover:text-white transition-colors">
                                        {t('signOut')}
                                    </LogoutLink>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <LoginLink className="text-sm font-bold text-white/70 hover:text-white transition-colors">
                                        {t('signIn')}
                                    </LoginLink>
                                    <RegisterLink className="px-5 py-2.5 bg-snow-accent text-[#020817] rounded-xl text-sm font-bold hover:bg-snow-accent/90 transition-all shadow-lg shadow-snow-accent/20">
                                        {t('signUp')}
                                    </RegisterLink>
                                </div>
                            )}
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
                            {navLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-6 py-4 rounded-2xl transition-all font-bold ${pathname === item.href
                                        ? "bg-snow-accent text-white shadow-xl shadow-snow-accent/20"
                                        : "text-white/70 hover:bg-white/5"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* Mobile Cart */}
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    openCart();
                                }}
                                className="px-6 py-4 rounded-2xl bg-white/5 text-left font-bold text-white hover:bg-white/10 flex items-center justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Cart
                                </span>
                                {itemCount > 0 && (
                                    <span className="bg-snow-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Auth */}
                            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                                {user ? (
                                    <>
                                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 rounded-2xl bg-white/5 text-center font-bold text-white hover:bg-white/10 flex items-center justify-center gap-3">
                                            {user.picture ? (
                                                <Image
                                                    src={user.picture}
                                                    alt="Profile"
                                                    width={24}
                                                    height={24}
                                                    className="object-cover rounded-full"
                                                />
                                            ) : (
                                                <User className="w-5 h-5" />
                                            )}
                                            {t('admin')}
                                        </Link>
                                        <LogoutLink className="px-6 py-4 rounded-2xl bg-red-500/10 text-center font-bold text-red-400 hover:bg-red-500/20">
                                            {t('signOut')}
                                        </LogoutLink>
                                    </>
                                ) : (
                                    <>
                                        <LoginLink className="px-6 py-4 rounded-2xl bg-white/5 text-center font-bold text-white hover:bg-white/10">
                                            {t('signIn')}
                                        </LoginLink>
                                        <RegisterLink className="px-6 py-4 rounded-2xl bg-snow-accent text-center font-bold text-[#020817] hover:bg-snow-accent/90">
                                            {t('signUp')}
                                        </RegisterLink>
                                    </>
                                )}
                            </div>

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
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${locale === lang.code ? "bg-white text-black shadow-xl" : "text-white/40"}`}
                                            >
                                                {lang.label}
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
