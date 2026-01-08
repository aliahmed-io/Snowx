"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContactForm(prevState: { error?: string; success?: string; errors?: Record<string, string[]> } | null, formData: FormData) {
    const validatedFields = contactSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    });

    if (!validatedFields.success) {
        return {
            error: "Invalid fields. Please check your input.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        // 1. Save to Database
        await db.contact.create({
            data: {
                name: validatedFields.data.name,
                email: validatedFields.data.email,
                subject: validatedFields.data.subject,
                message: validatedFields.data.message,
            },
        });

        // 2. Send Email Notification (to Admin)
        const adminEmail = process.env.ADMIN_EMAIL || "ali.ahmed.2001@outlook.com"; // Default to owner email
        await sendEmail({
            to: adminEmail,
            subject: `[SnowX Contact] ${validatedFields.data.subject}`,
            html: `
                <h1>New Contact Message</h1>
                <p><strong>From:</strong> ${validatedFields.data.name} (${validatedFields.data.email})</p>
                <p><strong>Subject:</strong> ${validatedFields.data.subject}</p>
                <br />
                <p>${validatedFields.data.message.replace(/\n/g, '<br/>')}</p>
            `
        });

        revalidatePath("/admin/contact");
        return { success: "Message sent! We'll get back to you shortly." };
    } catch (error) {
        console.error("Contact form error:", error);
        return { error: "Failed to send message. Please try again later." };
    }
}
