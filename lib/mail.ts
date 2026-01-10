import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Configurable sender - use verified domain in production
const DEFAULT_FROM = process.env.EMAIL_FROM || "Snow X <onboarding@resend.dev>";

interface SendEmailProps {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailProps) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email simulation:");
        console.log(`To: ${to}, Subject: ${subject}`);
        return { success: true, simulated: true };
    }

    try {
        const data = await resend.emails.send({
            from: from || DEFAULT_FROM,
            to,
            subject,
            html,
        });
        console.log("Email sent successfully:", data);
        return { success: true, data };
    } catch (error) {
        console.error("Resend Error:", error);
        return { success: false, error };
    }
}
