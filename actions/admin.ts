"use server";

import { db } from "@/lib/db";

export async function getAdminStats() {
    const [
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        recentOrders,
        ordersByStatus,
    ] = await Promise.all([
        // Total revenue
        db.order.aggregate({
            where: { status: { not: "CANCELLED" } },
            _sum: { total: true },
        }),
        // Total orders
        db.order.count(),
        // Total customers
        db.user.count({ where: { role: "CUSTOMER" } }),
        // Total products
        db.product.count({ where: { isActive: true } }),
        // Recent orders
        db.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                User: { select: { email: true, firstName: true, lastName: true } },
            },
        }),
        // Orders by status
        db.order.groupBy({
            by: ["status"],
            _count: true,
        }),
    ]);

    return {
        revenue: Number(totalRevenue._sum.total || 0),
        orders: totalOrders,
        customers: totalCustomers,
        products: totalProducts,
        recentOrders: recentOrders.map((o: typeof recentOrders[number]) => ({
            ...o,
            total: Number(o.total),
        })),
        ordersByStatus: ordersByStatus.reduce(
            (acc: Record<string, number>, item: typeof ordersByStatus[number]) => {
                acc[item.status] = item._count;
                return acc;
            },
            {} as Record<string, number>
        ),
    };
}

export async function getCustomers(options?: { limit?: number }) {
    const customers = await db.user.findMany({
        where: { role: "CUSTOMER" },
        include: {
            _count: { select: { orders: true } },
            orders: {
                select: { total: true },
                where: { status: { not: "CANCELLED" } },
            },
        },
        orderBy: { createdAt: "desc" },
        take: options?.limit,
    });

    return customers.map((c) => ({
        id: c.id,
        email: c.email,
        firstName: c.firstName,
        lastName: c.lastName,
        profileImage: c.profileImage,
        createdAt: c.createdAt,
        orderCount: c._count.orders,
        totalSpent: c.orders.reduce((acc, o) => acc + Number(o.total), 0),
    }));
}
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    await db.order.update({
        where: { id: orderId },
        data: { status }
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/admin/orders`);
}
