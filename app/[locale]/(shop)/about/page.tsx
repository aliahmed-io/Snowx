import {
    Shield,
    Zap,
    Headphones,
    Award,
    Users,
    Globe,
    Lock
} from "lucide-react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "About" });
    return {
        title: `${t("title")} | SnowX`,
        description: t("heroDesc"),
    };
}

export default function AboutPage() {
    const t = useTranslations("About");

    const stats = [
        { value: "50K+", label: t("stats.customers") },
        { value: "99.9%", label: t("stats.uptime") },
        { value: "24/7", label: t("stats.support") },
        { value: "100+", label: t("stats.products") },
    ];

    const values = [
        {
            icon: Shield,
            title: t("values.quality"),
            description: t("values.qualityDesc"),
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: Zap,
            title: t("values.speed"),
            description: t("values.speedDesc"),
            color: "from-yellow-500 to-orange-500"
        },
        {
            icon: Lock,
            title: t("values.trust"),
            description: t("values.trustDesc"),
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: Headphones,
            title: t("values.support"),
            description: t("values.supportDesc"),
            color: "from-blue-500 to-cyan-500"
        },
    ];

    const team = [
        {
            icon: Award,
            title: t("team.excellence"),
            description: t("team.excellenceDesc")
        },
        {
            icon: Users,
            title: t("team.community"),
            description: t("team.communityDesc")
        },
        {
            icon: Globe,
            title: t("team.global"),
            description: t("team.globalDesc")
        },
    ];

    return (
        <div className="pt-20 pb-16 text-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-snow-accent/20 via-transparent to-purple-500/10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-snow-accent/10 via-transparent to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-snow-accent/10 border border-snow-accent/20 text-snow-accent text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-snow-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-snow-accent"></span>
                            </span>
                            {t("trustedBy")}
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-linear-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                            {t("heroTitle")}
                            <span className="block bg-linear-to-r from-snow-accent to-purple-400 bg-clip-text text-transparent">
                                {t("heroHighlight")}
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            {t("heroDesc")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-snow-accent to-purple-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                {t("mission")}
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                {t("missionText1")}
                            </p>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                {t("missionText2")}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            {team.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0a1628] border border-snow-primary/20 rounded-2xl p-6 hover:border-snow-accent/30 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-snow-accent/20 to-purple-500/20 flex items-center justify-center mb-4">
                                        <item.icon className="w-6 h-6 text-snow-accent" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-linear-to-b from-transparent via-snow-accent/5 to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("whyChoose")}</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            {t("whyChooseDesc")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="group relative bg-[#0a1628] border border-snow-primary/20 rounded-2xl p-8 hover:border-snow-accent/30 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <value.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-linear-to-r from-snow-accent/10 via-purple-500/10 to-snow-accent/10 border border-snow-accent/20 rounded-3xl p-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            {t("cta.title")}
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            {t("cta.desc")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-snow-accent text-[#020817] font-bold hover:bg-snow-accent/90 transition-colors"
                            >
                                {t("cta.browse")}
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
                            >
                                {t("cta.contact")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
