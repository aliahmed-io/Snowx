"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";

interface ProductCardProps {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    image: string;
    category: string;
    avgRating: number;
    reviewCount: number;
}

export function ProductCard({
    id,
    name,
    slug,
    price,
    comparePrice,
    image,
    category,
    avgRating,
    reviewCount,
}: ProductCardProps) {
    const { addItem } = useCart();
    const { formatPrice } = useCurrency();

    const discount = comparePrice
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({ id, name, slug, price, image });
    };

    return (
        <Link href={`/products/${slug}`} className="group block">
            <div className="relative bg-gray-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-snow-accent/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]">
                {/* Discount badge */}
                {discount > 0 && (
                    <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{discount}%
                    </div>
                )}

                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Quick add button */}
                    <button
                        onClick={handleAddToCart}
                        className="absolute bottom-3 right-3 bg-snow-accent text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-snow-accent text-xs font-medium uppercase tracking-wider mb-1">
                        {category}
                    </p>
                    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1 group-hover:text-snow-accent transition-colors">
                        {name}
                    </h3>

                    {/* Rating */}
                    {reviewCount > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-600"}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-gray-400 text-sm">({reviewCount})</span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{formatPrice(price)}</span>
                        {comparePrice && (
                            <span className="text-gray-500 line-through text-sm">{formatPrice(comparePrice)}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
