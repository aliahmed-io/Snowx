"use client";

import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();

    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;

    if (items.length === 0) {
        return (
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
                <div className="py-20">
                    <svg className="w-24 h-24 mx-auto text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
                    <p className="text-gray-400 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-snow-accent to-cyan-400 text-gray-900 font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all"
                    >
                        Start Shopping
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                            {/* Image */}
                            <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <Link href={`/products/${item.slug}`} className="text-white font-semibold text-lg hover:text-snow-accent transition-colors">
                                    {item.name}
                                </Link>
                                <p className="text-snow-accent font-bold text-xl mt-1">${item.price.toFixed(2)}</p>

                                {/* Quantity */}
                                <div className="flex items-center gap-3 mt-3">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-white w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Total & Remove */}
                            <div className="text-right">
                                <p className="text-white font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-500 hover:text-red-400 transition-colors mt-2 text-sm flex items-center gap-1 ml-auto"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={clearCart}
                        className="text-gray-500 hover:text-white transition-colors text-sm mt-4"
                    >
                        Clear cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                        <div className="space-y-4 text-gray-400">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (10%)</span>
                                <span className="text-white">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-white">
                                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            {shipping > 0 && (
                                <p className="text-sm text-snow-accent">
                                    Free shipping on orders over $50!
                                </p>
                            )}
                        </div>

                        <div className="border-t border-white/10 mt-6 pt-6">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-white font-semibold">Total</span>
                                <span className="text-3xl font-bold text-white">${total.toFixed(2)}</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full bg-gradient-to-r from-snow-accent to-cyan-400 text-gray-900 font-bold py-4 rounded-xl text-center hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                            {[
                                { icon: "🔒", text: "Secure checkout" },
                                { icon: "⚡", text: "Instant delivery" },
                                { icon: "💳", text: "Powered by Stripe" },
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-500 text-sm">
                                    <span>{badge.icon}</span>
                                    <span>{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
