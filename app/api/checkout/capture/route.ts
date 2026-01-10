import { NextRequest, NextResponse } from "next/server";
import { capturePayPalPayment, getPayPalOrderDetails } from "@/lib/paypal";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { generateOrderConfirmationEmail } from "@/lib/email-templates";

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
        const customerName = payerName ? `${payerName.given_name} ${payerName.surname}` : null;

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
                userId: (metadata as Record<string, any>)?.userId || null,
                shippingAddress: {
                    email: payerEmail,
                    name: customerName,
                },
                orderItems: cartItems.length > 0 ? {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                } : undefined,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Assign Accounts
        let assignedAccounts: { productName: string; username: string; password: string }[] = [];
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const userIdToAssign = (metadata as Record<string, any>)?.userId;

            if (cartItems.length > 0) {
                await import("@/lib/services/account-service").then(({ AccountService }) =>
                    AccountService.assignAccountsToOrder(
                        order.id,
                        userIdToAssign,
                        cartItems
                    )
                );

                // Fetch the assigned accounts for the email
                const accounts = await db.account.findMany({
                    where: { orderId: order.id },
                    include: { product: { select: { name: true } } },
                });

                assignedAccounts = accounts.map((acc) => ({
                    productName: acc.product?.name || "Digital Product",
                    username: acc.username,
                    password: acc.password, // Encrypted - will be decrypted in email template
                }));
            }
        } catch (err) {
            console.error("Failed to assign licenses:", err);
        }

        // Send confirmation email
        if (payerEmail) {
            try {
                const emailData = generateOrderConfirmationEmail({
                    orderNumber: order.orderNumber!,
                    orderDate: order.createdAt,
                    customerName,
                    customerEmail: payerEmail,
                    subtotal,
                    tax,
                    shipping,
                    total,
                    items: order.orderItems.map((item) => ({
                        productName: item.product?.name || "Product",
                        quantity: item.quantity,
                        price: Number(item.price),
                    })),
                    accounts: assignedAccounts,
                });

                const emailResult = await sendEmail({
                    to: payerEmail,
                    subject: emailData.subject,
                    html: emailData.html,
                });

                if (emailResult.success) {
                    console.log(`Order confirmation email sent to ${payerEmail}`);
                } else {
                    console.error("Failed to send order confirmation email:", emailResult.error);
                }
            } catch (emailErr) {
                console.error("Email sending error:", emailErr);
                // Don't fail the order, just log
            }
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
