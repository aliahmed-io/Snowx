import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
    to: string | string[];
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailProps) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email simulation:");
        console.log(`To: ${to}, Subject: ${subject}`);
        return { success: true, simulated: true };
    }

    try {
        const data = await resend.emails.send({
            from: "Snow X Admin <onboarding@resend.dev>", // Default for testing
            to,
            subject,
            html,
        });
        return { success: true, data };
    } catch (error) {
        console.error("Resend Error:", error);
        return { success: false, error };
    }
}
