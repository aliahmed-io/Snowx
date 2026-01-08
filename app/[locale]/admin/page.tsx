import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { StatsCard } from "@/components/admin/StatsCard";
import { SystemHealth } from "@/components/admin/SystemHealth";
import { RecentSales } from "@/components/admin/RecentSales";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import {
    CreditCard,
    Users,
    Package,
    DollarSign,
    AlertTriangle
} from "lucide-react";
import { OrderStatus, Order, User } from "@prisma/client";

async function getStats() {
    // 1. Parallel data fetching
    const [
        orderStats,
        userCount,
        productStats,
        recentOrders,
        revenueByDay
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
        // Revenue Graph Data
        db.dailyStat.findMany({
            take: 7,
            orderBy: { date: 'asc' }
        })
    ]);

    // Format graph data
    const revenueData = revenueByDay.length > 0
        ? revenueByDay.map(d => ({ date: d.date.toISOString().split('T')[0], amount: Number(d.totalRevenue) }))
        : [ // Placeholder if no daily stats exist yet
            { date: 'Mon', amount: 0 },
            { date: 'Tue', amount: 0 },
            { date: 'Wed', amount: 0 },
            { date: 'Thu', amount: 0 },
            { date: 'Fri', amount: 0 },
            { date: 'Sat', amount: 0 },
            { date: 'Sun', amount: 0 },
        ];

    // Placeholder User Growth
    const usersData = [
        { date: 'Mon', users: 4 },
        { date: 'Tue', users: 3 },
        { date: 'Wed', users: 7 },
        { date: 'Thu', users: 2 },
        { date: 'Fri', users: 5 },
        { date: 'Sat', users: 8 },
        { date: 'Sun', users: 6 },
    ];

    return {
        totalSales: orderStats._count.id,
        totalRevenue: Number(orderStats._sum.total || 0),
        totalUsers: userCount,
        totalProducts: productStats,
        recentOrders,
        revenueData,
        usersData
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <SystemHealth />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={formatPrice(stats.totalRevenue)}
                    icon={DollarSign}
                    description="Based on all charges"
                    trend={{ value: 12, label: "vs last week", positive: true }}
                />
                <StatsCard
                    title="Total Sales"
                    value={stats.totalSales}
                    icon={CreditCard}
                    description="Total Completed Sales"
                    trend={{ value: 8, label: "vs last week", positive: true }}
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
                    trend={{ value: 2, label: "new users", positive: true }}
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
