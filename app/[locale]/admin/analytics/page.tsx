import { db } from "@/lib/db";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { formatPrice } from "@/lib/utils";
import { redis } from "@/lib/redis"; // Import Redis
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
}

// Helper to fetch data with caching
async function getAnalyticsData(): Promise<AnalyticsData> {
    const CACHE_KEY = "analytics:dashboard-stats";

    // 1. Try Cache
    try {
        const cached = await redis.get(CACHE_KEY);
        if (cached) {
            console.log("Serving Analytics from Redis Cache");
            return cached as AnalyticsData;
        }
    } catch (e) {
        console.warn("Redis fetch failed:", e);
    }

    // 2. Fetch from DB if no cache
    const totalRevenueResult = await db.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } }
    });
    const totalRevenue = Number(totalRevenueResult._sum.total || 0);

    const totalOrders = await db.order.count({
        where: { status: { not: 'CANCELLED' } }
    });

    const totalUsers = await db.user.count({
        where: { role: 'CUSTOMER' }
    });

    const averageOrderValue = totalOrders > 0
        ? totalRevenue / totalOrders
        : 0;

    // Revenue Trends (Last 7 days)
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
        if (revenueMap.has(date)) {
            revenueMap.set(date, (revenueMap.get(date) || 0) + Number(order.total));
        }
    });

    const revenueData = Array.from(revenueMap.entries()).map(([date, amount]) => ({
        date: date.split('/')[0] + '/' + date.split('/')[1], // Simple MM/DD
        amount
    }));

    // User Growth (Last 7 days)
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

    const data = {
        totalRevenue,
        totalOrders,
        totalUsers,
        averageOrderValue,
        revenueData,
        usersData
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
        usersData
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
            <AnalyticsCharts revenueData={revenueData} usersData={usersData} />
        </div>
    );
}
