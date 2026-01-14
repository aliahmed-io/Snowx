"use client";

import { useCurrency } from "@/components/providers/CurrencyProvider";

interface PriceDisplayProps {
    amount: number;
    comparePrice?: number | null;
    className?: string;
    showCurrency?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-4xl",
};

export function PriceDisplay({
    amount,
    comparePrice,
    className = "",
    showCurrency = true,
    size = "md",
}: PriceDisplayProps) {
    const { formatPrice } = useCurrency();

    const formattedPrice = formatPrice(amount);
    const formattedCompare = comparePrice ? formatPrice(comparePrice) : null;

    return (
        <span className={`font-bold ${sizeClasses[size]} ${className}`}>
            {formattedPrice}
            {formattedCompare && comparePrice && comparePrice > amount && (
                <span className="ml-2 text-gray-500 line-through text-sm font-normal">
                    {formattedCompare}
                </span>
            )}
        </span>
    );
}
