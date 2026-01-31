import { useTranslations } from "next-intl";

const steps = [
    {
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
        title: "selectPlan",
        description: "selectPlanDesc",
    },
    {
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: "securePayment",
        description: "securePaymentDesc",
    },
    {
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: "instantDelivery",
        description: "instantDeliveryDesc",
    },
];

export function HowItWorks() {
    const t = useTranslations('HowItWorks');

    return (
        <section className="relative py-20 z-10 mt-2">
            {/* Skewed Background & Texture */}
            <div className="absolute inset-0 bg-snow-primary-light ice-texture-frost transform -skew-y-3 origin-top-left h-full w-full -z-10 scale-110" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-20 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-white">
                        Simple <span className="text-snow-accent block md:inline">& Seamless</span>
                    </h2>
                    <p className="text-snow-gray max-w-2xl mx-auto text-lg">
                        Get up and running with your premium subscriptions in three easy steps.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative"
                        >
                            {/* Connector Line (Desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-12 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-[2px] bg-linear-to-r from-snow-accent/40 to-transparent" />
                            )}

                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-3xl bg-snow-primary text-snow-accent flex items-center justify-center mb-8 border border-white/5 shadow-2xl group-hover:scale-110 group-hover:text-white group-hover:bg-snow-accent transition-all duration-500">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    {t(step.title)}
                                </h3>
                                <p className="text-snow-gray leading-relaxed">
                                    {t(step.description)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
