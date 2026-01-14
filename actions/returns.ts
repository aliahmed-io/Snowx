"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function getReturnRequests(search?: string) {
    await requireAdmin();
    return db.returnRequest.findMany({
        orderBy: { createdAt: "desc" },
        where: search ? {
            OR: [
                { order: { orderNumber: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { reason: { contains: search, mode: 'insensitive' } }
            ]
        } : undefined,
        include: {
            order: {
                select: {
                    orderNumber: true,
                    total: true
                }
            },
            user: {
                select: {
                    email: true,
                    firstName: true,
                    lastName: true
                }
            }
        }
    });
}

export async function getReturnRequest(id: string) {
    await requireAdmin();
    return db.returnRequest.findUnique({
        where: { id },
        include: {
            order: {
                select: {
                    orderNumber: true,
                    total: true,
                    orderItems: {
                        include: {
                            product: {
                                select: { name: true, images: true }
                            }
                        }
                    }
                }
            },
            user: {
                select: {
                    email: true,
                    firstName: true,
                    lastName: true
                }
            }
        }
    });
}

export async function approveReturnRequest(id: string) {
    await requireAdmin();
    const returnRequest = await db.returnRequest.findUnique({
        where: { id },
        include: { order: true }
    });

    if (!returnRequest) {
        throw new Error("Return request not found");
    }

    // Update the return request status
    await db.returnRequest.update({
        where: { id },
        data: {
            status: "APPROVED",
            refundAmount: returnRequest.order.total
        }
    });

    // Log the action
    await db.auditLog.create({
        data: {
            action: "RETURN_APPROVED",
            targetType: "RETURN",
            targetId: id,
            metadata: {
                orderId: returnRequest.orderId,
                refundAmount: Number(returnRequest.order.total)
            }
        }
    });

    revalidatePath("/admin/returns");
    return { success: true };
}

export async function rejectReturnRequest(id: string, reason?: string) {
    await requireAdmin();
    const returnRequest = await db.returnRequest.findUnique({
        where: { id }
    });

    if (!returnRequest) {
        throw new Error("Return request not found");
    }

    await db.returnRequest.update({
        where: { id },
        data: { status: "REJECTED" }
    });

    // Log the action
    await db.auditLog.create({
        data: {
            action: "RETURN_REJECTED",
            targetType: "RETURN",
            targetId: id,
            metadata: { reason: reason || "No reason provided" }
        }
    });

    revalidatePath("/admin/returns");
    return { success: true };
}

export async function processRefund(id: string) {
    await requireAdmin();
    const returnRequest = await db.returnRequest.findUnique({
        where: { id },
        include: { order: true }
    });

    if (!returnRequest) {
        throw new Error("Return request not found");
    }

    if (returnRequest.status !== "APPROVED") {
        throw new Error("Return request must be approved before processing refund");
    }

    // Update return request status
    await db.returnRequest.update({
        where: { id },
        data: { status: "REFUNDED" }
    });

    // Update order status
    await db.order.update({
        where: { id: returnRequest.orderId },
        data: { status: "REFUNDED" }
    });

    // Log the action
    await db.auditLog.create({
        data: {
            action: "REFUND_PROCESSED",
            targetType: "ORDER",
            targetId: returnRequest.orderId,
            metadata: {
                returnRequestId: id,
                refundAmount: Number(returnRequest.order.total)
            }
        }
    });

    revalidatePath("/admin/returns");
    revalidatePath("/admin/orders");
    return { success: true };
}

