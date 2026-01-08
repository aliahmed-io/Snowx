"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getUserOrders() {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id) return [];

    const user = await db.user.findUnique({
        where: { kindeId: kindeUser.id },
    });

    if (!user) return [];

    const orders = await db.order.findMany({
        where: { userId: user.id },
        include: {
            orderItems: {
                include: { product: { select: { name: true, images: true, slug: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return orders.map((o) => ({
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
    stripePaymentId?: string;
}) {
    const order = await db.order.create({
        data: {
            userId: data.userId,
            subtotal: data.subtotal,
            tax: data.tax,
            shipping: data.shipping,
            total: data.total,
            orderItems: {
                create: data.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
    });

    revalidatePath("/admin/orders");
    return order;
}
