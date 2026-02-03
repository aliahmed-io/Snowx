import { db } from "@/lib/db";
import {
    MessageSquare,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import Link from "next/link";
import { ContactActions } from "./ContactActions";

export const dynamic = "force-dynamic";

import { AdminPagination } from "@/components/admin/AdminPagination";

interface PageProps {
    searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function ContactPage({ searchParams }: PageProps) {
    const { search, page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;
    const PAGE_SIZE = 20;
    const skip = (page - 1) * PAGE_SIZE;

    const [messages, totalMessages, pendingCount, completedCount] = await Promise.all([
        db.contact.findMany({
            orderBy: { createdAt: "desc" },
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { subject: { contains: search, mode: 'insensitive' } }
                ]
            } : undefined,
            take: PAGE_SIZE,
            skip
        }),
        db.contact.count({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { subject: { contains: search, mode: 'insensitive' } }
                ]
            } : undefined
        }),
        db.contact.count({ where: { status: "PENDING" } }),
        db.contact.count({ where: { status: "COMPLETED" } })
    ]);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            <AutoRefresh intervalMs={30000} />

            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
                    <p className="text-slate-400 mt-1">
                        Customer support inquiries and contact form submissions
                        <span className="ml-2 text-xs">
                            ({pendingCount} pending, {completedCount} replied)
                        </span>
                    </p>
                </div>
                <Link href="/api/admin/export/contacts" target="_blank">
                    <Button variant="outline" className="border-[#1e293b] text-slate-300 hover:bg-[#1e293b] hover:text-white gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </Link>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Message List */}
                <Card className="w-2/5 bg-[#0f172a] border-[#1e293b] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-[#1e293b] space-y-4">
                        <AdminSearch placeholder="Search messages..." />
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="divide-y divide-[#1e293b]">
                            {messages.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>{search ? "No messages match your search" : "No messages yet"}</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <ContactActions
                                        key={msg.id}
                                        message={{
                                            id: msg.id,
                                            name: msg.name,
                                            email: msg.email,
                                            subject: msg.subject,
                                            message: msg.message,
                                            status: msg.status as "PENDING" | "COMPLETED" | "IGNORED",
                                            isRead: msg.isRead,
                                            receivedAt: msg.createdAt.toISOString()
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Message Detail Placeholder */}
                <Card className="flex-1 bg-[#0f172a] border-[#1e293b] flex flex-col overflow-hidden">
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a message to view details</p>
                    </div>
                </Card>
            </div>

            <AdminPagination currentPage={page} totalItems={totalMessages} pageSize={PAGE_SIZE} />
        </div>
    );
}

