"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeProviderProps {
    children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
    return (
        <Elements
            stripe={stripePromise}
            options={{
                appearance: {
                    theme: "stripe",
                    variables: {
                        colorPrimary: "#0f172a",
                        colorBackground: "#ffffff",
                        colorText: "#1e293b",
                        colorDanger: "#ef4444",
                        fontFamily: "system-ui, sans-serif",
                        borderRadius: "8px",
                    },
                },
            }}
        >
            {children}
        </Elements>
    );
}
