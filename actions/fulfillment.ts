"use server";

import { db } from "@/lib/db";
import { AccountService } from "@/lib/services/account-service";
import { generateOrderConfirmationEmail } from "@/lib/email-templates";
import { sendEmail } from "@/lib/mail";

/**
 * Fulfills an order by assigning accounts and sending confirmation email.
 * Should be called after payment is confirmed.
 */
export async function fulfillOrder(orderId: string) {
    try {
        const order = await db.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: { product: true }
                },
                User: true // Schema defines this relation as 'User' (PascalCase)
            }
        });

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status !== "PROCESSING") {
            // Only fulfill orders that are PAID/PROCESSING
            // If it's already DELIVERED, we might skip re-assignment
            return { success: true, alreadyFulfilled: true };
        }

        // Check if accounts are already assigned
        const existingAccounts = await db.account.count({
            where: { orderId: order.id }
        });

        let assignedAccounts: { productName: string; username: string; password: string }[] = [];

        if (existingAccounts === 0) {
            // Assign accounts
            await AccountService.assignAccountsToOrder(
                order.id,
                order.userId,
                order.orderItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            );
        }

        // Fetch assigned accounts for email
        const accounts = await db.account.findMany({
            where: { orderId: order.id },
            include: { product: { select: { name: true } } }
        });

        assignedAccounts = accounts.map((acc) => ({
            productName: acc.product?.name || "Digital Product",
            username: acc.username,
            password: acc.password, // Will be decrypted in email template
        }));

        // Send Email
        // Use shipping address email (from PayPal/Checkout) or User email
        const customerEmail = order.shippingAddress && typeof order.shippingAddress === 'object' && 'email' in order.shippingAddress
            ? (order.shippingAddress as { email: string }).email
            : order.User?.email;

        const customerName = order.shippingAddress && typeof order.shippingAddress === 'object' && 'name' in order.shippingAddress
            ? (order.shippingAddress as { name: string }).name
            : "Customer";

        if (customerEmail) {
            const emailData = generateOrderConfirmationEmail({
                orderNumber: order.orderNumber,
                orderDate: order.createdAt,
                customerName: customerName || "Valued Customer",
                customerEmail: customerEmail,
                subtotal: Number(order.subtotal),
                tax: Number(order.tax),
                shipping: Number(order.shipping),
                total: Number(order.total),
                items: order.orderItems.map((item) => ({
                    productName: item.product.name,
                    quantity: item.quantity,
                    price: Number(item.price),
                })),
                accounts: assignedAccounts,
            });

            await sendEmail({
                to: customerEmail,
                subject: emailData.subject,
                html: emailData.html,
            });
        }

        // Update order status to DELIVERED since it's digital instant delivery
        if (assignedAccounts.length > 0) {
            await db.order.update({
                where: { id: order.id },
                data: { status: "DELIVERED" }
            });
        }

        return { success: true };

    } catch (error) {
        console.error("Fulfillment error:", error);
        return { success: false, error: "Failed to fulfill order" };
    }
}
