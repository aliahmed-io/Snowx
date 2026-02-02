"use client";

import Image from "next/image";
import { Link, usePathname, useRouter } from "@/navigation";
import { useCurrency, CurrencyCode } from "@/components/providers/CurrencyProvider";
import { useLocale, useTranslations } from "next-intl";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ShoppingCart, Search, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { UserDropdown } from "./UserDropdown";
import { useRef, useEffect, useState, useCallback } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

const currencies: CurrencyCode[] = ["USD", "SAR"];
const languages = [
    { code: "en-US", label: "EN" },
    { code: "ar", label: "AR" },
] as const;

interface DesktopNavbarProps {
    user: {
        id: string;
        email?: string | null;
        given_name?: string | null;
        family_name?: string | null;
        picture?: string | null;
    } | null;
    role?: string | null;
}

export function DesktopNavbar({ user, role }: DesktopNavbarProps) {
    const { currency, setCurrency } = useCurrency();
    const { openCart, itemCount } = useCart();
    const locale = useLocale();
    const t = useTranslations("Navbar");
    const router = useRouter();
    const pathname = usePathname();

    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef<HTMLDivElement>(null);

    const isLinkActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname === href || pathname?.startsWith(`${href}/`);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setSearchOpen(false);
        setSearchQuery("");
    }, [pathname]);

    const handleLanguageChange = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
    };

    const closeSearch = useCallback(() => {
        if (!searchQuery.trim()) {
            setSearchOpen(false);
        }
    }, [searchQuery]);

    useClickOutside(searchRef, closeSearch);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchOpen(false);
            return;
        }
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        setSearchOpen(false);
    };

    const navLinks = [
        { label: t("home"), href: "/" },
        { label: "All Products", href: "/products" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="relative flex items-center justify-between h-20 px-4 md:px-6 rounded-3xl transition-all duration-500 bg-snow-primary/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group shrink-0">
                        <Image
                            src="/snowx2-icon.png"
                            alt="SnowX"
                            width={64}
                            height={64}
                            className="w-14 h-14 md:w-16 md:h-16 object-contain transform group-hover:scale-110 transition-transform duration-500"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6 lg:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-bold tracking-wide transition-all duration-300 ${isLinkActive(link.href)
                                    ? "text-snow-accent"
                                    : "text-white/70 hover:text-white"
                                    }`}
                            >
                                {link.label}
                                {isLinkActive(link.href) && (
                                    <div className="h-1 w-full bg-snow-accent rounded-full mt-1" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div
                            ref={searchRef}
                            className={`flex items-center transition-all duration-300 ${searchOpen ? "w-48 lg:w-56" : "w-10"}`}
                        >
                            {searchOpen ? (
                                <form onSubmit={handleSearch} className="w-full relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full bg-white/10 border border-white/20 rounded-full pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-snow-accent transition-all"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSearchOpen(false);
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2 bg-white/5 rounded-full hover:bg-snow-accent/20 hover:text-snow-accent transition-colors"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Cart */}
                        <button
                            onClick={openCart}
                            className="relative p-2 bg-white/5 rounded-full hover:bg-snow-accent/20 hover:text-snow-accent transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-snow-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {/* Currency */}
                        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                            {currencies.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCurrency(c)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${currency === c
                                        ? "bg-snow-accent text-white"
                                        : "text-white/40 hover:text-white/70"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        {/* Language */}
                        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all duration-300 ${locale === lang.code
                                        ? "bg-white text-black"
                                        : "text-white/40 hover:text-white/70"
                                        }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>

                        {/* Auth */}
                        <div className="pl-3 border-l border-white/10 flex items-center gap-3">
                            {user ? (
                                <UserDropdown user={user} role={role} />
                            ) : (
                                <>
                                    <LoginLink className="text-sm font-bold text-white/70 hover:text-white transition-colors">
                                        {t("signIn")}
                                    </LoginLink>
                                    <RegisterLink className="px-4 py-2 bg-snow-accent text-[#020817] rounded-xl text-sm font-bold hover:bg-snow-accent/90 transition-all">
                                        {t("signUp")}
                                    </RegisterLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
