"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/navigation";
import { useCart } from "@/components/providers/CartProvider";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // PayPal order ID
    const { clearCart } = useCart();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function capturePayment() {
            if (!token) {
                setStatus("error");
                setError("No payment token found");
                return;
            }

            try {
                const response = await fetch("/api/checkout/capture", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Payment capture failed");
                }

                setOrderNumber(data.orderNumber);
                setStatus("success");
                clearCart(); // Clear cart after successful payment
            } catch (err) {
                setStatus("error");
                setError(err instanceof Error ? err.message : "Something went wrong");
            }
        }

        capturePayment();
    }, [token, clearCart]);

    if (status === "loading") {
        return (
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
                <div className="py-20">
                    <div className="w-16 h-16 mx-auto border-4 border-snow-accent border-t-transparent rounded-full animate-spin mb-8" />
                    <h1 className="text-2xl font-bold text-white mb-4">Processing Payment...</h1>
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
                    <h1 className="text-4xl font-bold text-white mb-4">Payment Failed</h1>
                    <p className="text-gray-400 text-lg mb-8">{error || "We couldn't process your payment."}</p>
                    <Link
                        href="/cart"
                        className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                    >
                        Return to Cart
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
            <div className="py-12">
                {/* Success animation */}
                <div className="w-24 h-24 mx-auto bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
                {orderNumber && (
                    <p className="text-snow-accent text-lg font-mono mb-2">Order #{orderNumber}</p>
                )}
                <p className="text-gray-400 text-lg mb-8">
                    Thank you for your purchase. Your digital subscription details have been sent to your email.
                </p>

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
                <p className="text-gray-500 text-sm mt-12">
                    Questions? Contact our support team at{" "}
                    <a href="mailto:support@snowx.com" className="text-snow-accent hover:underline">
                        support@snowx.com
                    </a>
                </p>
            </div>
        </div>
    );
}
