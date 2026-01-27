"use client";

import { useCart, CartItem } from "@/components/providers/CartProvider";
import { Link } from "@/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import {
    ShoppingCart,
    X,
    Plus,
    Minus,
    Trash2
} from "lucide-react";

export function CartSidebar() {
    const { items, removeItem, updateQuantity, subtotal, itemCount, isOpen, closeCart, clearCart } = useCart();
    const t = useTranslations('cart');
    const { formatPrice } = useCurrency();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCart} />

            <div className="relative w-full max-w-md bg-[#020817] h-full shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="w-6 h-6 text-snow-accent" />
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">{t('title')}</h2>
                        <span className="bg-snow-accent/20 text-snow-accent text-xs font-bold px-2 py-0.5 rounded-full">
                            {itemCount}
                        </span>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-10 h-10 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">{t('emptyTitle')}</h3>
                                <p className="text-gray-500 text-sm mt-1">{t('emptySubtitle')}</p>
                            </div>
                            <Link
                                href="/products"
                                onClick={closeCart}
                                className="bg-snow-accent text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-white transition-all shadow-lg shadow-snow-accent/20"
                            >
                                {t('shopNow')}
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <CartItemRow
                                    key={item.id}
                                    item={item}
                                    onRemove={() => removeItem(item.id)}
                                    onUpdate={(qty) => updateQuantity(item.id, qty)}
                                    formatPrice={formatPrice}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-400">
                                <span>{t('subtotal')}</span>
                                <span className="font-mono">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-white text-xl font-bold">
                                <span>{t('total')}</span>
                                <span className="font-mono text-snow-accent">{formatPrice(subtotal)}</span>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Link
                                href="/checkout"
                                onClick={closeCart}
                                className="block w-full bg-linear-to-r from-snow-accent to-cyan-400 text-gray-900 font-bold py-3 rounded-xl text-center hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all duration-300"
                            >
                                {t('checkout')}
                            </Link>
                            <button
                                onClick={clearCart}
                                className="w-full py-3 text-gray-500 hover:text-red-400 text-sm font-medium transition-colors"
                            >
                                {t('clearCart')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CartItemRow({ item, onRemove, onUpdate, formatPrice }: {
    item: CartItem,
    onRemove: () => void,
    onUpdate: (qty: number) => void,
    formatPrice: (price: number) => string
}) {
    return (
        <div className="flex gap-4 bg-white/5 rounded-xl p-4">
            {/* Image */}
            <div className="relative w-20 h-20 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ShoppingCart className="w-8 h-8" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between gap-2">
                    <h4 className="text-white font-medium line-clamp-1">{item.name}</h4>
                    <button onClick={onRemove} className="text-gray-500 hover:text-rose-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                        <button
                            onClick={() => onUpdate(Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm text-white font-mono">{item.quantity}</span>
                        <button
                            onClick={() => onUpdate(item.quantity + 1)}
                            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                    <span className="text-snow-accent font-bold font-mono">
                        {formatPrice(item.price * item.quantity)}
                    </span>
                </div>
            </div>
        </div>
    );
}
