import { Link } from "@/navigation";

const products = [
    {
        id: "gpt-plus",
        name: "GPT Plus",
        description: "Experience the power of advanced AI with GPT-4 and exclusive features.",
        image: "/products/gpt.svg",
        originalPrice: 20.00,
        discountedPrice: 7.99,
        discountPercent: 60,
        gradient: "from-emerald-500/20 via-blue-500/10 to-purple-500/20",
        icon: (
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.28 9.82a6.05 6.05 0 0 0-.51-4.91 6.04 6.04 0 0 0-6.51-2.9 6.07 6.07 0 0 0-10.79 2.09 6.05 6.05 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 6.05 6.05 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9 6.07 6.07 0 0 0 10.79-2.09 6.05 6.05 0 0 0 4-2.9 6.05 6.05 0 0 0-.74-7.1zM12 11.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-4.5 2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
        ),
    },
    {
        id: "netflix-premium",
        name: "Netflix Premium",
        description: "4K Ultra HD streaming on all your devices. Unlimited movies and shows.",
        image: "/products/netflix.svg",
        originalPrice: 22.99,
        discountedPrice: 8.99,
        discountPercent: 61,
        gradient: "from-red-600/20 via-red-900/10 to-black/40",
        icon: (
            <svg className="w-16 h-16 text-[#E50914]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z" />
            </svg>
        ),
    },
    {
        id: "spotify-premium",
        name: "Spotify Premium",
        description: "Ad-free music listening with offline mode and high-quality audio.",
        image: "/products/spotify.svg",
        originalPrice: 15.99,
        discountedPrice: 5.49,
        discountPercent: 65,
        gradient: "from-green-500/20 via-green-900/10 to-black/40",
        icon: (
            <svg className="w-16 h-16 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
        ),
    },
];

export function FeaturedSubscriptions() {
    return (
        <section className="py-24 relative bg-snow-primary overflow-hidden">
            {/* Ice Texture Overlay */}
            <div className="absolute inset-0 ice-texture pointer-events-none opacity-40" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <h4 className="text-snow-accent font-bold uppercase tracking-[0.2em] text-sm">
                        Curated Selection
                    </h4>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Featured <span className="text-snow-accent">Subscriptions</span>
                    </h2>
                    <p className="text-snow-gray max-w-2xl mx-auto text-lg">
                        Get premium access to your favorite services at a fraction of the cost.
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="glass-card group rounded-4xl overflow-hidden flex flex-col h-full"
                        >
                            {/* Product Image Area */}
                            <div className={`relative aspect-square w-full bg-linear-to-br ${product.gradient} flex items-center justify-center p-12 transition-transform duration-500 group-hover:scale-105`}>
                                <div className="absolute inset-0 bg-linear-to-t from-snow-primary-light/80 to-transparent opacity-60" />
                                <div className="relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] transform group-hover:rotate-6 transition-transform duration-500">
                                    {product.icon}
                                </div>

                                {/* Floating Discount Badge */}
                                <div className="absolute top-6 right-6">
                                    <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                                        -{product.discountPercent}% OFF
                                    </span>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-8 flex flex-col flex-1 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-snow-accent transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-snow-gray text-sm leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-snow-gray line-through text-xs font-medium">
                                            ${product.originalPrice.toFixed(2)}
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-white">
                                                ${product.discountedPrice.toFixed(2)}
                                            </span>
                                            <span className="text-snow-accent text-xs font-bold uppercase">USD</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/products/${product.id}`}
                                        className="bg-white/5 hover:bg-snow-accent text-white p-4 rounded-2xl transition-all duration-300 border border-white/10 hover:border-snow-accent group/btn"
                                    >
                                        <svg className="w-6 h-6 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Link */}
                <div className="mt-16 text-center">
                    <Link
                        href="/products"
                        className="text-white hover:text-snow-accent font-bold flex items-center justify-center gap-2 group transition-colors"
                    >
                        Browse all subscriptions
                        <div className="w-8 h-[2px] bg-snow-accent scale-x-50 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
