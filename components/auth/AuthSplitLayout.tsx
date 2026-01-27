"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AuthSplitLayoutProps {
    children: React.ReactNode;
    image?: string;
    quote?: string;
    author?: string;
}

export function AuthSplitLayout({ children, image, quote, author }: AuthSplitLayoutProps) {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden bg-[#020617]">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <Image
                        src="/ice_texture_premium_dark_1767772924654.png" // Using the premium texture found in globals.css
                        alt="Background"
                        fill
                        className="object-cover mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#020617]/90" />
                </div>

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <Image
                        src="/snowx2-icon.png"
                        alt="SnowX"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                    <span className="text-2xl font-bold text-white tracking-wide font-outfit">
                        Snow<span className="text-snow-accent">X</span>
                    </span>
                </div>

                {/* Quote / Marketing Text */}
                <div className="relative z-10 max-w-lg">
                    <blockquote className="space-y-4">
                        <p className="text-2xl font-medium text-gray-200 leading-relaxed">
                            "{quote || "Experience the premium standard of digital subscriptions. Secure, fast, and reliable access to your favorite services."}"
                        </p>
                        <footer className="text-sm font-medium text-snow-accent">
                            {author || "The SnowX Team"}
                        </footer>
                    </blockquote>
                </div>

                {/* Snow Particles (CSS Animation) */}
                <div className="snow-particle" style={{ left: "10%", animationDelay: "0s" }} />
                <div className="snow-particle" style={{ left: "30%", animationDelay: "2s" }} />
                <div className="snow-particle" style={{ left: "70%", animationDelay: "4s" }} />
                <div className="snow-particle" style={{ left: "90%", animationDelay: "1s" }} />
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-[#020817] relative">
                {/* Mobile Background Texture (Subtle) */}
                <div className="absolute inset-0 z-0 opacity-20 md:hidden pointer-events-none">
                    <Image
                        src="/ice-texture-2.png"
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="w-full max-w-sm relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
