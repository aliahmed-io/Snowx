import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { getChartData } from "@/lib/analytics";
import { StatsCard } from "@/components/admin/StatsCard";
import { SystemHealth } from "@/components/admin/SystemHealth";
import { RecentSales } from "@/components/admin/RecentSales";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import {
    Users,
    DollarSign,
    Package,
    CreditCard
} from "lucide-react";
import { OrderStatus, Order, User } from "@prisma/client";

async function getStats() {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Parallel data fetching
    const [
        orderStats,
        userCount,
        productStats,
        recentOrders,
        chartData,
        // This week's data
        thisWeekRevenue,
        thisWeekSales,
        thisWeekUsers,
        // Last week's data
        lastWeekRevenue,
        lastWeekSales,
        lastWeekUsers
    ] = await Promise.all([
        // Order Stats (Total count and Revenue)
        db.order.aggregate({
            _count: { id: true },
            _sum: { total: true },
            where: { status: { not: OrderStatus.CANCELLED } }
        }),
        // User Count
        db.user.count(),
        // Active Products
        db.product.count({
            where: { isActive: true }
        }),
        // Recent Orders
        db.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { User: true },
            where: { status: { not: OrderStatus.PENDING } }
        }) as Promise<(Order & { User: User | null })[]>,
        // Chart data from shared utility
        getChartData(),
        // This week's revenue
        db.order.aggregate({
            _sum: { total: true },
            where: {
                status: { not: OrderStatus.CANCELLED },
                createdAt: { gte: oneWeekAgo }
            }
        }),
        // This week's sales count
        db.order.count({
            where: {
                status: { not: OrderStatus.CANCELLED },
                createdAt: { gte: oneWeekAgo }
            }
        }),
        // This week's new users
        db.user.count({
            where: { createdAt: { gte: oneWeekAgo } }
        }),
        // Last week's revenue
        db.order.aggregate({
            _sum: { total: true },
            where: {
                status: { not: OrderStatus.CANCELLED },
                createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo }
            }
        }),
        // Last week's sales count
        db.order.count({
            where: {
                status: { not: OrderStatus.CANCELLED },
                createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo }
            }
        }),
        // Last week's new users
        db.user.count({
            where: { createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } }
        })
    ]);

    // Calculate percentage changes
    const thisWeekRevenueVal = Number(thisWeekRevenue._sum.total || 0);
    const lastWeekRevenueVal = Number(lastWeekRevenue._sum.total || 0);
    const revenueChange = lastWeekRevenueVal > 0
        ? Math.round(((thisWeekRevenueVal - lastWeekRevenueVal) / lastWeekRevenueVal) * 100)
        : (thisWeekRevenueVal > 0 ? 100 : 0);

    const salesChange = lastWeekSales > 0
        ? Math.round(((thisWeekSales - lastWeekSales) / lastWeekSales) * 100)
        : (thisWeekSales > 0 ? 100 : 0);

    const userChange = lastWeekUsers > 0
        ? Math.round(((thisWeekUsers - lastWeekUsers) / lastWeekUsers) * 100)
        : thisWeekUsers; // Show absolute count if no last week users

    return {
        totalSales: orderStats._count.id,
        totalRevenue: Number(orderStats._sum.total || 0),
        weeklyRevenue: thisWeekRevenueVal,
        totalUsers: userCount,
        totalProducts: productStats,
        recentOrders,
        revenueData: chartData.revenueData,
        usersData: chartData.usersData,
        // Trend data
        revenueChange,
        salesChange,
        thisWeekUsers,
        userChange
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <AutoRefresh intervalMs={30000} />
            <SystemHealth />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Weekly Revenue"
                    value={formatPrice(stats.weeklyRevenue)}
                    icon={DollarSign}
                    description="Revenue this week"
                    trend={stats.revenueChange !== 0 ? {
                        value: Math.abs(stats.revenueChange),
                        label: "vs last week",
                        positive: stats.revenueChange >= 0
                    } : undefined}
                />
                <StatsCard
                    title="Total Sales"
                    value={stats.totalSales}
                    icon={CreditCard}
                    description="Total Completed Sales"
                    trend={stats.salesChange !== 0 ? {
                        value: Math.abs(stats.salesChange),
                        label: "vs last week",
                        positive: stats.salesChange >= 0
                    } : undefined}
                />
                <StatsCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    description="Total Products created"
                />
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    description="Total Users Signed Up"
                    trend={stats.thisWeekUsers > 0 ? {
                        value: stats.thisWeekUsers,
                        label: "new this week",
                        positive: true
                    } : undefined}
                />
            </div>

            {/* Main Content Split: Charts (Left) & Recent Sales (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Charts Area - Takes 2 cols */}
                <div className="lg:col-span-2 space-y-8">
                    <AnalyticsCharts revenueData={stats.revenueData} usersData={stats.usersData} />
                </div>

                {/* Recent Sales Sidebar - Takes 1 col */}
                <div className="lg:col-span-1">
                    <RecentSales orders={stats.recentOrders} />
                </div>
            </div>
        </div>
    );
}

