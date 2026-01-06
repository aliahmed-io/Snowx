const products = [
    {
        id: 1,
        name: "GPT Plus",
        description: "GPT Plus and Service",
        image: "/products/gpt.svg",
        originalPrice: 19.99,
        discountedPrice: 7.59,
        discountPercent: 62,
        gradient: "from-emerald-400 via-teal-500 to-purple-600",
        icon: (
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 1.6421-.9239a4.4944 4.4944 0 0 1 1.0924.1205v1.9246zm-6.0954-2.8718a4.523 4.523 0 0 1-.3667-3.037l1.6496.9382a4.4173 4.4173 0 0 1 .4002 2.0526l-1.683.0462zm.3287-6.9079a4.4961 4.4961 0 0 1 2.5049-1.6961v1.9103a4.5246 4.5246 0 0 1-1.0304.3762l-1.4745-1.5704zm9.327-.5811l-1.6135.9143a4.542 4.542 0 0 1-.4145-2.0239l1.6783.0461a4.5372 4.5372 0 0 1 .3497 2.0435v-.98zm-.6288 7.236l-1.6688-.9239a4.5126 4.5126 0 0 1-1.0781.3619v1.9246a4.5908 4.5908 0 0 1-2.481-1.6961l5.228-5.7865zM12 7.7214l3.123 1.7617-1.5469 5.8677-3.1517-1.7423v-5.887z" />
            </svg>
        ),
    },
    {
        id: 2,
        name: "Netflix Premium",
        description: "Netflix Premium",
        image: "/products/netflix.svg",
        originalPrice: 22.99,
        discountedPrice: 8.99,
        discountPercent: 62,
        gradient: "from-red-600 to-black",
        icon: (
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z" />
            </svg>
        ),
    },
    {
        id: 3,
        name: "Spotify Duo",
        description: "Spotify Duo and 5 linkey",
        image: "/products/spotify.svg",
        originalPrice: 34.99,
        discountedPrice: 13.99,
        discountPercent: 62,
        gradient: "from-green-400 to-green-600",
        icon: (
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
        ),
    },
];

export function FeaturedSubscriptions() {
    return (
        <section className="py-20 relative bg-snow-primary">
            {/* Background glow behind section */}
            <div className="absolute inset-0 bg-gradient-to-b from-snow-primary to-snow-primary-light z-0 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Featured Subscriptions
                    </h2>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                        >
                            {/* Product Image */}
                            <div className={`aspect-video w-full bg-gradient-to-br ${product.gradient} p-8 flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] mix-blend-overlay" />
                                <div className="relative z-10 drop-shadow-xl">{product.icon}</div>
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-1">
                                    {product.name}
                                </h3>
                                <p className="text-snow-gray text-sm mb-4">
                                    {product.description}
                                </p>

                                {/* Discount Badge */}
                                <div className="mb-3">
                                    <span className="discount-badge">
                                        Save {product.discountPercent}%
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-2xl font-bold text-white">
                                        ${product.discountedPrice.toFixed(2)}
                                    </span>
                                    <span className="text-snow-gray text-sm">USD</span>
                                </div>

                                {/* Add to Cart Button */}
                                <button className="w-full bg-snow-accent hover:bg-snow-accent-light text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-lg shadow-blue-500/20">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
