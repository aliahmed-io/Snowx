"use client";

import { PriceDisplay } from "@/components/shop/PriceDisplay";

interface ProductPriceProps {
    price: number;
    comparePrice?: number | null;
}

export function ProductPrice({ price, comparePrice }: ProductPriceProps) {
    const discount = comparePrice
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    return (
        <div className="flex items-center gap-4 mb-6">
            <PriceDisplay amount={price} size="xl" className="text-white" />
            {comparePrice && comparePrice > price && (
                <>
                    <span className="text-xl text-gray-500 line-through">
                        <PriceDisplay amount={comparePrice} size="md" />
                    </span>
                    <span className="bg-linear-to-r from-rose-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        Save {discount}%
                    </span>
                </>
            )}
        </div>
    );
}
