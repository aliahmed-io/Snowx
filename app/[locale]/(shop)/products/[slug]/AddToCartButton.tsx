"use client";

import { useCart } from "@/components/providers/CartProvider";
import { useState } from "react";

interface AddToCartButtonProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        image: string;
    };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="space-y-4">
            {/* Quantity selector */}
            <div className="flex items-center gap-4">
                <span className="text-gray-400">Quantity:</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                        -
                    </button>
                    <span className="text-white w-12 text-center text-lg font-medium">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Add to cart button */}
            <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${added
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-snow-accent to-cyan-400 text-gray-900 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]"
                    }`}
            >
                {added ? (
                    <>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart!
                    </>
                ) : (
                    <>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart - ${(product.price * quantity).toFixed(2)}
                    </>
                )}
            </button>
        </div>
    );
}
