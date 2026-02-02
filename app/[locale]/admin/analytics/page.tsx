import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { RecentOrdersTable } from "@/components/admin/RecentOrdersTable";
import { formatPrice } from "@/lib/utils";
import { getChartData, getSalesByCategory, getSalesByPlatform, getTopProducts, getRecentOrders } from "@/lib/analytics";
import { redis } from "@/lib/redis";
import {
    TrendingUp,
    Users,
    ShoppingCart,
    CreditCard
} from "lucide-react";

interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    averageOrderValue: number;
    revenueData: { date: string; amount: number }[];
    usersData: { date: string; users: number }[];
    salesByCategory: { name: string; value: number }[];
    salesByPlatform: { name: string; value: number }[];
    topProducts: { name: string; sales: number; price: number }[];
    recentOrders: any[];
}

// Helper to fetch data with caching
async function getAnalyticsData(): Promise<AnalyticsData> {
    const CACHE_KEY = "analytics:dashboard-stats-v3";

    // 1. Try Cache
    try {
        const cached = await redis.get(CACHE_KEY);
        if (cached) {
            return cached as AnalyticsData;
        }
    } catch (e) {
        console.warn("Redis fetch failed:", e);
    }

    // 2. Fetch from DB if no cache
    const [orderAggregates, totalOrders, totalUsers, chartData, salesByCategory, salesByPlatform, topProducts, recentOrders] = await Promise.all([
        db.order.aggregate({
            _sum: { total: true },
            where: { status: { not: 'CANCELLED' } }
        }),
        db.order.count({
            where: { status: { not: 'CANCELLED' } }
        }),
        db.user.count(),
        getChartData(),
        getSalesByCategory(),
        getSalesByPlatform(),
        getTopProducts(),
        getRecentOrders(10)
    ]);

    const totalRevenue = Number(orderAggregates._sum.total || 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const data = {
        totalRevenue,
        totalOrders,
        totalUsers,
        averageOrderValue,
        revenueData: chartData.revenueData,
        usersData: chartData.usersData,
        salesByCategory,
        salesByPlatform,
        topProducts,
        recentOrders
    };

    // 3. Set Cache (Expire in 60 seconds)
    try {
        await redis.set(CACHE_KEY, data, { ex: 60 });
    } catch (e) {
        console.warn("Redis set failed:", e);
    }

    return data;
}

export default async function AnalyticsPage() {
    const {
        totalRevenue,
        totalOrders,
        totalUsers,
        averageOrderValue,
        revenueData,
        usersData,
        salesByCategory,
        salesByPlatform,
        topProducts,
        recentOrders
    } = await getAnalyticsData();

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
                        {formatPrice(totalRevenue)}
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
            <AnalyticsCharts
                revenueData={revenueData}
                usersData={usersData}
                salesByCategory={salesByCategory}
                salesByPlatform={salesByPlatform}
                topProducts={topProducts}
            />

            {/* Recent Orders Table */}
            <RecentOrdersTable orders={recentOrders} />
        </div>
    );
}
