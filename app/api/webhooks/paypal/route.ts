
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
// import { LicenseAssignmentService } from "@/lib/services/license-service"; // Dynamic import to avoid cycles/init issues
// import { getPayPalClient } from "@/lib/paypal"; // Ensure client is configured

export async function POST(request: NextRequest) {
    try {
        // 1. Read Headers and Body
        // const headers = request.headers; // Unused until signature verification is active
        const body = await request.text(); // Raw body needed for verification
        const webhookId = process.env.PAYPAL_WEBHOOK_ID;

        // 2. Mock Signature Verification (TODO: Implement strict check via PayPal API or Crypto)
        // const signature = headers.get("paypal-transmission-sig");
        // const transmissionId = headers.get("paypal-transmission-id");
        // ... verify(body, headers) ...

        if (!webhookId) {
            console.error("PAYPAL_WEBHOOK_ID is missing");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        const event = JSON.parse(body);
        const eventType = event.event_type;
        const eventId = event.id; // Unique PayPal Event ID

        // 3. Idempotency Check
        const existingEvent = await db.webhookEvent.findUnique({
            where: { eventId: eventId }
        });

        if (existingEvent) {
            console.log(`Event ${eventId} already processed. Skipping.`);
            return NextResponse.json({ received: true });
        }

        // 4. Create Audit Record (Idempotency Lock)
        await db.webhookEvent.create({
            data: {
                provider: "paypal",
                eventId: eventId,
                eventType: eventType,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                payload: event as any, // valid json
                status: "PROCESSING"
            }
        });

        console.log(`Processing PayPal Webhook: ${eventType} (${eventId})`);
        const resource = event.resource;

        try {
            // 5. Handle Business Logic
            if (eventType === "CUSTOMER.DISPUTE.CREATED") {
                // Dispute Opened -> SUSPEND
                const transactionId = resource.disputed_transactions?.[0]?.seller_transaction_id;
                await handleDisputeCreated(transactionId, eventType);
            }
            else if (eventType === "CUSTOMER.DISPUTE.RESOLVED") {
                // Dispute Resolved -> REVOKE (Lost) or RESTORE (Won)
                const transactionId = resource.disputed_transactions?.[0]?.seller_transaction_id;
                const outcome = resource.dispute_outcome?.outcome_code; // e.g., RESOLVED_BUYER_FAVOUR, RESOLVED_SELLER_FAVOUR
                await handleDisputeResolved(transactionId, outcome, eventType);
            }
            else if (eventType === "PAYMENT.CAPTURE.DENIED") {
                // Capture Denied -> REVOKE (Immediate)
                const transactionId = resource.id;
                await handleCaptureDenied(transactionId, eventType);
            }

            // 6. Mark as Processed
            await db.webhookEvent.update({
                where: { eventId: eventId },
                data: { status: "PROCESSED" }
            });

        } catch (logicError) {
            console.error("Webhook Logic Error:", logicError);
            await db.webhookEvent.update({
                where: { eventId: eventId },
                data: {
                    status: "FAILED",
                    error: String(logicError)
                }
            });
            throw logicError; // Re-throw to return 500 if needed, or swallow to prevent retry loop if permanent
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("Webhook Error:", err);
        return NextResponse.json({ error: "Webhook Failed" }, { status: 500 });
    }
}

// Helper Functions to keep main handler clean

async function handleDisputeCreated(transactionId: string | undefined, reason: string) {
    if (!transactionId) return;
    const payment = await db.payment.findFirst({
        where: { OR: [{ transactionId }, { id: transactionId }] }
    });

    if (payment) {
        const { LicenseAssignmentService } = await import("@/lib/services/license-service");
        await LicenseAssignmentService.suspendLicensesForOrder(
            payment.orderId,
            `PayPal Dispute Opened: ${reason}`
        );
        console.log(`Suspended licenses for Order ${payment.orderId}`);
    }
}

async function handleDisputeResolved(transactionId: string | undefined, outcome: string | undefined, reason: string) {
    if (!transactionId) return;
    const payment = await db.payment.findFirst({
        where: { OR: [{ transactionId }, { id: transactionId }] }
    });

    if (!payment) return;

    const { LicenseAssignmentService } = await import("@/lib/services/license-service");

    if (outcome === "RESOLVED_BUYER_FAVOUR") {
        // Seller Lost -> Permanent Revoke
        await LicenseAssignmentService.revokeLicensesForOrder(
            payment.orderId,
            `PayPal Dispute Lost: ${outcome} (${reason})`
        );
        console.log(`Revoked licenses for Order ${payment.orderId} (Dispute Lost)`);
    } else if (outcome === "RESOLVED_SELLER_FAVOUR") {
        // Seller Won -> Restore
        await LicenseAssignmentService.restoreLicensesForOrder(
            payment.orderId,
            `PayPal Dispute Won: ${outcome} (${reason})`
        );
        console.log(`Restored licenses for Order ${payment.orderId} (Dispute Won)`);
    }
}

async function handleCaptureDenied(transactionId: string | undefined, reason: string) {
    if (!transactionId) return;
    const payment = await db.payment.findFirst({
        where: { OR: [{ transactionId }, { id: transactionId }] }
    });

    if (payment) {
        const { LicenseAssignmentService } = await import("@/lib/services/license-service");
        await LicenseAssignmentService.revokeLicensesForOrder(
            payment.orderId,
            `PayPal Capture Denied: ${reason}`
        );
        console.log(`Revoked licenses for Order ${payment.orderId} (Capture Denied)`);
    }
}
