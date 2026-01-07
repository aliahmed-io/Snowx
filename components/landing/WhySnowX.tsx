import { useTranslations } from "next-intl";

const features = [
    {
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: "blazingFast",
        description: "blazingFastDesc",
    },
    {
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: "secureReliable",
        description: "secureReliableDesc",
    },
    {
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 12.728l-3.536-3.536M12 3v4m0 10v4m9-9h-4M7 12H3m15.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414" />
            </svg>
        ),
        title: "expertSupport",
        description: "expertSupportDesc",
    },
];

export function WhySnowX() {
    const t = useTranslations('WhySnowX');

    return (
        <section className="py-24 relative bg-snow-primary ice-texture overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        The <span className="text-snow-accent">SnowX</span> Advantage
                    </h2>
                    <p className="text-snow-gray max-w-2xl mx-auto text-lg">
                        We redefine premium access by combining reliability, speed, and unbeatable value.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-snow-accent/30 transition-all duration-500 group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-snow-accent/10 text-snow-accent flex items-center justify-center mb-8 group-hover:bg-snow-accent group-hover:text-white transition-all duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">
                                {t(feature.title)}
                            </h3>
                            <p className="text-snow-gray leading-relaxed">
                                {t(feature.description)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
