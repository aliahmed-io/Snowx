import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations('Footer');
    const tNav = useTranslations('Navbar');

    const footerLinks = {
        main: [
            { label: tNav('home'), href: "/" },
            { label: tNav('products'), href: "/products" },
            { label: tNav('about'), href: "/about" },
            { label: tNav('support'), href: "/support" },
            { label: t('contact'), href: "/contact" },
        ],
    };

    return (
        <footer className="bg-snow-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="text-snow-accent font-bold text-2xl">
                                <span className="text-snow-accent">✕</span>
                                <span className="text-white ml-1">Snow</span>
                                <span className="text-snow-accent">X</span>
                            </div>
                        </Link>
                        <p className="text-snow-gray text-sm">
                            {t('copyright')}
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="font-semibold mb-4">{t('navigation')}</h3>
                        <ul className="space-y-2">
                            {footerLinks.main.slice(0, 2).map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-snow-gray hover:text-white transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">{t('company')}</h3>
                        <ul className="space-y-2">
                            {footerLinks.main.slice(2).map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-snow-gray hover:text-white transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Currency & Language */}
                    <div>
                        <h3 className="font-semibold mb-4">{t('preferences')}</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-snow-gray text-xs mb-1">{t('currency')}</p>
                                <div className="flex gap-2">
                                    <span className="bg-white/10 text-snow-gray text-xs px-2 py-1 rounded">USD</span>
                                    <span className="bg-white/10 text-snow-gray text-xs px-2 py-1 rounded">SAR</span>
                                    <span className="bg-white/10 text-snow-gray text-xs px-2 py-1 rounded">AED</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-snow-gray text-xs mb-1">{t('language')}</p>
                                <div className="flex gap-2">
                                    <span className="bg-white/10 text-snow-gray text-xs px-2 py-1 rounded">EN</span>
                                    <span className="bg-white/10 text-snow-gray text-xs px-2 py-1 rounded">AR</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-8 pt-8 text-center">
                    <p className="text-snow-gray text-xs">
                        {t('poweredBy')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
