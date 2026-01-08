import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";

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

        const origin = request.nextUrl.origin;

        const order = await createPayPalOrder({
            items: items.map((item: {
                id: string;
                name: string;
                price: number;
                quantity: number;
                image?: string;
            }) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            })),
            successUrl: `${origin}/checkout/success`,
            cancelUrl: `${origin}/cart`,
            metadata: {
                items: JSON.stringify(items.map((item: { id: string; quantity: number; price: number }) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                }))),
            },
        });

        if (!order.approvalUrl) {
            throw new Error("Failed to get PayPal approval URL");
        }

        return NextResponse.json({
            orderId: order.orderId,
            url: order.approvalUrl
        });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
