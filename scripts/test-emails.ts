import { sendEmail } from "@/lib/mail";
import "dotenv/config";

async function testEmails() {
    console.log("--- Starting Email Integration Test ---");

    // 1. Test Delivered
    console.log("Sending to: delivered@resend.dev...");
    const delivered = await sendEmail({
        to: "delivered@resend.dev",
        subject: "Test: Successful Delivery",
        html: "<p>This is a test email that should be delivered successfully.</p>"
    });
    console.log("Result:", delivered);

    // 2. Test Bounced
    console.log("\nSending to: bounced@resend.dev...");
    const bounced = await sendEmail({
        to: "bounced@resend.dev",
        subject: "Test: Hard Bounce",
        html: "<p>This is a test email that should hard bounce.</p>"
    });
    console.log("Result:", bounced);

    console.log("\n--- Email Integration Test Complete ---");
}

testEmails().catch(console.error);
