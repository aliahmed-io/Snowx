"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function getAdminStats() {
    await requireAdmin();

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
    await requireAdmin();
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

    return customers.map((c: typeof customers[number]) => ({
        id: c.id,
        email: c.email,
        firstName: c.firstName,
        lastName: c.lastName,
        profileImage: c.profileImage,
        createdAt: c.createdAt,
        orderCount: c._count.orders,
        totalSpent: c.orders.reduce((acc: number, o: typeof c.orders[number]) => acc + Number(o.total), 0),
    }));
}
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    await requireAdmin();
    await db.order.update({
        where: { id: orderId },
        data: { status }
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/admin/orders`);
}
// ... existing code ...

export async function getCustomerById(id: string) {
    await requireAdmin();
    const customer = await db.user.findUnique({
        where: { id, role: "CUSTOMER" },
        include: {
            orders: {
                orderBy: { createdAt: "desc" },
                include: {
                    _count: { select: { orderItems: true } }
                }
            },
            addresses: {
                where: { isDefault: true }
            },
            _count: {
                select: { orders: true, reviews: true }
            }
        }
    });

    if (!customer) return null;

    const totalSpent = customer.orders.reduce((acc, order) => {
        return order.status !== "CANCELLED" ? acc + Number(order.total) : acc;
    }, 0);

    return {
        ...customer,
        totalSpent,
        address: customer.addresses[0] || null
    };
}
