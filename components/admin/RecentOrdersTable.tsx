"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/navigation";

interface RecentOrder {
    id: string;
    total: number | string | { toNumber: () => number };
    status: string;
    createdAt: Date;
    User: {
        firstName: string | null;
        lastName: string | null;
        email: string;
    } | null;
}

interface RecentOrdersTableProps {
    orders: RecentOrder[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    return (
        <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-snow-primary/10">
                <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="text-gray-400">Order ID</TableHead>
                            <TableHead className="text-gray-400">Customer</TableHead>
                            <TableHead className="text-gray-400">Date</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-right text-gray-400">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow className="border-white/5">
                                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                    No recent orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className="border-white/5 hover:bg-white/5 text-sm">
                                    <TableCell className="font-medium text-white truncate max-w-[100px]">
                                        <Link href={`/admin/orders/${order.id}`} className="hover:text-snow-accent hover:underline">
                                            #{order.id.slice(-6).toUpperCase()}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {order.User ? (
                                            <div className="flex flex-col">
                                                <span>{order.User.firstName} {order.User.lastName}</span>
                                                <span className="text-xs text-gray-500">{order.User.email}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">Guest</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`
            ${order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
            ${order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
            ${order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
            `}
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-white font-medium">
                                        {formatPrice(Number(order.total))}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
