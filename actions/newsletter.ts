"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/mail";
import { requireAdmin } from "@/lib/auth";

export async function getNewsletterSubscribers(search?: string) {
    await requireAdmin();
    return db.newsletterSubscriber.findMany({
        orderBy: { createdAt: "desc" },
        where: search ? {
            email: { contains: search, mode: 'insensitive' }
        } : undefined,
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });
}

export async function updateSubscriberStatus(id: string, status: string) {
    await requireAdmin();
    await db.newsletterSubscriber.update({
        where: { id },
        data: { status }
    });
    revalidatePath("/admin/email");
}

export async function deleteSubscriber(id: string) {
    await requireAdmin();
    await db.newsletterSubscriber.delete({
        where: { id }
    });
    revalidatePath("/admin/email");
}

export async function bulkDeleteSubscribers(ids: string[]) {
    await requireAdmin();
    await db.newsletterSubscriber.deleteMany({
        where: { id: { in: ids } }
    });
    revalidatePath("/admin/email");
}

export async function bulkUpdateSubscriberStatus(ids: string[], status: string) {
    await requireAdmin();
    await db.newsletterSubscriber.updateMany({
        where: { id: { in: ids } },
        data: { status }
    });
    revalidatePath("/admin/email");
}

export async function sendCampaign(subject: string, content: string) {
    await requireAdmin();

    // Rate limiting: Check for recent campaigns (1 hour cooldown)
    const lastCampaign = await db.broadcast.findFirst({
        where: {
            type: "EMAIL",
            sentAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } // 1 hour
        },
        orderBy: { sentAt: "desc" }
    });

    if (lastCampaign) {
        const minutesRemaining = Math.ceil((lastCampaign.sentAt!.getTime() + 60 * 60 * 1000 - Date.now()) / 60000);
        return {
            success: false,
            message: `Rate limited: Wait ${minutesRemaining} minutes before sending another campaign`
        };
    }

    // Get all active subscribers
    const subscribers = await db.newsletterSubscriber.findMany({
        where: { status: "subscribed" },
        select: { email: true }
    });

    if (subscribers.length === 0) {
        return { success: false, message: "No active subscribers" };
    }

    const emails = subscribers.map(s => s.email);

    try {
        // Send to all subscribers (limit to 50 for demo)
        await sendEmail({
            to: emails.slice(0, 50),
            subject,
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    ${content.replace(/\n/g, '<br/>')}
                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
                    <p style="color: #666; font-size: 12px;">
                        You received this email because you're subscribed to SnowX updates.
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Unsubscribe</a>
                    </p>
                </div>
            `
        });

        // Log the broadcast
        await db.broadcast.create({
            data: {
                subject,
                message: content,
                type: "EMAIL",
                sentAt: new Date(),
                stats: {
                    sent: emails.length,
                    opened: 0
                }
            }
        });

        revalidatePath("/admin/email");
        revalidatePath("/admin/broadcasts");

        return { success: true, message: `Sent to ${emails.length} subscribers` };
    } catch (error) {
        console.error("Campaign send error:", error);
        return { success: false, message: "Failed to send campaign" };
    }
}

export async function getCampaignHistory() {
    await requireAdmin();
    return db.broadcast.findMany({
        where: { type: "EMAIL" },
        orderBy: { createdAt: "desc" },
        take: 20
    });
}

