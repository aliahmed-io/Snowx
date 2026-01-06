import Link from "next/link";

const footerLinks = {
    main: [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: "About", href: "/about" },
        { label: "Support", href: "/support" },
        { label: "Contact", href: "/contact" },
    ],
};

export function Footer() {
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
                            © 2024 - Premium Digital Subscriptions, Delivered.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Navigation</h3>
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
                        <h3 className="font-semibold mb-4">Company</h3>
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
                        <h3 className="font-semibold mb-4">Preferences</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-snow-gray text-xs mb-1">Currency</p>
                                <div className="flex gap-2">
                                    <span className="bg-snow-accent text-white text-xs px-2 py-1 rounded">SAR</span>
                                    <span className="bg-white/10 text-snow-gray text-xs px-2 py-1 rounded">AED</span>
                                    <span className="bg-white/10 text-snow-gray text-xs px-2 py-1 rounded">USD</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-snow-gray text-xs mb-1">Language</p>
                                <div className="flex gap-2">
                                    <span className="bg-snow-accent text-white text-xs px-2 py-1 rounded">EN</span>
                                    <span className="bg-white/10 text-snow-gray text-xs px-2 py-1 rounded">AR</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-8 pt-8 text-center">
                    <p className="text-snow-gray text-xs">
                        Powered by Built-in CMS
                    </p>
                </div>
            </div>
        </footer>
    );
}
