"use client";

import { useCart } from "@/components/providers/CartProvider";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
    const { items, subtotal } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tax = subtotal * 0.1;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;

    const handleCheckout = async () => {
        if (items.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create checkout session");
            }

            // Redirect to Stripe checkout using the URL from the API
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No checkout URL returned");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
                <div className="py-20">
                    <svg className="w-24 h-24 mx-auto text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h1 className="text-3xl font-bold text-white mb-4">Nothing to checkout</h1>
                    <p className="text-gray-400 mb-8">Add some items to your cart first.</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-snow-accent to-cyan-400 text-gray-900 font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Order summary */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden shrink-0 relative">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">{item.name}</p>
                                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}

                        <div className="border-t border-white/10 pt-4 space-y-2">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Tax (10%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-white text-xl font-bold pt-2">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Payment</h2>
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 text-gray-400 mb-4">
                                <svg className="w-6 h-6 text-snow-accent" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 10h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Zm0-3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H3Zm5 6a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H8Z" />
                                </svg>
                                <span>Secure payment powered by Stripe</span>
                            </div>

                            <p className="text-gray-500 text-sm">
                                You will be redirected to Stripe&apos;s secure checkout to complete your payment.
                                We accept all major credit cards.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg p-4 mb-4">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-snow-accent to-cyan-400 text-gray-900 font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Pay ${total.toFixed(2)}
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Trust badges */}
                        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-gray-500 text-xs">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xl">🔒</span>
                                <span>256-bit SSL</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xl">💳</span>
                                <span>PCI Compliant</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xl">✓</span>
                                <span>Money-back</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
