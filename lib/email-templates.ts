import { decrypt } from "@/lib/encryption";

interface OrderEmailData {
    orderNumber: string;
    orderDate: Date;
    customerName?: string | null;
    customerEmail: string;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    items: {
        productName: string;
        quantity: number;
        price: number;
    }[];
    accounts: {
        productName: string;
        username: string;
        password: string; // Encrypted
    }[];
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function generateOrderConfirmationEmail(data: OrderEmailData): {
    subject: string;
    html: string;
} {
    const { orderNumber, orderDate, customerName, subtotal, tax, shipping, total, items, accounts } = data;

    // Decrypt passwords for display
    const decryptedAccounts = accounts.map(acc => ({
        ...acc,
        password: (() => {
            try {
                return decrypt(acc.password);
            } catch {
                return "********"; // Fallback if decryption fails
            }
        })(),
    }));

    const accountsHtml = decryptedAccounts.length > 0
        ? decryptedAccounts.map(acc => `
            <div style="background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                <h3 style="color: #00d4ff; margin: 0 0 12px 0; font-size: 16px;">${acc.productName}</h3>
                <div style="background: #1e293b; border-radius: 8px; padding: 16px;">
                    <div style="margin-bottom: 12px;">
                        <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase;">Username</span>
                        <div style="color: #ffffff; font-family: monospace; font-size: 14px; margin-top: 4px;">${acc.username}</div>
                    </div>
                    <div>
                        <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase;">Password</span>
                        <div style="color: #ffffff; font-family: monospace; font-size: 14px; margin-top: 4px;">${acc.password}</div>
                    </div>
                </div>
            </div>
        `).join("")
        : `<p style="color: #94a3b8;">Your account credentials are being processed. You'll receive them shortly.</p>`;

    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #334155; color: #ffffff;">${item.productName}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #334155; color: #94a3b8; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #334155; color: #ffffff; text-align: right;">${formatCurrency(item.price)}</td>
        </tr>
    `).join("");

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020817; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #00d4ff; font-size: 32px; margin: 0;">Snow X</h1>
            <p style="color: #94a3b8; margin-top: 8px;">Your order is ready!</p>
        </div>

        <!-- Success Banner -->
        <div style="background: linear-gradient(135deg, #00d4ff20, #0f172a); border: 1px solid #00d4ff40; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
            <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
            <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0;">Thank You${customerName ? `, ${customerName}` : ""}!</h2>
            <p style="color: #94a3b8; margin: 0;">Your payment was successful and your order is complete.</p>
        </div>

        <!-- Order Info -->
        <div style="background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <div>
                    <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase;">Order Number</span>
                    <div style="color: #00d4ff; font-weight: bold; font-size: 18px;">${orderNumber}</div>
                </div>
                <div style="text-align: right;">
                    <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase;">Date</span>
                    <div style="color: #ffffff; font-size: 14px;">${formatDate(orderDate)}</div>
                </div>
            </div>
        </div>

        <!-- Account Credentials Section -->
        <div style="margin-bottom: 32px;">
            <h2 style="color: #ffffff; font-size: 18px; margin-bottom: 16px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">🔐</span> Your Account Credentials
            </h2>
            <div style="background: #0a0f1a; border: 2px solid #00d4ff40; border-radius: 16px; padding: 24px;">
                ${accountsHtml}
                <p style="color: #f59e0b; font-size: 12px; margin: 16px 0 0 0; padding: 12px; background: #f59e0b10; border-radius: 8px;">
                    ⚠️ <strong>Important:</strong> Keep these credentials safe. Do not share them with anyone.
                </p>
            </div>
        </div>

        <!-- Order Summary -->
        <div style="margin-bottom: 32px;">
            <h2 style="color: #ffffff; font-size: 18px; margin-bottom: 16px;">
                <span style="margin-right: 8px;">📋</span> Order Summary
            </h2>
            <div style="background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding-bottom: 12px; border-bottom: 1px solid #334155; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Item</th>
                            <th style="text-align: center; padding-bottom: 12px; border-bottom: 1px solid #334155; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Qty</th>
                            <th style="text-align: right; padding-bottom: 12px; border-bottom: 1px solid #334155; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                
                <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #334155;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #94a3b8;">Subtotal</span>
                        <span style="color: #ffffff;">${formatCurrency(subtotal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #94a3b8;">Tax</span>
                        <span style="color: #ffffff;">${formatCurrency(tax)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                        <span style="color: #94a3b8;">Shipping</span>
                        <span style="color: #ffffff;">${shipping > 0 ? formatCurrency(shipping) : "FREE"}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 2px solid #00d4ff;">
                        <span style="color: #ffffff; font-weight: bold; font-size: 18px;">Total</span>
                        <span style="color: #00d4ff; font-weight: bold; font-size: 18px;">${formatCurrency(total)}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- CTA -->
        <div style="text-align: center; margin-bottom: 40px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://snowx.com"}/orders" 
               style="display: inline-block; background: #00d4ff; color: #020817; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                View Your Orders
            </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding-top: 32px; border-top: 1px solid #334155;">
            <p style="color: #ffffff; font-size: 16px; margin-bottom: 8px;">
                We're happy to serve you! 💙
            </p>
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">
                Thank you for choosing Snow X. We hope to see you again soon!
            </p>
            <p style="color: #64748b; font-size: 12px;">
                Questions? Contact us at <a href="mailto:support@snowx.com" style="color: #00d4ff;">support@snowx.com</a>
            </p>
            <p style="color: #475569; font-size: 11px; margin-top: 24px;">
                © ${new Date().getFullYear()} Snow X. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();

    return {
        subject: `Your Snow X Order is Ready! 🎉 (${orderNumber})`,
        html,
    };
}
