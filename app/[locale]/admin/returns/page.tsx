import { db } from "@/lib/db";
import {
    Search,
    Filter,
    Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ReturnActions } from "./ReturnActions";

export const dynamic = "force-dynamic";



function getStatusBadge(status: string) {
    switch (status) {
        case "PENDING":
            return <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 bg-yellow-500/10">Pending</Badge>;
        case "APPROVED":
            return <Badge variant="outline" className="border-blue-500/50 text-blue-500 bg-blue-500/10">Approved</Badge>;
        case "REJECTED":
            return <Badge variant="outline" className="border-red-500/50 text-red-500 bg-red-500/10">Rejected</Badge>;
        case "REFUNDED":
            return <Badge variant="outline" className="border-green-500/50 text-green-500 bg-green-500/10">Refunded</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

import { AdminPagination } from "@/components/admin/AdminPagination";

export default async function ReturnsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
    const { page: pageParam, search } = await searchParams;
    const page = Number(pageParam) || 1;
    const PAGE_SIZE = 20;
    const skip = (page - 1) * PAGE_SIZE;

    const [returns, totalReturns] = await Promise.all([
        db.returnRequest.findMany({
            orderBy: { createdAt: "desc" },
            where: search ? {
                OR: [
                    { order: { orderNumber: { contains: search, mode: 'insensitive' } } },
                    { user: { email: { contains: search, mode: 'insensitive' } } }
                ]
            } : undefined,
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        total: true
                    }
                },
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            take: PAGE_SIZE,
            skip
        }),
        db.returnRequest.count({
            where: search ? {
                OR: [
                    { order: { orderNumber: { contains: search, mode: 'insensitive' } } },
                    { user: { email: { contains: search, mode: 'insensitive' } } }
                ]
            } : undefined
        })
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Returns</h1>
                    <p className="text-slate-400 mt-1">Manage return requests and refunds</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-[#0f172a] p-4 rounded-xl border border-[#1e293b]">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        placeholder="Search order number or email..."
                        className="pl-9 bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600"
                    />
                </div>
                <Button variant="outline" className="border-[#1e293b] text-slate-300 hover:bg-[#1e293b] hover:text-white gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                </Button>
            </div>

            {/* Returns List */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-[#1e293b]">
                        <TableRow className="border-b border-[#1e293b] hover:bg-transparent">
                            <TableHead className="text-slate-300 font-medium">Order</TableHead>
                            <TableHead className="text-slate-300 font-medium">Customer</TableHead>
                            <TableHead className="text-slate-300 font-medium">Reason</TableHead>
                            <TableHead className="text-slate-300 font-medium">Amount</TableHead>
                            <TableHead className="text-slate-300 font-medium">Status</TableHead>
                            <TableHead className="text-slate-300 font-medium">Date</TableHead>
                            <TableHead className="text-right text-slate-300 font-medium">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {returns.length === 0 ? (
                            <TableRow className="border-b border-[#1e293b] hover:bg-transparent">
                                <TableCell colSpan={7} className="h-48 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center">
                                            <Undo2 className="w-6 h-6 text-slate-500" />
                                        </div>
                                        <p>No return requests found.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            returns.map((request) => (
                                <TableRow key={request.id} className="border-b border-[#1e293b] hover:bg-[#1e293b]/50">
                                    <TableCell className="font-mono text-slate-300">
                                        {request.order.orderNumber.slice(0, 12)}
                                    </TableCell>
                                    <TableCell className="text-slate-300">
                                        {request.user.email}
                                    </TableCell>
                                    <TableCell className="text-slate-400 truncate max-w-[200px]">
                                        {request.reason}
                                    </TableCell>
                                    <TableCell className="text-slate-300">
                                        {formatPrice(Number(request.order.total))}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                                    <TableCell className="text-slate-400 text-sm">
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ReturnActions
                                            returnId={request.id}
                                            status={request.status}
                                            orderNumber={request.order.orderNumber}
                                            customerEmail={request.user.email}
                                            reason={request.reason}
                                            amount={Number(request.order.total)}
                                            requestedAt={request.createdAt.toISOString()}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AdminPagination currentPage={page} totalItems={totalReturns} pageSize={PAGE_SIZE} />
        </div>
    );
}
