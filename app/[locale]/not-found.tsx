"use client";

import { Link } from "@/navigation";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(14,165,233,0.1)_0%,_transparent_50%)]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-snow-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 text-center space-y-8 max-w-lg mx-auto">
                <div className="relative">
                    <h1 className="text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white tracking-tight drop-shadow-2xl">Page Not Found</span>
                    </div>
                </div>

                <p className="text-gray-400 text-lg">
                    The page you are looking for has been moved, deleted, or possibly never existed.
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="bg-snow-accent text-[#020817] px-6 py-3 rounded-xl font-bold hover:bg-snow-accent/90 transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-snow-accent/20"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-white/5 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center gap-2 border border-snow-primary/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
