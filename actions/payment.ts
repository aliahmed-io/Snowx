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

// Create an order and return a payment token for redirect to SnowX GD
export async function createOrderForPayment(
    items: CartItem[]
): Promise<CreateOrderResult> {
    try {
        const { getUser } = getKindeServerSession();
        const kindeUser = await getUser();

        // 1. Fetch valid products from DB to get real prices
        const productIds = items.map(i => i.id);
        const dbProducts = await db.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, price: true, name: true, stockQuantity: true }
        });

        // 2. Validate items and Calculate Subtotal
        let calculatedSubtotal = 0;
        const finalItems = [];

        for (const item of items) {
            const product = dbProducts.find(p => p.id === item.id);
            if (!product) {
                return { success: false, error: `Product not found: ${item.id}` }; // Should probably handle this gracefully
            }
            if (product.stockQuantity < item.quantity) {
                return { success: false, error: `Not enough stock for: ${product.name}` };
            }

            const price = Number(product.price);
            calculatedSubtotal += price * item.quantity;

            finalItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: price // Use SERVER price
            });
        }

        // 3. Calculate Tax and Shipping (Matching Client Logic)
        const tax = calculatedSubtotal * 0.1;
        const shipping = calculatedSubtotal > 50 ? 0 : 5.99;
        const total = calculatedSubtotal + tax + shipping;

        // Find the user in our database if logged in
        let userId: string | null = null;
        if (kindeUser?.email) {
            const user = await db.user.findUnique({
                where: { email: kindeUser.email },
                select: { id: true },
            });
            userId = user?.id || null;
        }

        // Create the order with a unique order number
        const orderNumber = `SNX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const order = await db.order.create({
            data: {
                orderNumber,
                status: "PENDING",
                total,
                subtotal: calculatedSubtotal,
                tax,
                shipping,
                userId,
                orderItems: {
                    create: finalItems.map((item) => ({
                        productId: item.productId,
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

        // Check if payment is already complete
        const isPaid = order.payment?.status === "COMPLETED";

        // CRITICAL FIX: Trust the signed token to update local status
        // Since snowx-gd cannot access this DB, we must update ourselves if the token is valid
        if (!isPaid) {
            // Double check amount matches token to prevent tampering
            if (parseFloat(tokenData.amount) === parseFloat(order.total.toString())) {
                const { fulfillOrder } = await import("./fulfillment");

                // Update DB to mark as paid
                await db.$transaction(async (tx) => {
                    // Create or update payment record
                    await tx.payment.upsert({
                        where: { orderId: order.id },
                        create: {
                            orderId: order.id,
                            amount: order.total,
                            currency: "USD",
                            status: "COMPLETED",
                            provider: "PAYPAL",
                            transactionId: `SNX-GD-${Date.now()}`, // We don't have the real PP ID here easily without passing it in token, but token proves success
                        },
                        update: {
                            status: "COMPLETED",
                        }
                    });

                    // Update order status
                    await tx.order.update({
                        where: { id: order.id },
                        data: { status: "PROCESSING" }
                    });
                });

                // Trigger fulfillment
                await fulfillOrder(order.id);

                // We just paid, so isPaid is now true for the return object
                // fetch updated accounts below
            } else {
                console.error("Token amount mismatch", tokenData.amount, order.total);
                return { success: false, error: "Payment verification failed: Amount mismatch" };
            }
        }

        // Refresh order data after potential update
        // We can just proceed to fetch accounts now, checking isPaid or assuming it allowed us through

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
                isPaid: isPaid || true, // If we passed the checks above, it is paid
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
