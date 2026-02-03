import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Prisma, TicketStatus } from "@prisma/client";
import {
    Clock,
    User,
    CornerUpLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

import { AdminPagination } from "@/components/admin/AdminPagination";

export default async function SupportPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
    const { status: statusParam, page: pageParam } = await searchParams;
    const status = statusParam as TicketStatus | undefined;
    const page = Number(pageParam) || 1;
    const PAGE_SIZE = 20;
    const skip = (page - 1) * PAGE_SIZE;

    const where: Prisma.TicketWhereInput = {};
    if (status) {
        where.status = status;
    }

    const [tickets, totalTickets] = await Promise.all([
        db.ticket.findMany({
            where,
            include: {
                user: true
            },
            orderBy: { createdAt: 'desc' },
            take: PAGE_SIZE,
            skip
        }),
        db.ticket.count({ where })
    ]);

    const statusColors = {
        [TicketStatus.OPEN]: "bg-green-500/10 text-green-400",
        [TicketStatus.PENDING]: "bg-yellow-500/10 text-yellow-400",
        [TicketStatus.CLOSED]: "bg-gray-500/10 text-gray-400"
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Support Tickets</h2>
                <p className="text-gray-400 mt-2">Resolve customer inquiries and issues</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-[#0a1628] border border-snow-primary/20 p-4 rounded-xl">
                <Link href="/admin/support" className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", !status ? "bg-snow-accent text-[#020817]" : "text-gray-400 hover:bg-white/5")}>All</Link>
                <Link href="/admin/support?status=OPEN" className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", status === 'OPEN' ? "bg-snow-accent text-[#020817]" : "text-gray-400 hover:bg-white/5")}>Open</Link>
                <Link href="/admin/support?status=PENDING" className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", status === 'PENDING' ? "bg-snow-accent text-[#020817]" : "text-gray-400 hover:bg-white/5")}>Pending</Link>
                <Link href="/admin/support?status=CLOSED" className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", status === 'CLOSED' ? "bg-snow-accent text-[#020817]" : "text-gray-400 hover:bg-white/5")}>Closed</Link>
            </div>

            {/* Tickets List */}
            <div className="grid gap-4">
                {tickets.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No support tickets found.
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6 hover:bg-white/5 transition-colors group">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-white text-lg">{ticket.subject}</h3>
                                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColors[ticket.status])}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-1">{ticket.message}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                                        <span className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            {ticket.user.firstName} {ticket.user.lastName} ({ticket.user.email})
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(ticket.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/admin/support/${ticket.id}`}
                                        className="bg-snow-accent text-[#020817] px-4 py-2 rounded-lg font-bold hover:bg-snow-accent/90 transition-colors text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100"
                                    >
                                        <CornerUpLeft className="w-4 h-4" />
                                        Reply
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <AdminPagination currentPage={page} totalItems={totalTickets} pageSize={PAGE_SIZE} />
        </div>
    );
}
