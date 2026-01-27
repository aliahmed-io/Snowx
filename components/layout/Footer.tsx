"use client";

import Image from "next/image";
import { Link, usePathname, useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations('Footer');
    const tNav = useTranslations('Navbar');
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const handleLanguageChange = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
    };

    return (
        <footer className="bg-snow-primary text-white relative overflow-hidden border-t border-white/5 ice-texture-footer">

            <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                    {/* ... other columns ... */}
                    {/* Brand Section */}
                    <div className="md:col-span-4 space-y-6">
                        <Link href="/" className="inline-block transform hover:scale-105 transition-transform">
                            <Image
                                src="/snowx2-icon.png"
                                alt="SnowX"
                                width={96}
                                height={96}
                                className="w-24 h-24 object-contain"
                            />
                        </Link>
                        <p className="text-snow-gray text-base max-w-sm leading-relaxed">
                            {t('copyright')}
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {/* TikTok */}
                            <a
                                href="https://www.tiktok.com/@snowx__store"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-snow-accent hover:border-snow-accent transition-all"
                                aria-label="TikTok"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/snowx__store"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-snow-accent hover:border-snow-accent transition-all"
                                aria-label="Instagram"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            {/* Email */}
                            <a
                                href="mailto:SnowXsup@gmail.com"
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-snow-accent hover:border-snow-accent transition-all"
                                aria-label="Email"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="md:col-span-2">
                        <h3 className="text-white font-bold text-lg mb-6">{t('shop')}</h3>
                        <ul className="space-y-4">
                            <li><Link href="/products" className="text-snow-gray hover:text-snow-accent transition-colors">{tNav('products')}</Link></li>
                            <li><Link href="/products" className="text-snow-gray hover:text-snow-accent transition-colors">GPT Plus</Link></li>
                            <li><Link href="/products" className="text-snow-gray hover:text-snow-accent transition-colors">Netflix Premium</Link></li>
                            <li><Link href="/products" className="text-snow-gray hover:text-snow-accent transition-colors">Spotify Premium</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="md:col-span-2">
                        <h3 className="text-white font-bold text-lg mb-6">{t('company')}</h3>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-snow-gray hover:text-snow-accent transition-colors">{tNav('about')}</Link></li>
                            <li><Link href="/support" className="text-snow-gray hover:text-snow-accent transition-colors">{tNav('support')}</Link></li>
                            <li><Link href="/faq" className="text-snow-gray hover:text-snow-accent transition-colors">{tNav('faq')}</Link></li>
                            <li><Link href="/contact" className="text-snow-gray hover:text-snow-accent transition-colors">{t('contact')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="md:col-span-2">
                        <h3 className="text-white font-bold text-lg mb-6">{t('legal')}</h3>
                        <ul className="space-y-4">
                            <li><Link href="/legal/privacy" className="text-snow-gray hover:text-snow-accent transition-colors">{t('privacy')}</Link></li>
                            <li><Link href="/legal/terms" className="text-snow-gray hover:text-snow-accent transition-colors">{t('terms')}</Link></li>
                            <li><Link href="/legal/refund" className="text-snow-gray hover:text-snow-accent transition-colors">{t('refund')}</Link></li>
                        </ul>
                    </div>

                    {/* Preferences */}
                    <div className="md:col-span-2">
                        <h3 className="text-white font-bold text-lg mb-6">{t('preferences')}</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-snow-gray text-xs uppercase tracking-widest">{t('currency')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {['USD', 'SAR'].map(curr => (
                                        <span key={curr} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-snow-gray hover:text-white hover:border-white/20 transition-all cursor-pointer">{curr}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-snow-gray text-xs uppercase tracking-widest">{t('language')}</p>
                                <div className="flex gap-2">
                                    {['en', 'ar'].map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => handleLanguageChange(lang)}
                                            className={`px-3 py-1 border rounded-lg text-xs font-bold transition-all uppercase ${locale === lang
                                                ? "bg-snow-accent border-snow-accent text-white"
                                                : "bg-white/5 border-white/10 text-snow-gray hover:text-white hover:border-white/20"
                                                }`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-snow-gray text-sm">
                        {t('copyright')}
                    </p>
                    <div className="flex items-center gap-4">
                        {/* Visa */}
                        <div className="h-9 w-14 bg-white/5 border border-white/10 rounded flex items-center justify-center hover:border-snow-accent/50 transition-colors duration-300">
                            <Image
                                src="/visa.svg"
                                alt="Visa"
                                width={32}
                                height={32}
                                className="w-10 h-auto opacity-80"
                            />
                        </div>
                        {/* Mastercard */}
                        <div className="h-9 w-14 bg-white/5 border border-white/10 rounded flex items-center justify-center hover:border-snow-accent/50 transition-colors duration-300">
                            <Image
                                src="/Mastercard.svg"
                                alt="Mastercard"
                                width={32}
                                height={32}
                                className="w-8 h-auto opacity-80"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
