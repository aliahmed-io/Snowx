"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { useCart } from "@/components/providers/CartProvider";
import { toast } from "sonner";


interface ProductCardProps {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    image: string;
    category: string;
}

export function ProductCard({
    id,
    name,
    slug,
    price,
    comparePrice,
    image,
    category,
}: ProductCardProps) {
    const t = useTranslations('Shop');
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id,
            name,
            slug,
            price,
            image,
        });
        toast.success(t('addedToCart'), {
            description: name,
        });
    };

    const discountPercentage = comparePrice
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    return (
        <Link
            href={`/products/${slug}`}
            className="group block h-full"
        >
            <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                {/* Image Section */}
                <div className="relative aspect-square w-full bg-black/20 p-6 flex items-center justify-center overflow-hidden">
                    {/* Hover Effect: Scale Image */}
                    <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                        {image ? (
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                        ) : (
                            <div className="w-full h-full bg-white/5 rounded-xl animate-pulse" />
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-1">
                    {/* Brand/Category */}
                    <p className="text-xs font-medium text-gray-400 mb-1">{category}</p>

                    {/* Title */}
                    <h3 className="font-bold text-white text-lg leading-tight mb-1 line-clamp-1 group-hover:text-snow-accent transition-colors">
                        {name}
                    </h3>

                    {/* Subtitle/Description (Mock for visual match) */}
                    <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                        Premium Subscription
                    </p>

                    {/* Savings Badge & Price */}
                    <div className="mt-auto">
                        {discountPercentage > 0 && (
                            <p className="text-emerald-400 text-xs font-bold mb-1">
                                Save {discountPercentage}%
                            </p>
                        )}

                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-xl font-bold text-white">
                                ${price.toFixed(2)} <span className="text-xs font-normal text-gray-500">USD</span>
                            </span>
                            {comparePrice && comparePrice > price && (
                                <span className="text-sm text-gray-500 line-through">
                                    ${comparePrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20 hover:shadow-blue-600/40 active:scale-95 duration-200"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
