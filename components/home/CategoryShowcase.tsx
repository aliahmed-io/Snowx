import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

export function CategoryShowcase() {
    const t = useTranslations('Home');
    const tShop = useTranslations('cart'); // Reusing 'Shop Now'

    return (
        <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{t('shopByCategory')}</h2>
                <Link href="/products" className="text-snow-accent text-sm font-medium hover:underline flex items-center gap-1">
                    {t('browseAll')} <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
                {/* Large Card - All Products / Men (using existing assets for demo) */}
                <Link href="/products" className="group relative w-full h-full min-h-[300px] md:min-h-full rounded-3xl overflow-hidden bg-[#7a7a7a]">
                    {/* Placeholder Background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    {/* Content */}
                    <div className="absolute bottom-8 left-8 z-20">
                        <h3 className="text-2xl font-bold text-white mb-2">All Products</h3>
                        <span className="text-sm font-medium text-white/80 group-hover:text-white group-hover:underline transition-all">
                            {tShop('shopNow')}
                        </span>
                    </div>
                </Link>

                {/* Right Column - 3 stacked/grid items? Design shows 2 items on right. Let's match the reference image: 1 Big Left, 2 Right Stacked */}
                <div className="flex flex-col gap-6 h-full">
                    {/* Top Right */}
                    <Link href="/products?category=ai" className="group relative flex-1 min-h-[250px] rounded-3xl overflow-hidden bg-[#525252]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <div className="absolute bottom-6 left-6 z-20">
                            <h3 className="text-xl font-bold text-white mb-1">AI Models</h3>
                            <span className="text-xs font-medium text-white/80 group-hover:text-white group-hover:underline transition-all">
                                {tShop('shopNow')}
                            </span>
                        </div>
                    </Link>

                    {/* Bottom Right */}
                    <Link href="/products?category=streaming" className="group relative flex-1 min-h-[250px] rounded-3xl overflow-hidden bg-[#8f7e75]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <div className="absolute bottom-6 left-6 z-20">
                            <h3 className="text-xl font-bold text-white mb-1">Streaming</h3>
                            <span className="text-xs font-medium text-white/80 group-hover:text-white group-hover:underline transition-all">
                                {tShop('shopNow')}
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
