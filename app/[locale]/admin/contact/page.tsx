"use client";

import { useState } from "react";
import {
    MessageSquare,
    Search,
    Trash2,
    Reply,
    Check,
    Mail,
    User,
    Clock
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "PENDING" | "replied" | "ignored";
    receivedAt: string;
}

export default function ContactPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([
        {
            id: "msg_1",
            name: "John Doe",
            email: "john@example.com",
            subject: "Question about shipping",
            message: "Hi, I ordered a board 3 days ago and the tracking hasn't updated. Can you check? Order #12345.",
            status: "PENDING",
            receivedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
            id: "msg_2",
            name: "Jane Smith",
            email: "jane@design.co",
            subject: "Partnership Inquiry",
            message: "We are a local ski resort looking to partner with SnowX for rental equipment. Who should I talk to?",
            status: "replied",
            receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
        },
        {
            id: "msg_3",
            name: "Spam Bot",
            email: "offer@spam.com",
            subject: "SEO Services",
            message: "Rank #1 on Google in 24 hours!!! Click here...",
            status: "ignored",
            receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        }
    ]);

    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [replyText, setReplyText] = useState("");

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMessage) return;

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1000)),
            {
                loading: 'Sending reply...',
                success: 'Reply sent successfully!',
                error: 'Failed to send reply'
            }
        );

        setMessages(messages.map(m => m.id === selectedMessage.id ? { ...m, status: "replied" } : m));
        setSelectedMessage(null);
        setReplyText("");
    };

    const handleStatusUpdate = (id: string, status: "ignored" | "replied") => {
        setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
        toast.success(`Marked as ${status}`);
        if (selectedMessage?.id === id) {
            setSelectedMessage(null);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
                    <p className="text-slate-400 mt-1">Customer support inquiries and contact form submissions</p>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Message List */}
                <Card className="w-2/5 bg-[#0f172a] border-[#1e293b] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-[#1e293b] space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                placeholder="Search messages..."
                                className="pl-9 bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600"
                            />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="divide-y divide-[#1e293b]">
                            {messages.map((msg) => (
                                <button
                                    key={msg.id}
                                    onClick={() => setSelectedMessage(msg)}
                                    className={`w-full text-left p-4 hover:bg-[#1e293b]/50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-[#1e293b] border-l-2 border-l-blue-500' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`font-semibold text-sm ${msg.status === 'PENDING' ? 'text-white' : 'text-slate-400'}`}>
                                            {msg.name}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {new Date(msg.receivedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm mb-1 line-clamp-1 ${msg.status === 'PENDING' ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                                        {msg.subject}
                                    </p>
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                        {msg.message}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Message Detail */}
                <Card className="flex-1 bg-[#0f172a] border-[#1e293b] flex flex-col overflow-hidden">
                    {selectedMessage ? (
                        <>
                            <div className="p-6 border-b border-[#1e293b]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">{selectedMessage.subject}</h2>
                                        <div className="flex items-center gap-3 text-sm text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {selectedMessage.name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {selectedMessage.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {new Date(selectedMessage.receivedAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="border-[#1e293b] text-slate-400 hover:text-red-400 hover:bg-red-950/20" onClick={() => handleStatusUpdate(selectedMessage.id, "ignored")}>
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Ignore
                                        </Button>
                                        <Button variant="outline" size="sm" className="border-[#1e293b] text-slate-400 hover:text-blue-400 hover:bg-blue-950/20" onClick={() => handleStatusUpdate(selectedMessage.id, "replied")}>
                                            <Check className="w-4 h-4 mr-2" />
                                            Mark Done
                                        </Button>
                                    </div>
                                </div>
                                <Separator className="bg-[#1e293b]" />
                            </div>

                            <ScrollArea className="flex-1 p-6">
                                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {selectedMessage.message}
                                </div>
                            </ScrollArea>

                            <div className="p-4 bg-[#1e293b]/30 border-t border-[#1e293b]">
                                <form onSubmit={handleReply} className="space-y-4">
                                    <Textarea
                                        placeholder={`Reply to ${selectedMessage.name}...`}
                                        className="bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600 min-h-[100px]"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                            <Reply className="w-4 h-4 mr-2" />
                                            Send Reply
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                            <p>Select a message to view details</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
