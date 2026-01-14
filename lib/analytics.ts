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
