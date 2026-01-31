"use client";

import Image from "next/image";
import { Link, usePathname, useRouter } from "@/navigation";
import { useCurrency, CurrencyCode } from "@/components/providers/CurrencyProvider";
import { useLocale, useTranslations } from "next-intl";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { UserDropdown } from "./UserDropdown";
import { useRef, useEffect, useState, RefObject, useCallback } from "react";
import { createPortal } from "react-dom";

const currencies: CurrencyCode[] = ["USD", "SAR"];
const languages = [
    { code: "en-US", label: "EN" },
    { code: "ar", label: "AR" }
] as const;

interface NavbarProps {
    user: {
        id: string;
        email?: string | null;
        given_name?: string | null;
        family_name?: string | null;
        picture?: string | null;
    } | null;
    role?: string | null;
}

export function Navbar({ user, role }: NavbarProps) {
    const { currency, setCurrency } = useCurrency();
    const { openCart, itemCount } = useCart();
    const locale = useLocale();
    const t = useTranslations('Navbar');
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Split search state to avoid collision
    const [searchQuery, setSearchQuery] = useState("");
    const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);

    // Active link helper
    const isLinkActive = (href: string) =>
        href === "/"
            ? pathname === "/"
            : pathname === href || pathname?.startsWith(`${href}/`);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu and search on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setIsDesktopSearchOpen(false);
        setIsMobileSearchOpen(false);
        setSearchQuery("");
    }, [pathname]);


    useScrollLock(mobileMenuOpen || isMobileSearchOpen);

    const handleLanguageChange = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
        setMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
        setIsDesktopSearchOpen(false);
    };

    const navLinks = [
        { label: t('home'), href: "/" },
        { label: "All Products", href: "/products" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
    ];

    const closeDesktopSearch = useCallback(() => {
        if (!searchQuery.trim()) {
            setIsDesktopSearchOpen(false);
        }
    }, [searchQuery]);

    useOnClickOutside(searchRef, closeDesktopSearch);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setIsDesktopSearchOpen(false);
            setIsMobileSearchOpen(false);
            return;
        }

        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        setIsDesktopSearchOpen(false);
        setIsMobileSearchOpen(false);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className={`
                    relative flex items-center justify-between h-20 px-4 md:px-6 rounded-3xl transition-all duration-500
                    bg-snow-primary/80 backdrop-blur-xl border border-white/10 shadow-2xl
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
                        <div className="hidden sm:flex shrink-0 items-center gap-4 lg:gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`
                                        text-sm font-bold tracking-wide transition-all duration-300
                                    ${isLinkActive(link.href) ? "text-snow-accent" : "text-white/70 hover:text-white"}
                                    `}
                                >
                                    {link.label}
                                    {isLinkActive(link.href) && (
                                        <div className="h-1 w-full bg-snow-accent rounded-full mt-1 animate-in fade-in zoom-in duration-500" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            {/* Search Bar - Expandable */}
                            <div ref={searchRef} className={`hidden sm:flex items-center transition-all duration-300 ${isDesktopSearchOpen ? "w-48 lg:w-64" : "w-10"}`}>
                                {isDesktopSearchOpen ? (
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
                                            onClick={() => { setSearchQuery(''); setIsDesktopSearchOpen(false); }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer z-10"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setIsDesktopSearchOpen(true)}
                                        className="p-2 bg-white/5 rounded-full hover:bg-snow-accent/20 hover:text-snow-accent transition-colors"
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Cart Button */}
                            <button
                                onClick={openCart}
                                className="hidden sm:block relative p-2 bg-white/5 rounded-full hover:bg-snow-accent/20 hover:text-snow-accent transition-colors group"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-snow-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                            </button>

                            {/* Currency Switcher */}
                            <div className="hidden sm:flex bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1">
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
                            <div className="hidden sm:flex bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1">
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
                            <div className="hidden sm:flex pl-4 border-l border-white/10 items-center gap-4">
                                {user ? (
                                    <UserDropdown user={user} role={role} />
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
                            {/* Mobile Actions */}
                            <div className="flex sm:hidden items-center gap-2">
                                {/* Mobile Search Button */}
                                <button
                                    onClick={() => {
                                        setIsMobileSearchOpen(!isMobileSearchOpen);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="p-2.5 bg-white/5 rounded-full hover:bg-snow-accent/20 hover:text-snow-accent transition-colors"
                                >
                                    <Search className="w-5 h-5" />
                                </button>

                                {/* Mobile Cart Button */}
                                <button
                                    onClick={() => {
                                        openCart();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="relative p-2.5 bg-white/5 rounded-full hover:bg-snow-accent/20 hover:text-snow-accent transition-colors"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-snow-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                            {itemCount}
                                        </span>
                                    )}
                                </button>

                                {/* Hamburger Menu Button */}
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(!mobileMenuOpen);
                                        setIsDesktopSearchOpen(false);
                                        setIsMobileSearchOpen(false);
                                    }}
                                    className="p-2.5 bg-white/5 rounded-full hover:bg-snow-accent/20 hover:text-snow-accent transition-colors"
                                    aria-label="Toggle menu"
                                >
                                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Search Bar - Shows below navbar when search is open */}
                        {isMobileSearchOpen && (
                            <div className="sm:hidden mt-2 px-2 animate-in slide-in-from-top duration-300">
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full bg-snow-primary/90 backdrop-blur-xl border border-white/20 rounded-2xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-snow-accent transition-all"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-snow-accent rounded-xl text-white"
                                    >
                                        <Search className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </nav >


            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <BodyPortal>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 sm:hidden animate-in fade-in duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Mobile Menu Panel */}
                    <div
                        className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-snow-primary border-l border-white/10 z-50 sm:hidden animate-in slide-in-from-right duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-full">
                            {/* Mobile Menu Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <span className="text-lg font-bold text-white">Menu</span>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors z-50 cursor-pointer"
                                    aria-label="Close menu"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Mobile Navigation Links */}
                            <div className="flex-1 overflow-y-auto py-6">
                                <div className="px-5 space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`
                                        block py-3.5 px-4 rounded-xl text-base font-bold transition-all duration-200
                                        ${isLinkActive(link.href)
                                                    ? "bg-snow-accent/20 text-snow-accent"
                                                    : "text-white/70 hover:text-white hover:bg-white/5"
                                                }
                                    `}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="my-6 border-t border-white/10" />

                                {/* Mobile Preferences */}
                                <div className="px-5 space-y-6">
                                    {/* Currency Switcher */}
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Currency</p>
                                        <div className="flex gap-2">
                                            {currencies.map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => setCurrency(c)}
                                                    className={`
                                                flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                                                ${currency === c
                                                            ? "bg-snow-accent text-white shadow-lg shadow-snow-accent/20"
                                                            : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                                                        }
                                            `}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Language Switcher */}
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Language</p>
                                        <div className="flex gap-2">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                    className={`
                                                flex-1 py-2.5 rounded-xl text-sm font-bold uppercase transition-all duration-300
                                                ${locale === lang.code
                                                            ? "bg-white text-black shadow-lg"
                                                            : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                                                        }
                                            `}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Menu Footer - Auth */}
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
                                            {t('signIn')}
                                        </LoginLink>
                                        <RegisterLink className="block w-full py-3 text-center bg-snow-accent text-[#020817] rounded-xl text-sm font-bold hover:bg-snow-accent/90 transition-all shadow-lg shadow-snow-accent/20">
                                            {t('signUp')}
                                        </RegisterLink>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </BodyPortal>
            )}
        </>

    );
}

// --- Shared Components & Hooks (Consolidated) ---

export function BodyPortal({ children }: { children: React.ReactNode }) {
    if (typeof window === 'undefined') return null;
    return createPortal(children, document.body);
}

export function useScrollLock(isLocked: boolean) {
    const originalOverflow = useRef<string | null>(null);

    useEffect(() => {
        if (isLocked) {
            if (originalOverflow.current === null) {
                originalOverflow.current = document.body.style.overflow;
            }
            document.body.style.overflow = 'hidden';
        } else if (originalOverflow.current !== null) {
            document.body.style.overflow = originalOverflow.current;
            originalOverflow.current = null;
        }
    }, [isLocked]);
}

type Event = MouseEvent | TouchEvent;
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null>,
    handler: (event: Event) => void
) => {
    useEffect(() => {
        const listener = (event: Event) => {
            const el = ref?.current;
            if (!el || el.contains((event?.target as Node) || null)) {
                return;
            }

            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};
