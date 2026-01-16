import crypto from "crypto";

const PAYMENT_SECRET = process.env.PAYMENT_SECRET || "default-secret-change-in-production";

/**
 * Generate a secure token for order verification
 */
export function generatePaymentToken(orderId: string, amount: string): string {
    const data = `${orderId}:${amount}:${Date.now()}`;
    const hash = crypto.createHmac("sha256", PAYMENT_SECRET).update(data).digest("hex");
    const token = Buffer.from(`${data}:${hash}`).toString("base64url");
    return token;
}

/**
 * Verify a payment token and extract order details
 */
export function verifyPaymentToken(token: string): { orderId: string; amount: string; timestamp: number } | null {
    try {
        const decoded = Buffer.from(token, "base64url").toString();
        const parts = decoded.split(":");
        if (parts.length !== 4) return null;

        const [orderId, amount, timestampStr, hash] = parts;
        const timestamp = parseInt(timestampStr);

        // Verify the hash
        const data = `${orderId}:${amount}:${timestampStr}`;
        const expectedHash = crypto.createHmac("sha256", PAYMENT_SECRET).update(data).digest("hex");

        if (hash !== expectedHash) {
            console.error("Token hash mismatch");
            return null;
        }

        // Check if token is not too old (1 hour max)
        const maxAge = 60 * 60 * 1000; // 1 hour
        if (Date.now() - timestamp > maxAge) {
            console.error("Token expired");
            return null;
        }

        return { orderId, amount, timestamp };
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}
