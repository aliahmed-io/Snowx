"use client";

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
        <footer className="bg-snow-primary text-white relative overflow-hidden border-t border-white/5">
            {/* Ice Texture Overlay */}
            <div className="absolute inset-0 ice-texture pointer-events-none opacity-20" />

            <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                    {/* ... other columns ... */}
                    {/* Brand Section */}
                    <div className="md:col-span-4 space-y-6">
                        <Link href="/" className="inline-block transform hover:scale-105 transition-transform">
                            <img
                                src="/snowx2-icon.png"
                                alt="SnowX"
                                className="w-24 h-24 object-contain"
                            />
                        </Link>
                        <p className="text-snow-gray text-base max-w-sm leading-relaxed">
                            {t('copyright')}
                        </p>
                        {/* Social Placeholder */}
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-snow-accent hover:border-snow-accent transition-all cursor-pointer">
                                    <div className="w-4 h-4 bg-current opacity-60" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="md:col-span-2">
                        <h3 className="text-white font-bold text-lg mb-6">{t('shop')}</h3>
                        <ul className="space-y-4">
                            <li><Link href="/products" className="text-snow-gray hover:text-snow-accent transition-colors">{tNav('products')}</Link></li>
                            <li><Link href="/products/gpt-plus" className="text-snow-gray hover:text-snow-accent transition-colors">GPT Plus</Link></li>
                            <li><Link href="/products/netflix-premium" className="text-snow-gray hover:text-snow-accent transition-colors">Netflix Premium</Link></li>
                            <li><Link href="/products/spotify-premium" className="text-snow-gray hover:text-snow-accent transition-colors">Spotify Premium</Link></li>
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
                                    {['USD', 'SAR', 'AED'].map(curr => (
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
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <p className="text-xs text-snow-gray font-medium">{t('poweredBy')}</p>
                            <span className="text-[10px] text-snow-accent font-bold tracking-tighter uppercase">SnowX Infrastructure</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
