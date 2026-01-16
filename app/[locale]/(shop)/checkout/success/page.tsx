"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { verifyPaymentComplete } from "@/actions/payment";
import Image from "next/image";

interface OrderData {
    orderNumber: string;
    status: string;
    total: string;
    isPaid: boolean;
    transactionId: string | null;
    items: {
        name: string;
        quantity: number;
        price: string;
        image: string | null;
    }[];
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function verifyAndLoad() {
            const orderNumber = searchParams.get("order");
            const token = searchParams.get("token");

            if (!orderNumber || !token) {
                setStatus("error");
                setError("Invalid success link. Missing required parameters.");
                return;
            }

            try {
                const result = await verifyPaymentComplete(orderNumber, token);

                if (!result.success) {
                    throw new Error(result.error || "Failed to verify payment");
                }

                setOrder(result.order as OrderData);
                setStatus("success");

                // Clear cart after successful payment verification
                if (result.order?.isPaid) {
                    clearCart();
                }
            } catch (err) {
                setStatus("error");
                setError(err instanceof Error ? err.message : "Something went wrong");
            }
        }

        verifyAndLoad();
    }, [searchParams, clearCart]);

    if (status === "loading") {
        return (
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
                <div className="py-20">
                    <div className="w-16 h-16 mx-auto border-4 border-snow-accent border-t-transparent rounded-full animate-spin mb-8" />
                    <h1 className="text-2xl font-bold text-white mb-4">Verifying Payment...</h1>
                    <p className="text-gray-400">Please wait while we confirm your payment.</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
                <div className="py-12">
                    <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-8">
                        <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Verification Failed</h1>
                    <p className="text-gray-400 text-lg mb-8">{error || "We couldn't verify your payment."}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/orders"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                        >
                            View Orders
                        </Link>
                        <Link
                            href="/cart"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                        >
                            Return to Cart
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
            <div className="text-center">
                {/* Success animation */}
                <div className="w-24 h-24 mx-auto bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
                {order && (
                    <p className="text-snow-accent text-lg font-mono mb-2">Order #{order.orderNumber}</p>
                )}
                <p className="text-gray-400 text-lg mb-8">
                    Thank you for your purchase. Your digital subscription details will be sent to your email.
                </p>
            </div>

            {/* Order Details */}
            {order && (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-8 mb-8">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Paid</p>
                            <p className="text-snow-accent text-2xl font-bold">${parseFloat(order.total).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-sm mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${order.isPaid ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                                }`}>
                                {order.isPaid ? "Paid ✓" : "Processing"}
                            </span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold">Items Purchased</h3>
                        {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden shrink-0 relative">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <span className="text-lg">📦</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">{item.name}</p>
                                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-white font-medium">${parseFloat(item.price).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    {order.transactionId && (
                        <p className="text-gray-500 text-xs mt-6 pt-4 border-t border-white/10">
                            Transaction ID: {order.transactionId}
                        </p>
                    )}
                </div>
            )}

            {/* What's next */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 mb-8 text-left">
                <h2 className="text-xl font-semibold text-white mb-4">What happens next?</h2>
                <ul className="space-y-4">
                    {[
                        { step: "1", title: "Check your email", desc: "We've sent your subscription details and login credentials." },
                        { step: "2", title: "Access your account", desc: "Use the provided credentials to access your premium subscription." },
                        { step: "3", title: "Start enjoying", desc: "Your subscription is active immediately - no waiting required!" },
                    ].map((item) => (
                        <li key={item.step} className="flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-snow-accent/20 text-snow-accent flex items-center justify-center font-bold shrink-0">
                                {item.step}
                            </span>
                            <div>
                                <p className="text-white font-medium">{item.title}</p>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/orders"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    View Orders
                </Link>
                <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-snow-accent to-cyan-400 text-gray-900 font-bold px-6 py-3 rounded-xl hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all"
                >
                    Continue Shopping
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>

            {/* Support */}
            <p className="text-gray-500 text-sm mt-12 text-center">
                Questions? Contact our support team at{" "}
                <a href="mailto:SnowXsup@gmail.com" className="text-snow-accent hover:underline">
                    SnowXsup@gmail.com
                </a>
            </p>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
                <div className="py-20">
                    <div className="w-16 h-16 mx-auto border-4 border-snow-accent border-t-transparent rounded-full animate-spin mb-8" />
                    <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
