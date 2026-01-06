import { db } from "@/lib/db";
import { formatPrice, cn } from "@/lib/utils";
import { StatsCard } from "@/components/admin/StatsCard";
import {
    CreditCard,
    Users,
    Package,
    DollarSign,
    AlertTriangle,
    Activity
} from "lucide-react";
import { OrderStatus } from "@prisma/client";

async function getStats() {
    // Parallel data fetching
    const [
        orderStats,
        userCount,
        productStats,
        recentOrders
    ] = await Promise.all([
        // Order Stats (Total count and Revenue)
        db.order.aggregate({
            _count: { id: true },
            _sum: { total: true },
            where: { status: OrderStatus.DELIVERED } // Using DELIVERED as 'Completed'
        }),
        // User Count
        db.user.count(),
        // Active Stock (Sum of inventory)
        db.product.aggregate({
            _sum: { inventory: true },
            where: { isActive: true }
        }),
        // Recent Orders
        db.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true },
            where: { status: { not: OrderStatus.PENDING } }
        })
    ]);

    return {
        totalSales: orderStats._count.id,
        totalRevenue: Number(orderStats._sum.total || 0),
        totalUsers: userCount,
        activeStock: productStats._sum.inventory || 0,
        recentOrders
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
                <p className="text-gray-400 mt-2">Overview of your store's performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={formatPrice(stats.totalRevenue)}
                    icon={DollarSign}
                    description="Lifetime revenue"
                />
                <StatsCard
                    title="Total Sales"
                    value={stats.totalSales}
                    icon={CreditCard}
                    description="Completed orders"
                />
                <StatsCard
                    title="Active Users"
                    value={stats.totalUsers}
                    icon={Users}
                    description="Registered accounts"
                />
                <StatsCard
                    title="Active Stock"
                    value={stats.activeStock}
                    icon={Package}
                    description="Available products"
                    trend={stats.activeStock < 10 ? { value: 0, label: "Low Stock", positive: false } : undefined}
                />
            </div>

            {/* Alerts Section */}
            {stats.activeStock < 10 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                        <p className="font-semibold">Low Stock Warning</p>
                        <p className="text-sm opacity-90">Total active stock is below 10 items. Please restock soon.</p>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-snow-primary/20 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-snow-accent" />
                        Recent Orders
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-snow-primary/10">
                            {stats.recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No recent orders found
                                    </td>
                                </tr>
                            ) : (
                                stats.recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-white">#{order.orderNumber.slice(-6)}</td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            {order.user.profileImage ? (
                                                <img src={order.user.profileImage} alt="" className="w-6 h-6 rounded-full" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-snow-accent/20" />
                                            )}
                                            {order.user.firstName || order.user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                order.status === OrderStatus.DELIVERED ? "bg-green-500/10 text-green-400" :
                                                    order.status === OrderStatus.PENDING ? "bg-yellow-500/10 text-yellow-400" :
                                                        "bg-gray-500/10 text-gray-400"
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white">{formatPrice(Number(order.total))}</td>
                                        <td className="px-6 py-4">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
