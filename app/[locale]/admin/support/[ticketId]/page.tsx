import { db } from "@/lib/db";
import { Link } from "@/navigation";
import {
    ArrowLeft,
    MessageSquare,
    Clock,
    User,
    Send
} from "lucide-react";
import { notFound } from "next/navigation";
import { TicketStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cn } from "@/lib/utils";

async function updateTicketStatus(formData: FormData) {
    "use server";
    const ticketId = formData.get("ticketId") as string;
    const status = formData.get("status") as TicketStatus;

    await db.ticket.update({
        where: { id: ticketId },
        data: { status }
    });

    revalidatePath(`/admin/support/${ticketId}`);
}

async function sendReply(formData: FormData) {
    "use server";
    // Mock reply - in real app would send email/save to db
    // TODO: Implement reply logic
}

export default async function TicketDetailsPage({ params }: { params: Promise<{ ticketId: string }> }) {
    const { ticketId } = await params;
    const ticket = await db.ticket.findUnique({
        where: { id: ticketId },
        include: { user: true }
    });

    if (!ticket) notFound();

    const statusColors = {
        [TicketStatus.OPEN]: "bg-green-500/10 text-green-400",
        [TicketStatus.PENDING]: "bg-yellow-500/10 text-yellow-400",
        [TicketStatus.CLOSED]: "bg-gray-500/10 text-gray-400"
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/support"
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Ticket #{ticket.id.slice(-6)}</h2>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" />
                                {ticket.user.firstName} {ticket.user.lastName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(ticket.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <form action={updateTicketStatus} className="flex items-center gap-2">
                    <input type="hidden" name="ticketId" value={ticket.id} />
                    <select
                        name="status"
                        defaultValue={ticket.status}
                        className={cn(
                            "bg-[#0a1628] border border-snow-primary/20 rounded-lg py-2 pl-3 pr-8 text-sm font-medium focus:outline-none focus:border-snow-accent/50 appearance-none cursor-pointer",
                            statusColors[ticket.status]
                        )}
                        onChange={(e) => e.target.form?.requestSubmit()}
                    >
                        {Object.values(TicketStatus).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </form>
            </div>

            <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-snow-primary/20 bg-white/5">
                    <h3 className="font-semibold text-white text-lg">{ticket.subject}</h3>
                </div>
                <div className="p-8 space-y-8">
                    {/* User Message */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-snow-accent/20 shrink-0 flex items-center justify-center text-snow-accent">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-baseline justify-between">
                                <span className="font-medium text-white">{ticket.user.firstName} {ticket.user.lastName}</span>
                                <span className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {ticket.message}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-snow-primary/20"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0a1628] px-2 text-gray-500">Reply chain placeholder</span>
                        </div>
                    </div>

                    {/* Reply Box */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-snow-accent shrink-0 flex items-center justify-center text-[#020817]">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <form action={sendReply} className="space-y-4">
                                <input type="hidden" name="ticketId" value={ticket.id} />
                                <div className="relative">
                                    <textarea
                                        name="message"
                                        rows={6}
                                        className="w-full bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-4 text-white focus:border-snow-accent/50 focus:outline-none resize-none"
                                        placeholder="Type your reply here..."
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="absolute bottom-4 right-4 bg-snow-accent text-[#020817] px-4 py-2 rounded-lg font-bold hover:bg-snow-accent/90 transition-colors flex items-center gap-2 text-sm"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send Reply
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
