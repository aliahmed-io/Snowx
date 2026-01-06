import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items } = body;

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "No items in cart" },
                { status: 400 }
            );
        }

        const lineItems = items.map((item: {
            id: string;
            name: string;
            price: number;
            quantity: number;
            image?: string;
        }) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                    metadata: {
                        productId: item.id,
                    },
                },
                unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        // Calculate subtotal for shipping
        const subtotal = items.reduce(
            (acc: number, item: { price: number; quantity: number }) =>
                acc + item.price * item.quantity,
            0
        );

        // Add tax (10%)
        lineItems.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Tax (10%)",
                },
                unit_amount: Math.round(subtotal * 0.1 * 100),
            },
            quantity: 1,
        });

        // Add shipping if applicable
        if (subtotal < 50) {
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Shipping",
                    },
                    unit_amount: 599, // $5.99
                },
                quantity: 1,
            });
        }

        const session = await getStripe().checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.nextUrl.origin}/cart`,
            metadata: {
                items: JSON.stringify(items.map((item: { id: string; quantity: number; price: number }) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                }))),
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
