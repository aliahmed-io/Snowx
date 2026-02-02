"use client";

import Image from "next/image";
import { Link, usePathname, useRouter } from "@/navigation";
import { useCurrency, CurrencyCode } from "@/components/providers/CurrencyProvider";
import { useLocale, useTranslations } from "next-intl";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useState, useEffect } from "react";
import { Portal } from "@/components/ui/portal";
import { useScrollLock } from "@/hooks/useScrollLock";

const currencies: CurrencyCode[] = ["USD", "SAR"];
const languages = [
    { code: "en-US", label: "EN" },
    { code: "ar", label: "AR" },
] as const;

interface MobileNavbarProps {
    user: {
        id: string;
        email?: string | null;
        given_name?: string | null;
        family_name?: string | null;
        picture?: string | null;
    } | null;
}

export function MobileNavbar({ user }: MobileNavbarProps) {
    const { currency, setCurrency } = useCurrency();
    const { openCart, itemCount } = useCart();
    const locale = useLocale();
    const t = useTranslations("Navbar");
    const router = useRouter();
    const pathname = usePathname();

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const isLinkActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname === href || pathname?.startsWith(`${href}/`);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname, setMenuOpen]);

    useScrollLock(menuOpen);

    const handleLanguageChange = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
        setMenuOpen(false);
    };

    const navLinks = [
        { label: t("home"), href: "/" },
        { label: t("products"), href: "/products" },
        { label: t("about"), href: "/about" },
        { label: t("contact"), href: "/contact" },
    ];

    return (
        <>
            {/* Mobile Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}
            >
                <div className="mx-auto px-4">
                    <div className="relative flex items-center justify-between h-14 px-4 rounded-full transition-all duration-500 bg-snow-primary/80 backdrop-blur-xl border border-white/10 shadow-2xl">

                        {/* Logo */}
                        <Link href="/" className="flex items-center shrink-0">
                            <Image
                                src="/snowx2-icon.png"
                                alt="SnowX"
                                width={48}
                                height={48}
                                className="w-10 h-10 object-contain"
                            />
                        </Link>

                        {/* Mobile Actions */}
                        <div className="flex items-center gap-2">
                            {/* Cart */}
                            <button
                                onClick={openCart}
                                className="relative p-2.5 bg-white/5 rounded-full hover:bg-snow-accent/20 transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-snow-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                            </button>

                            {/* Menu Toggle */}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-2.5 bg-white/5 rounded-full hover:bg-snow-accent/20 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {menuOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            {menuOpen && (
                <Portal>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 animate-in fade-in duration-300"
                        onClick={() => setMenuOpen(false)}
                    />

                    {/* Panel */}
                    <div
                        className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-snow-primary border-l border-white/10 z-100 animate-in slide-in-from-right duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <span className="text-lg font-bold text-white">Menu</span>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 overflow-y-auto py-6">
                                <div className="px-5 space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMenuOpen(false)}
                                            className={`block py-3.5 px-4 rounded-xl text-base font-bold transition-all duration-200 ${isLinkActive(link.href)
                                                ? "bg-snow-accent/20 text-snow-accent"
                                                : "text-white/70 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                <div className="my-6 border-t border-white/10" />

                                {/* Preferences */}
                                <div className="px-5 space-y-6">
                                    {/* Currency */}
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider">
                                            Currency
                                        </p>
                                        <div className="flex gap-2">
                                            {currencies.map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => setCurrency(c)}
                                                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${currency === c
                                                        ? "bg-snow-accent text-white shadow-lg shadow-snow-accent/20"
                                                        : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                                                        }`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Language */}
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider">
                                            Language
                                        </p>
                                        <div className="flex gap-2">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold uppercase transition-all duration-300 ${locale === lang.code
                                                        ? "bg-white text-black shadow-lg"
                                                        : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                                                        }`}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer - Auth */}
                            <div className="p-5 border-t border-white/10">
                                {user ? (
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                        {user.picture && (
                                            <Image
                                                src={user.picture}
                                                alt="Profile"
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">
                                                {user.given_name} {user.family_name}
                                            </p>
                                            <p className="text-xs text-white/50 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <LoginLink className="block w-full py-3 text-center text-sm font-bold text-white/70 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                            {t("signIn")}
                                        </LoginLink>
                                        <RegisterLink className="block w-full py-3 text-center bg-snow-accent text-[#020817] rounded-xl text-sm font-bold hover:bg-snow-accent/90 transition-all shadow-lg shadow-snow-accent/20">
                                            {t("signUp")}
                                        </RegisterLink>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
}
