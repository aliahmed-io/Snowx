"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

// Dynamically import ThreeDViewer to avoid SSR issues with Three.js
const ThreeDViewer = dynamic(
    () => import("./ThreeDViewer").then((mod) => ({ default: mod.ThreeDViewer })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[500px] flex items-center justify-center">
                <div className="text-snow-accent text-lg animate-pulse">Loading 3D Model...</div>
            </div>
        )
    }
);

// Snow particle component
function SnowParticle({ style }: { style: React.CSSProperties }) {
    return <div className="snow-particle" style={style} />;
}

// Pre-generate particle data outside component to avoid purity issues
const PARTICLE_DATA = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: (i * 17 + 5) % 100, // Deterministic spread
    delay: (i * 0.2) % 12,
    duration: 12 + (i % 8),
}));

export function HeroSection() {
    const t = useTranslations('Hero');
    const particles = useMemo(() => PARTICLE_DATA, []);

    return (
        <section className="relative min-h-screen hero-gradient overflow-hidden flex flex-col items-center justify-center pt-20 pb-16">
            {/* Ice Background Overlay */}
            <div className="ice-background-overlay" />

            {/* Snow Particles - CSS animated */}
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

            {/* 3D Viewer with GLB Model */}
            <div className="relative w-full max-w-5xl z-20">
                <ThreeDViewer />
            </div>

            {/* Content */}
            <div className="relative z-30 text-center px-4 max-w-4xl mx-auto -mt-8">
                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                    {t('title')}
                    <br />
                    <span className="text-snow-accent">{t('subtitle')}</span>
                </h1>

                {/* Subtitle */}
                <p className="text-snow-gray text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    {t('description')}
                </p>

                {/* CTA Button */}
                <button className="btn-primary text-lg px-8 py-4">
                    {t('cta')}
                </button>
            </div>
        </section>
    );
}
