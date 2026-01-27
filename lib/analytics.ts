"use server";

import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export interface ChartData {
    revenueData: { date: string; amount: number }[];
    usersData: { date: string; users: number }[];
}

/**
 * Get chart data for both revenue and user growth for the last 7 days.
 * This is the single source of truth for all admin charts.
 */
export async function getChartData(): Promise<ChartData> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get orders for last 7 days
    const [recentOrders, recentUsers] = await Promise.all([
        db.order.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo },
                status: { not: OrderStatus.CANCELLED }
            },
            select: {
                createdAt: true,
                total: true
            },
            orderBy: { createdAt: 'asc' }
        }),
        db.user.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo }
            },
            select: { createdAt: true }
        })
    ]);

    // Initialize maps with last 7 days (in order)
    const revenueMap = new Map<string, number>();
    const usersMap = new Map<string, number>();

    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dayName = dayNames[d.getDay()];
        revenueMap.set(dayName, 0);
        usersMap.set(dayName, 0);
    }

    // Aggregate revenue by day
    recentOrders.forEach(order => {
        const day = dayNames[new Date(order.createdAt).getDay()];
        if (revenueMap.has(day)) {
            revenueMap.set(day, (revenueMap.get(day) || 0) + Number(order.total));
        }
    });

    // Aggregate users by day
    recentUsers.forEach(user => {
        const day = dayNames[new Date(user.createdAt).getDay()];
        if (usersMap.has(day)) {
            usersMap.set(day, (usersMap.get(day) || 0) + 1);
        }
    });

    // Convert to arrays
    const revenueData = Array.from(revenueMap.entries()).map(([date, amount]) => ({
        date,
        amount
    }));

    const usersData = Array.from(usersMap.entries()).map(([date, users]) => ({
        date,
        users
    }));

    return { revenueData, usersData };
}

export async function getSalesByCategory() {
    const data = await db.orderItem.findMany({
        where: { order: { status: { not: OrderStatus.CANCELLED } } },
        include: {
            product: {
                include: { category: true }
            }
        }
    });

    const map = new Map<string, number>();

    data.forEach(item => {
        const catName = item.product.category.name;
        const amount = Number(item.price) * item.quantity;
        map.set(catName, (map.get(catName) || 0) + amount);
    });

    return Array.from(map.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
}

export async function getSalesByPlatform() {
    const data = await db.orderItem.findMany({
        where: { order: { status: { not: OrderStatus.CANCELLED } } },
        include: {
            product: {
                include: { platformOption: true }
            }
        }
    });

    const map = new Map<string, number>();
    // Also track legacy string platforms if any, or normalize them
    // For now we trust migration or fallback to "Other"

    data.forEach(item => {
        let platformName = item.product.platformOption?.label || item.product.platformOption?.value;
        if (!platformName && item.product.platform) {
            platformName = item.product.platform; // Legacy fallback
        }
        if (!platformName) platformName = "Other";

        const amount = Number(item.price) * item.quantity;
        map.set(platformName, (map.get(platformName) || 0) + amount);
    });

    return Array.from(map.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
}

export async function getTopProducts(limit = 5) {
    const grouped = await db.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        where: { order: { status: { not: OrderStatus.CANCELLED } } },
        orderBy: { _sum: { quantity: 'desc' } },
        take: limit
    });

    const productIds = grouped.map(g => g.productId);
    const products = await db.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, price: true }
    });

    return grouped.map(g => {
        const p = products.find(prod => prod.id === g.productId);
        return {
            name: p?.name || 'Unknown',
            sales: g._sum.quantity || 0,
            price: Number(p?.price || 0)
        };
    });
}

export async function getRecentOrders(limit = 5) {
    const orders = await db.order.findMany({
        where: { status: { not: OrderStatus.CANCELLED } },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            User: { select: { firstName: true, lastName: true, email: true } }
        }
    });

    return orders.map(order => ({
        ...order,
        total: Number(order.total),
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        shipping: Number(order.shipping)
    }));
}
