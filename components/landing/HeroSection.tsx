"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import gsap from "gsap";

// Loading component wrapper to use translations
function ThreeDLoader() {
    const t = useTranslations('Common');
    return (
        <div className="w-full h-[500px] flex items-center justify-center">
            <div className="text-snow-accent text-lg animate-pulse">{t('loading3DModel')}</div>
        </div>
    );
}

// Dynamically import ThreeDViewer to avoid SSR issues with Three.js
const ThreeDViewer = dynamic(
    () => import("./ThreeDViewer").then((mod) => ({ default: mod.ThreeDViewer })),
    {
        ssr: false,
        loading: () => <ThreeDLoader />
    }
);

// Snow particle component
function SnowParticle({ style }: { style: React.CSSProperties }) {
    return <div className="snow-particle" style={style} />;
}

// Pre-generate particle data outside component to avoid purity issues
const PARTICLE_DATA = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: (i * 23 + 7) % 100, // Deterministic spread
    delay: (i * 0.3) % 15,
    duration: 15 + (i % 10),
}));

export function HeroSection() {
    const t = useTranslations('Hero');
    const particles = useMemo(() => PARTICLE_DATA, []);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(titleRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, delay: 0.5 }
        )
            .fromTo(descRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8 },
                "-=0.6"
            )
            .fromTo(btnRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5 },
                "-=0.4"
            );
    }, []);

    return (
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 bg-snow-primary ice-texture-hero">

            {/* Snow Particles */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {particles.map((particle) => (
                    <SnowParticle
                        key={particle.id}
                        style={{
                            left: `${particle.left}%`,
                            top: '-5%',
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`,
                        }}
                    />
                ))}
            </div>

            {/* 3D Viewer Container with responsive scaling */}
            <div className="relative w-full max-w-7xl z-20 px-4 md:px-0 flex justify-center">
                <div className="w-full aspect-4/3 md:aspect-video lg:h-[60vh] flex items-center justify-center">
                    <ThreeDViewer />
                </div>
            </div>

            {/* Content */}
            <div ref={contentRef} className="relative z-30 text-center px-4 md:px-6 max-w-5xl mx-auto -mt-8 md:-mt-12">
                {/* Headline */}
                <h1 ref={titleRef} className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 md:mb-6 leading-tight tracking-tight drop-shadow-2xl opacity-0">
                    {t('title')}
                    <br />
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-snow-accent to-snow-accent-light">
                        {t('subtitle')}
                    </span>
                </h1>

                {/* Subtitle */}
                <p ref={descRef} className="text-snow-gray md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-0">
                    {t('description')}
                </p>

                {/* CTA Button */}
                <div ref={btnRef} className="opacity-0">
                    <Link
                        href="/products"
                        className="btn-primary text-lg md:text-xl px-10 py-4 md:px-12 md:py-5 inline-block group mb-[5px]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {t('cta')}
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 7l5 5-5 5" />
                            </svg>
                        </span>
                    </Link>
                </div>
            </div>



        </section>
    );
}
