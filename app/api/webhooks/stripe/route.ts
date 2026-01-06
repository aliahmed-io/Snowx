import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing Stripe signature" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = getStripe().webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        console.error("Webhook signature verification failed:", error);
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        );
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                // Update order status
                if (session.metadata?.orderId) {
                    await db.order.update({
                        where: { id: session.metadata.orderId },
                        data: {
                            status: "PROCESSING",
                            stripePaymentId: session.payment_intent as string,
                        },
                    });
                }

                console.log("Checkout session completed:", session.id);
                break;
            }

            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log("Payment succeeded:", paymentIntent.id);
                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;

                // Update order status to cancelled
                if (paymentIntent.metadata?.orderId) {
                    await db.order.update({
                        where: { id: paymentIntent.metadata.orderId },
                        data: {
                            status: "CANCELLED",
                        },
                    });
                }

                console.log("Payment failed:", paymentIntent.id);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}
