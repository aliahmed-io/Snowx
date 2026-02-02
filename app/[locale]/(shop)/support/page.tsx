import { Metadata } from 'next';
import { Mail, MessageCircle, FileText } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Support" });
    return {
        title: `${t("title")} | SnowX`,
        description: t("subtitle"),
    };
}

export default function SupportPage() {
    const t = useTranslations('Support');

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {t('title')}
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Link href="/faq" className="group">
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-2xl p-8 hover:bg-[#0f1f38] transition-all h-full">
                        <div className="w-12 h-12 bg-snow-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-snow-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{t('cards.faq.title')}</h3>
                        <p className="text-gray-400">
                            {t('cards.faq.desc')}
                        </p>
                    </div>
                </Link>

                <Link href="/contact" className="group">
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-2xl p-8 hover:bg-[#0f1f38] transition-all h-full">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <MessageCircle className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{t('cards.report.title')}</h3>
                        <p className="text-gray-400">
                            {t('cards.report.desc')}
                        </p>
                    </div>
                </Link>

                <Link href="/contact" className="group">
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-2xl p-8 hover:bg-[#0f1f38] transition-all h-full">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{t('cards.contact.title')}</h3>
                        <p className="text-gray-400">
                            {t('cards.contact.desc')}
                        </p>
                    </div>
                </Link>
            </div>

            {/* Support Hours Section */}
            <div className="bg-[#0f172a] rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                    {t('hours.title')}
                </h2>
                <p className="text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                    {t('hours.desc')}
                </p>

                <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-snow-accent text-[#020817] font-bold hover:bg-snow-accent/90 transition-all shadow-lg shadow-snow-accent/20"
                >
                    {t('hours.cta')}
                </Link>
            </div>
        </div>
    );
}
