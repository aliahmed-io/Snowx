import { NextRequest, NextResponse } from "next/server";
import { capturePayPalPayment, getPayPalOrderDetails } from "@/lib/paypal";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token } = body; // PayPal order ID (token)

        if (!token) {
            return NextResponse.json(
                { error: "Missing PayPal order token" },
                { status: 400 }
            );
        }

        // Get order details to extract metadata
        const orderDetails = await getPayPalOrderDetails(token);

        // Capture the payment
        const capture = await capturePayPalPayment(token);

        if (capture.status !== "COMPLETED") {
            return NextResponse.json(
                { error: "Payment not completed" },
                { status: 400 }
            );
        }

        // Extract custom metadata with item info
        const purchaseUnit = orderDetails.purchase_units?.[0];
        const customId = purchaseUnit?.custom_id;
        let cartItems: { productId: string; quantity: number; price: number }[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let metadata: Record<string, any> = {};

        if (customId) {
            try {
                metadata = JSON.parse(customId);
                cartItems = JSON.parse(metadata.items || "[]");
            } catch {
                console.warn("Failed to parse order metadata");
            }
        }

        // Get payer info
        const payerEmail = capture.payer?.email_address;
        const payerName = capture.payer?.name;

        // Get amount info
        const amount = purchaseUnit?.amount;
        const total = parseFloat(amount?.value || "0");
        const breakdown = amount?.breakdown;
        const subtotal = parseFloat(breakdown?.item_total?.value || "0");
        const tax = parseFloat(breakdown?.tax_total?.value || "0");
        const shipping = parseFloat(breakdown?.shipping?.value || "0");

        // Create order in database
        const order = await db.order.create({
            data: {
                orderNumber: `PP-${token.substring(0, 8)}`,
                status: "PROCESSING",
                total,
                subtotal,
                tax,
                shipping,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                userId: (metadata as Record<string, any>)?.userId || null, // Try to link user
                shippingAddress: {
                    email: payerEmail,
                    name: payerName ? `${payerName.given_name} ${payerName.surname}` : null,
                },
                orderItems: cartItems.length > 0 ? {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                } : undefined,
            },
        });

        // Assign Licenses
        try {
            // Need a userId. If null, maybe use email to find or create?
            // For now, if userId exists, we assign.
            // Or we assign to the Order regardless of user (LicenseKey has orderId).

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const userIdToAssign = (metadata as Record<string, any>)?.userId;

            // If we have items and it's a digital product, assign accounts.
            if (cartItems.length > 0) {
                await import("@/lib/services/account-service").then(({ AccountService }) =>
                    AccountService.assignAccountsToOrder(
                        order.id,
                        userIdToAssign, // Can be null/undefined? Service expects string.
                        cartItems
                    )
                );
            }
        } catch (err) {
            console.error("Failed to assign licenses:", err);
            // Don't fail the request, just log. Admin can fix.
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.orderNumber,
            captureId: capture.id,
        });
    } catch (error) {
        console.error("Payment capture error:", error);
        return NextResponse.json(
            { error: "Failed to capture payment" },
            { status: 500 }
        );
    }
}
