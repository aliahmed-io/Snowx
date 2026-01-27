import { db } from "@/lib/db";
import { formatPrice, cn } from "@/lib/utils";
import { Link } from "@/navigation";
import Image from "next/image";
import { Prisma, OrderStatus } from "@prisma/client";
import {
    Search,
    Eye
} from "lucide-react";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";

interface OrdersPageProps {
    searchParams: Promise<{
        status?: string;
        page?: string;
        search?: string;
    }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const { status: statusParam, search } = await searchParams;
    const status = statusParam as OrderStatus | undefined;

    // Build where clause
    const where: Prisma.OrderWhereInput = {};
    if (status) {
        where.status = status;
    }
    if (search) {
        where.OR = [
            { orderNumber: { contains: search, mode: 'insensitive' } },
            { User: { email: { contains: search, mode: 'insensitive' } } }
        ];
    }

    const orders = await db.order.findMany({
        where,
        include: {
            User: true,
            _count: { select: { orderItems: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50 // Limit for now
    });

    const statusLabels: Record<string, string> = {
        [OrderStatus.PENDING]: "Pending",
        [OrderStatus.PROCESSING]: "Processing",
        [OrderStatus.DELIVERED]: "Completed",
        [OrderStatus.CANCELLED]: "Cancelled",
        [OrderStatus.REFUNDED]: "Refunded",
    };

    const displayStatuses = [
        OrderStatus.PENDING,
        OrderStatus.PROCESSING,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
        OrderStatus.REFUNDED
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Orders</h2>
                <p className="text-gray-400 mt-2">View and manage customer transactions</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#0a1628] border border-snow-primary/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    <Link
                        href="/admin/orders"
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                            !status ? "bg-snow-accent text-[#020817]" : "bg-white/5 text-gray-400 hover:bg-white/10"
                        )}
                    >
                        All Orders
                    </Link>
                    {displayStatuses.map((s) => (
                        <Link
                            key={s}
                            href={`/admin/orders?status=${s}`}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                                status === s ? "bg-snow-accent text-[#020817]" : "bg-white/5 text-gray-400 hover:bg-white/10"
                            )}
                        >
                            {statusLabels[s]}
                        </Link>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <AdminSearchInput
                        placeholder="Search ID or Email..."
                        paramName="search"
                        className="w-full"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-snow-primary/10">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-white">
                                            #{order.orderNumber.slice(-8)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {order.User?.profileImage ? (
                                                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                                        <Image
                                                            src={order.User.profileImage}
                                                            alt=""
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-snow-accent/20 flex items-center justify-center text-snow-accent text-[8px]">
                                                        {order.User?.firstName?.[0] || order.User?.email[0].toUpperCase() || '?'}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-white text-xs">{order.User?.firstName} {order.User?.lastName}</span>
                                                    <span className="text-[10px] text-gray-500">{order.User?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                order.status === OrderStatus.DELIVERED ? "bg-green-500/10 text-green-400" :
                                                    order.status === OrderStatus.PENDING ? "bg-yellow-500/10 text-yellow-400" :
                                                        order.status === OrderStatus.CANCELLED ? "bg-red-500/10 text-red-400" :
                                                            "bg-gray-500/10 text-gray-400"
                                            )}>
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order._count.orderItems}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-white">
                                            {formatPrice(Number(order.total))}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="text-xs">View</span>
                                            </Link>
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
