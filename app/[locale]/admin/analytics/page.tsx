import { db } from "@/lib/db";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { formatPrice } from "@/lib/utils";
import {
    TrendingUp,
    Users,
    ShoppingCart,
    CreditCard
} from "lucide-react";

export default async function AnalyticsPage() {
    // 1. Fetch Key Metrics
    const totalRevenue = await db.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } }
    });

    const totalOrders = await db.order.count({
        where: { status: { not: 'CANCELLED' } }
    });

    const totalUsers = await db.user.count({
        where: { role: 'CUSTOMER' }
    });

    const averageOrderValue = totalOrders > 0
        ? Number(totalRevenue._sum.total) / totalOrders
        : 0;

    // 2. Fetch Revenue Trends (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await db.order.findMany({
        where: {
            createdAt: { gte: sevenDaysAgo },
            status: { not: 'CANCELLED' }
        },
        select: {
            createdAt: true,
            total: true
        },
        orderBy: { createdAt: 'asc' }
    });

    // Group by Date for Chart
    const revenueMap = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        revenueMap.set(d.toLocaleDateString(), 0);
    }

    recentOrders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString();
        // Simple aggregation - typically depends on locale format matches map keys
        // Ideally use a library like 'date-fns' to normalize
        if (revenueMap.has(date)) {
            revenueMap.set(date, (revenueMap.get(date) || 0) + Number(order.total));
        }
    });

    const revenueData = Array.from(revenueMap.entries()).map(([date, amount]) => ({
        date: date.split('/')[0] + '/' + date.split('/')[1], // Simple MM/DD
        amount
    }));

    // 3. Fetch User Growth (Last 7 days)
    const recentUsers = await db.user.findMany({
        where: {
            createdAt: { gte: sevenDaysAgo }
        },
        select: { createdAt: true }
    });

    const usersMap = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        usersMap.set(d.toLocaleDateString(), 0);
    }

    recentUsers.forEach(user => {
        const date = new Date(user.createdAt).toLocaleDateString();
        if (usersMap.has(date)) {
            usersMap.set(date, (usersMap.get(date) || 0) + 1);
        }
    });

    const usersData = Array.from(usersMap.entries()).map(([date, users]) => ({
        date: date.split('/')[0] + '/' + date.split('/')[1],
        users
    }));

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Analytics</h2>
                <p className="text-gray-400 mt-2">Business performance and growth metrics</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">Total Revenue</span>
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                            <CreditCard className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                        {formatPrice(Number(totalRevenue._sum.total || 0))}
                    </p>
                </div>

                <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">Total Orders</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <ShoppingCart className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                        {totalOrders}
                    </p>
                </div>

                <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">Active Users</span>
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                        {totalUsers}
                    </p>
                </div>

                <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">Avg. Order Value</span>
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                        {formatPrice(averageOrderValue)}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <AnalyticsCharts revenueData={revenueData} usersData={usersData} />
        </div>
    );
}
