"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { requireAdmin, requireAuth } from "@/lib/auth";

export async function getUserOrders(options: { page?: number; limit?: number } = {}) {
    await requireAuth();
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id) return { orders: [], total: 0 };

    const user = await db.user.findUnique({
        where: { kindeId: kindeUser.id },
    });

    if (!user) return { orders: [], total: 0 };

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
        db.order.findMany({
            where: { userId: user.id },
            include: {
                orderItems: {
                    include: { product: { select: { name: true, images: true, slug: true } } },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit
        }),
        db.order.count({ where: { userId: user.id } })
    ]);

    const mappedOrders = orders.map((o) => ({
        ...o,
        total: Number(o.total),
        subtotal: Number(o.subtotal),
        tax: Number(o.tax),
        shipping: Number(o.shipping),
        items: o.orderItems.map((i) => ({
            ...i,
            price: Number(i.price),
        })),
    }));

    return { orders: mappedOrders, total };
}

export async function getOrderById(orderId: string) {
    const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
            User: { select: { email: true, firstName: true, lastName: true } },
            orderItems: {
                include: { product: { select: { name: true, images: true, slug: true } } },
            },
        },
    });

    if (!order) return null;

    return {
        ...order,
        total: Number(order.total),
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        shipping: Number(order.shipping),
        items: order.orderItems.map((i) => ({
            ...i,
            price: Number(i.price),
        })),
    };
}

export async function getAllOrders(options?: {
    status?: string;
    limit?: number;
}) {
    await requireAdmin();
    const where: Record<string, unknown> = {};

    if (options?.status && options.status !== "all") {
        where.status = options.status;
    }

    const orders = await db.order.findMany({
        where,
        include: {
            User: { select: { email: true, firstName: true, lastName: true } },
            _count: { select: { orderItems: true } },
        },
        orderBy: { createdAt: "desc" },
        take: options?.limit,
    });

    return orders.map((o) => ({
        ...o,
        total: Number(o.total),
        itemCount: o._count.orderItems,
    }));
}

export async function updateOrderStatus(
    orderId: string,
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
) {
    await requireAdmin();
    const order = await db.order.update({
        where: { id: orderId },
        data: { status },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/orders");
    return order;
}

export async function createOrder(data: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
}) {
    await requireAdmin();
    const order = await db.$transaction(async (tx) => {
        // Create order
        const newOrder = await tx.order.create({
            data: {
                userId: data.userId,
                subtotal: data.subtotal,
                tax: data.tax,
                shipping: data.shipping,
                total: data.total,
                status: "PENDING",
                orderItems: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });

        // Decrement stock and check for low inventory
        for (const item of data.items) {
            const product = await tx.product.update({
                where: { id: item.productId },
                data: {
                    stockQuantity: { decrement: item.quantity }
                }
            });

            if (product.stockQuantity <= 0) {
                // Trigger Alert (using create only since alert actions might not be in tx scope or simpler to just direct create)
                await tx.alert.create({
                    data: {
                        type: "Inventory Warning",
                        severity: "high",
                        message: `Product "${product.name}" is now out of stock!`,
                        isRead: false
                    }
                });
            } else if (product.stockQuantity <= product.lowStockThreshold) {
                await tx.alert.create({
                    data: {
                        type: "Low Stock Warning",
                        severity: "medium",
                        message: `Product "${product.name}" is running low (${product.stockQuantity} remaining).`,
                        isRead: false
                    }
                });
            }
        }

        return newOrder;
    });

    revalidatePath("/admin/orders");
    revalidatePath("/products");
    // revalidateTag("products"); // Removed due to type error and redundancy with revalidatePath
    return order;
}
