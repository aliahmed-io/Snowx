"use server";

import { db } from "@/lib/db";
import { generatePaymentToken, verifyPaymentToken } from "@/lib/payment-token";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CreateOrderResult {
    success: boolean;
    error?: string;
    orderNumber?: string;
    token?: string;
    total?: string;
}

/**
 * Create an order and return a payment token for redirect to SnowX GD
 */
export async function createOrderForPayment(
    items: CartItem[],
    subtotal: number,
    tax: number,
    shipping: number
): Promise<CreateOrderResult> {
    try {
        const { getUser } = getKindeServerSession();
        const kindeUser = await getUser();

        // Find the user in our database if logged in
        let userId: string | null = null;
        if (kindeUser?.email) {
            const user = await db.user.findUnique({
                where: { email: kindeUser.email },
                select: { id: true },
            });
            userId = user?.id || null;
        }

        const total = subtotal + tax + shipping;

        // Create the order with a unique order number
        const orderNumber = `SNX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const order = await db.order.create({
            data: {
                orderNumber,
                status: "PENDING",
                total,
                subtotal,
                tax,
                shipping,
                userId,
                orderItems: {
                    create: items.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });

        // Generate payment token
        const token = generatePaymentToken(order.orderNumber, total.toFixed(2));

        return {
            success: true,
            orderNumber: order.orderNumber,
            token,
            total: total.toFixed(2),
        };
    } catch (error) {
        console.error("Error creating order:", error);
        return {
            success: false,
            error: "Failed to create order. Please try again.",
        };
    }
}

/**
 * Verify payment was completed (for success page)
 */
export async function verifyPaymentComplete(orderNumber: string, token: string) {
    try {
        // Verify the token
        const tokenData = verifyPaymentToken(token);
        if (!tokenData || tokenData.orderId !== orderNumber) {
            return { success: false, error: "Invalid verification token" };
        }

        // Get the order with payment info
        const order = await db.order.findUnique({
            where: { orderNumber },
            include: {
                payment: true,
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                images: true,
                            },
                        },
                    },
                },
                accounts: {
                    where: { status: "SOLD" },
                    select: {
                        id: true,
                        serviceType: true,
                        username: true,
                        password: true, // Will be decrypted on display
                        expiryDate: true,
                    },
                },
            },
        });

        if (!order) {
            return { success: false, error: "Order not found" };
        }

        // Check if payment is complete
        const isPaid = order.payment?.status === "COMPLETED";

        // Trigger fulfillment if paid and not fully processed (only if it needs assignment)
        if (isPaid && (order.status === "PROCESSING" || order.status === "PENDING")) {
            const { fulfillOrder } = await import("./fulfillment");
            await fulfillOrder(order.id);

            // Refresh order logic would be needed if we want to show accounts immediately
            // But for now, user might need to refresh or we rely on the DB fetch above.
            // Actually, we fetched 'order' BEFORE fulfillment. 
            // So if we just fulfilled, 'order.accounts' is empty in current scope.
            // We should refetch or assume "accounts generated".
            // Since this is called on client load, a fast redirect/reload might handle it, 
            // but better to re-fetch if we just fulfilled.
        }

        // Re-fetch if we suspect we just fulfilled it, OR just return what we have 
        // and let the user see "Processing" and then receive email. 
        // Better UX: show them immediately.

        let accounts = order.accounts;
        if (isPaid && accounts.length === 0 && order.status !== "DELIVERED") {
            // We likely just fulfilled it above or it's being fulfilled.
            // Let's fetch assigned accounts explicitly.
            const refreshedAccounts = await db.account.findMany({
                where: { orderId: order.id, status: "SOLD" },
                select: {
                    id: true,
                    serviceType: true,
                    username: true,
                    password: true,
                    expiryDate: true,
                },
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            accounts = refreshedAccounts as any;
        }

        return {
            success: true,
            order: {
                orderNumber: order.orderNumber,
                status: order.status,
                total: order.total.toString(),
                isPaid,
                transactionId: order.payment?.transactionId || null,
                items: order.orderItems.map((item) => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.price.toString(),
                    image: item.product.images[0] || null,
                })),
                // Include accounts if order is processed
                accounts: order.status === "PROCESSING" || order.status === "DELIVERED"
                    ? order.accounts.map((acc) => ({
                        id: acc.id,
                        serviceType: acc.serviceType,
                        username: acc.username,
                        // Password will be shown on the order details page
                    }))
                    : [],
            },
        };
    } catch (error) {
        console.error("Error verifying payment:", error);
        return { success: false, error: "Failed to verify payment" };
    }
}
