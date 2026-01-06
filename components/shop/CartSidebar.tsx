"use client";

import { useCart, CartItem } from "@/components/providers/CartProvider";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/components/providers/CurrencyProvider";

export function CartSidebar() {
    const { items, removeItem, updateQuantity, subtotal, itemCount, isOpen, closeCart, clearCart } = useCart();
    const t = useTranslations('Cart');
    const { formatPrice } = useCurrency();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-white/10 z-50 flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-snow-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {t('title')} ({itemCount})
                    </h2>
                    <button
                        onClick={closeCart}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-gray-400 mb-4">{t('empty')}</p>
                            <button
                                onClick={closeCart}
                                className="text-snow-accent hover:underline"
                            >
                                {t('continueShopping')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <CartItemRow
                                    key={item.id}
                                    item={item}
                                    onRemove={() => removeItem(item.id)}
                                    onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                                    formatPrice={formatPrice}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-white/10 p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">{t('subtotal')}</span>
                            <span className="text-2xl font-bold text-white">{formatPrice(subtotal)}</span>
                        </div>
                        <p className="text-gray-500 text-sm">{t('shippingNote')}</p>

                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="block w-full bg-gradient-to-r from-snow-accent to-cyan-400 text-gray-900 font-bold py-3 rounded-xl text-center hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all duration-300"
                        >
                            {t('checkout')}
                        </Link>

                        <button
                            onClick={clearCart}
                            className="block w-full text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            {t('clearCart')}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

function CartItemRow({
    item,
    onRemove,
    onUpdateQuantity,
    formatPrice,
}: {
    item: CartItem;
    onRemove: () => void;
    onUpdateQuantity: (qty: number) => void;
    formatPrice: (amount: number) => string;
}) {
    return (
        <div className="flex gap-4 bg-white/5 rounded-xl p-4">
            {/* Image */}
            <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="text-white font-medium hover:text-snow-accent transition-colors line-clamp-1">
                    {item.name}
                </Link>
                <p className="text-snow-accent font-bold mt-1">{formatPrice(item.price)}</p>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={() => onUpdateQuantity(item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                        -
                    </button>
                    <span className="text-white w-8 text-center">{item.quantity}</span>
                    <button
                        onClick={() => onUpdateQuantity(item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Remove */}
            <button
                onClick={onRemove}
                className="text-gray-500 hover:text-red-400 transition-colors self-start"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
}
