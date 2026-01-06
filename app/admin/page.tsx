import { getAdminStats } from "@/actions/admin";
import Link from "next/link";

export const metadata = {
    title: "Admin Dashboard | SnowX",
};

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                    icon="revenue"
                    color="green"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.orders.toString()}
                    icon="orders"
                    color="blue"
                />
                <StatCard
                    title="Total Customers"
                    value={stats.customers.toString()}
                    icon="customers"
                    color="purple"
                />
                <StatCard
                    title="Active Products"
                    value={stats.products.toString()}
                    icon="products"
                    color="orange"
                />
            </div>

            {/* Orders by Status */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Orders by Status</h2>
                    <div className="space-y-3">
                        {[
                            { status: "PENDING", label: "Pending", color: "yellow" },
                            { status: "PROCESSING", label: "Processing", color: "blue" },
                            { status: "SHIPPED", label: "Shipped", color: "purple" },
                            { status: "DELIVERED", label: "Delivered", color: "green" },
                            { status: "CANCELLED", label: "Cancelled", color: "red" },
                        ].map((item) => (
                            <div key={item.status} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                                    <span className="text-gray-400">{item.label}</span>
                                </div>
                                <span className="text-white font-medium">
                                    {stats.ordersByStatus[item.status] || 0}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/admin/products/new"
                            className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-center"
                        >
                            <svg className="w-8 h-8 text-snow-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-white text-sm font-medium">Add Product</span>
                        </Link>
                        <Link
                            href="/admin/categories"
                            className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-center"
                        >
                            <svg className="w-8 h-8 text-snow-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="text-white text-sm font-medium">Categories</span>
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-center"
                        >
                            <svg className="w-8 h-8 text-snow-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="text-white text-sm font-medium">View Orders</span>
                        </Link>
                        <Link
                            href="/admin/customers"
                            className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-center"
                        >
                            <svg className="w-8 h-8 text-snow-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-white text-sm font-medium">Customers</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-snow-accent hover:underline text-sm">
                        View all
                    </Link>
                </div>

                {stats.recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No orders yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 text-sm border-b border-white/10">
                                    <th className="pb-3 font-medium">Order</th>
                                    <th className="pb-3 font-medium">Customer</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-white/5">
                                        <td className="py-3">
                                            <Link href={`/admin/orders/${order.id}`} className="text-white hover:text-snow-accent transition-colors">
                                                #{order.orderNumber.slice(0, 8)}
                                            </Link>
                                        </td>
                                        <td className="py-3 text-gray-400">
                                            {order.user.firstName} {order.user.lastName}
                                        </td>
                                        <td className="py-3">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="py-3 text-white text-right font-medium">
                                            ${order.total.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    color,
}: {
    title: string;
    value: string;
    icon: string;
    color: "green" | "blue" | "purple" | "orange";
}) {
    const colorClasses = {
        green: "from-green-500/20 to-emerald-500/20 text-green-400",
        blue: "from-blue-500/20 to-cyan-500/20 text-blue-400",
        purple: "from-purple-500/20 to-pink-500/20 text-purple-400",
        orange: "from-orange-500/20 to-amber-500/20 text-orange-400",
    };

    const icons: Record<string, React.ReactNode> = {
        revenue: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        orders: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        customers: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        products: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    };

    return (
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
                    {icons[icon]}
                </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    );
}

function OrderStatusBadge({ status }: { status: string }) {
    const statusStyles: Record<string, string> = {
        PENDING: "bg-yellow-500/20 text-yellow-400",
        PROCESSING: "bg-blue-500/20 text-blue-400",
        SHIPPED: "bg-purple-500/20 text-purple-400",
        DELIVERED: "bg-green-500/20 text-green-400",
        CANCELLED: "bg-red-500/20 text-red-400",
        REFUNDED: "bg-gray-500/20 text-gray-400",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.PENDING}`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
}
