"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
        await db.contact.create({
            data: {
                name: validatedFields.data.name,
                email: validatedFields.data.email,
                subject: validatedFields.data.subject,
                message: validatedFields.data.message,
            },
        });

        revalidatePath("/admin/contact");
        return { success: "Message sent successfully! We'll get back to you soon." };
    } catch (error) {
        console.error("Contact form error:", error);
        return { error: "Failed to send message. Please try again later." };
    }
}
