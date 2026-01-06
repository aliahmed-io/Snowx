import { getAllOrders } from "@/actions/orders";
import Link from "next/link";

export const metadata = {
    title: "Orders | Admin | SnowX",
};

export default async function AdminOrdersPage() {
    const orders = await getAllOrders();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                    <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-400">No orders yet</p>
                </div>
            ) : (
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-500 text-sm border-b border-white/10 bg-white/5">
                                <th className="p-4 font-medium">Order</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Items</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-white hover:text-snow-accent transition-colors font-medium"
                                        >
                                            #{order.orderNumber.slice(0, 8)}
                                        </Link>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <p className="text-white">
                                                {order.user.firstName} {order.user.lastName}
                                            </p>
                                            <p className="text-gray-500 text-sm">{order.user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400">{order.itemCount} items</td>
                                    <td className="p-4">
                                        <OrderStatusBadge status={order.status} />
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-white font-medium text-right">
                                        ${order.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
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
