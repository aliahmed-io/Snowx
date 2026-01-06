import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
    typescript: true,
});

export async function createCheckoutSession({
    lineItems,
    customerId,
    customerEmail,
    successUrl,
    cancelUrl,
    metadata,
}: {
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    customerId?: string;
    customerEmail?: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
}) {
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        customer: customerId,
        customer_email: customerId ? undefined : customerEmail,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
        shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB", "AU"],
        },
        billing_address_collection: "required",
    });

    return session;
}

export function formatAmountForStripe(amount: number): number {
    return Math.round(amount * 100);
}

export function formatAmountFromStripe(amount: number): number {
    return amount / 100;
}
