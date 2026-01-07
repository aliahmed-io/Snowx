"use client";

import { useCart } from "@/components/providers/CartProvider";
import { Link } from "@/navigation";
import Image from "next/image";
import { ShoppingCart, ArrowRight, Trash2, Plus, Minus } from "lucide-react";
import { useCurrency } from "@/components/providers/CurrencyProvider";

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
    const { formatPrice } = useCurrency();

    if (items.length === 0) {
        return (
            <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center space-y-6 py-20 bg-white/5 rounded-3xl border border-white/10">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingCart className="w-12 h-12 text-gray-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Your cart is empty</h1>
                    <p className="text-gray-400 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-linear-to-r from-snow-accent to-cyan-400 text-gray-900 font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all"
                    >
                        Start Shopping
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Shopping Cart</h1>
                    <p className="text-gray-400 mt-2">Finish your purchase and start enjoying SnowX</p>
                </div>
                <button
                    onClick={clearCart}
                    className="text-gray-500 hover:text-red-400 transition-colors text-sm font-medium"
                >
                    Clear Cart
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                            {/* Image */}
                            <div className="relative w-24 h-24 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                        <ShoppingCart className="w-10 h-10" />
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="flex justify-between gap-4">
                                    <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                                    <span className="text-snow-accent font-bold font-mono">{formatPrice(item.price)}</span>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1.5 border border-white/10">
                                        <button
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            className="p-1 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center text-white font-mono font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="inline-flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="text-sm font-medium">Remove</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[#0a1628] rounded-2xl border border-white/10 p-6 sticky top-24 space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Order Summary</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Subtotal</span>
                                <span className="text-white font-mono">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Shipping</span>
                                <span className="text-green-400 font-medium">FREE</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <p className="text-white font-bold text-xl uppercase tracking-tight">Total</p>
                                    <p className="text-gray-500 text-xs mt-1">VAT included where applicable</p>
                                </div>
                                <span className="text-snow-accent font-black font-mono text-3xl">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/checkout"
                                className="block w-full bg-linear-to-r from-snow-accent to-cyan-400 text-gray-900 font-bold py-4 rounded-xl text-center hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all"
                            >
                                Proceed to Checkout
                            </Link>
                            <Link
                                href="/products"
                                className="block w-full bg-white/5 text-white font-bold py-4 rounded-xl text-center hover:bg-white/10 transition-all border border-white/10"
                            >
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Security Badge */}
                        <div className="pt-4 flex items-center justify-center gap-6 opacity-30">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-white uppercase">Protected</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-white uppercase">Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
