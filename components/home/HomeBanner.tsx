import { useTranslations } from 'next-intl';

export function HomeBanner() {
    const t = useTranslations('Home');

    return (
        <section className="relative w-full aspect-[21/9] md:aspect-[21/9] bg-[#d9d9d9] rounded-3xl overflow-hidden mb-16 flex items-start justify-start p-8 md:p-12">
            <div className="bg-black text-white px-6 py-3 rounded-xl font-bold text-xl md:text-2xl transform -rotate-1 shadow-2xl">
                {t('bannerTitle')}
            </div>
            {/* Background text decoration simulating the image design */}
            <h1 className="absolute inset-0 flex items-center justify-center text-[15vw] md:text-[12vw] font-bold text-black/5 leading-none select-none pointer-events-none whitespace-nowrap">
                imited Drop
            </h1>
        </section>
    );
}
