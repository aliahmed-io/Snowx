import { db } from "@/lib/db";
import { Link } from "@/navigation";
import {
    Send,
    Megaphone,
    History,
    Users,
    Mail
} from "lucide-react";
import { BroadcastType } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function sendBroadcast(formData: FormData) {
    "use server";
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const type = formData.get("type") as BroadcastType;

    if (!subject || !message) return;

    await db.broadcast.create({
        data: {
            subject,
            message,
            type,
            sentAt: new Date(), // Immediate send
            stats: {
                sent: 0, // Placeholder
                opened: 0
            }
        }
    });

    // Mock Email Sending Logic Here
    console.log(`Broadcasting [${type}]: ${subject}`);

    revalidatePath("/admin/broadcasts");
}

export default async function BroadcastPage() {
    const broadcasts = await db.broadcast.findMany({
        orderBy: { sentAt: 'desc' },
        take: 10
    });

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Broadcasts</h2>
                <p className="text-gray-400 mt-2">Announcements and newsletters</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Compose Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <Send className="w-5 h-5 text-snow-accent" />
                            New Broadcast
                        </h3>

                        <form action={sendBroadcast} className="space-y-5">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-400">Subject</label>
                                <input
                                    name="subject"
                                    placeholder="e.g., Winter Gen 2 Drop is Live!"
                                    required
                                    className="bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-3 text-white focus:border-snow-accent/50 focus:outline-none"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-400">Message</label>
                                <textarea
                                    name="message"
                                    rows={8}
                                    placeholder="Write your announcement..."
                                    required
                                    className="bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-3 text-white focus:border-snow-accent/50 focus:outline-none resize-none"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-400">Channel</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                        <input type="radio" name="type" value="EMAIL" defaultChecked className="text-snow-accent bg-transparent" />
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-300">Email</span>
                                    </label>
                                    <label className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                        <input type="radio" name="type" value="NOTIFICATION" className="text-snow-accent bg-transparent" />
                                        <Megaphone className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-300">In-App</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-snow-accent text-[#020817] py-3 rounded-lg font-bold hover:bg-snow-accent/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-snow-accent/20"
                            >
                                <Send className="w-4 h-4" />
                                Send Broadcast
                            </button>
                        </form>
                    </div>
                </div>

                {/* History Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6 h-full flex flex-col">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <History className="w-4 h-4 text-gray-400" />
                            Recent History
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {broadcasts.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No broadcasts sent yet.</p>
                            ) : (
                                broadcasts.map((broadcast) => (
                                    <div key={broadcast.id} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-snow-primary/20 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-medium text-snow-accent px-1.5 py-0.5 bg-snow-accent/10 rounded">
                                                {broadcast.type}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                {broadcast.sentAt ? new Date(broadcast.sentAt).toLocaleDateString() : 'Draft'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-200 font-medium line-clamp-1">{broadcast.subject}</p>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{broadcast.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
