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
        const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || ["ali.ahmed.2001@outlook.com"];
        await sendEmail({
            to: adminEmails,
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

// Admin functions for managing contacts
import { requireAdmin } from "@/lib/auth";

export async function getContacts(search?: string) {
    await requireAdmin();
    return db.contact.findMany({
        orderBy: { createdAt: "desc" },
        where: search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } }
            ]
        } : undefined
    });
}

export async function updateContactStatus(id: string, status: "PENDING" | "COMPLETED" | "IGNORED") {
    await requireAdmin();
    await db.contact.update({
        where: { id },
        data: { status, isRead: true }
    });
    revalidatePath("/admin/contact");
}

export async function markContactAsRead(id: string) {
    await requireAdmin();
    await db.contact.update({
        where: { id },
        data: { isRead: true }
    });
    revalidatePath("/admin/contact");
}

export async function deleteContact(id: string) {
    await requireAdmin();
    await db.contact.delete({
        where: { id }
    });
    revalidatePath("/admin/contact");
}

export async function bulkDeleteContacts(ids: string[]) {
    await requireAdmin();
    await db.contact.deleteMany({
        where: { id: { in: ids } }
    });
    revalidatePath("/admin/contact");
}

export async function bulkUpdateContactStatus(ids: string[], status: "PENDING" | "COMPLETED" | "IGNORED") {
    await requireAdmin();
    await db.contact.updateMany({
        where: { id: { in: ids } },
        data: { status, isRead: true }
    });
    revalidatePath("/admin/contact");
}

export async function replyToContact(id: string, replyMessage: string) {
    await requireAdmin();
    const contact = await db.contact.findUnique({ where: { id } });

    if (!contact) {
        throw new Error("Contact not found");
    }

    // Send reply email
    await sendEmail({
        to: contact.email,
        subject: `Re: ${contact.subject}`,
        html: `
            <p>Hi ${contact.name},</p>
            <br/>
            <p>${replyMessage.replace(/\n/g, '<br/>')}</p>
            <br/>
            <p>Best regards,<br/>SnowX Team</p>
            <hr/>
            <p style="color: #666; font-size: 12px;">Original message: ${contact.message}</p>
        `
    });

    // Update status
    await db.contact.update({
        where: { id },
        data: { status: "COMPLETED", isRead: true }
    });

    revalidatePath("/admin/contact");
    return { success: true };
}


