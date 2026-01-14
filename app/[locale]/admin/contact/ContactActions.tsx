"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
    Trash2,
    Reply,
    Check,
    Mail,
    User,
    Clock,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { updateContactStatus, replyToContact, deleteContact } from "@/actions/contact";

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "PENDING" | "COMPLETED" | "IGNORED";
    isRead: boolean;
    receivedAt: string;
}

interface ContactActionsProps {
    message: Message;
}

export function ContactActions({ message }: ContactActionsProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState<string | null>(null);

    const handleReply = async (e: FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setLoading("reply");
        try {
            await replyToContact(message.id, replyText);
            toast.success("Reply sent successfully!");
            setReplyText("");
            setIsOpen(false);
            router.refresh();
        } catch {
            toast.error("Failed to send reply");
        } finally {
            setLoading(null);
        }
    };

    const handleStatusUpdate = async (status: "COMPLETED" | "IGNORED") => {
        setLoading(status);
        try {
            await updateContactStatus(message.id, status);
            toast.success(`Marked as ${status.toLowerCase()}`);
            setIsOpen(false);
            router.refresh();
        } catch {
            toast.error("Failed to update status");
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        setLoading("delete");
        try {
            await deleteContact(message.id);
            toast.success("Message deleted");
            setIsOpen(false);
            router.refresh();
        } catch {
            toast.error("Failed to delete message");
        } finally {
            setLoading(null);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`w-full text-left p-4 hover:bg-[#1e293b]/50 transition-colors ${!message.isRead ? 'border-l-2 border-l-blue-500 bg-[#1e293b]/30' : ''}`}
            >
                <div className="flex justify-between items-start mb-1">
                    <span className={`font-semibold text-sm ${message.status === 'PENDING' ? 'text-white' : 'text-slate-400'}`}>
                        {message.name}
                    </span>
                    <span className="text-xs text-slate-500">
                        {new Date(message.receivedAt).toLocaleDateString()}
                    </span>
                </div>
                <p className={`text-sm mb-1 line-clamp-1 ${message.status === 'PENDING' ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                    {message.subject}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2">
                    {message.message}
                </p>
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-[#0f172a] border-[#1e293b] text-white sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{message.subject}</DialogTitle>
                    </DialogHeader>

                    <div className="flex items-center gap-3 text-sm text-slate-400 py-2">
                        <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {message.name}
                        </span>
                        <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {message.email}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(message.receivedAt).toLocaleString()}
                        </span>
                    </div>

                    <Separator className="bg-[#1e293b]" />

                    <ScrollArea className="flex-1 max-h-[200px]">
                        <div className="text-slate-300 whitespace-pre-wrap leading-relaxed py-4">
                            {message.message}
                        </div>
                    </ScrollArea>

                    <div className="flex gap-2 py-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-[#1e293b] text-slate-400 hover:text-red-400 hover:bg-red-950/20"
                            onClick={handleDelete}
                            disabled={loading !== null}
                        >
                            {loading === "delete" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            Delete
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-[#1e293b] text-slate-400 hover:text-yellow-400 hover:bg-yellow-950/20"
                            onClick={() => handleStatusUpdate("IGNORED")}
                            disabled={loading !== null}
                        >
                            {loading === "IGNORED" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            Ignore
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-[#1e293b] text-slate-400 hover:text-blue-400 hover:bg-blue-950/20"
                            onClick={() => handleStatusUpdate("COMPLETED")}
                            disabled={loading !== null}
                        >
                            {loading === "COMPLETED" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                            Mark Done
                        </Button>
                    </div>

                    <Separator className="bg-[#1e293b]" />

                    <form onSubmit={handleReply} className="space-y-4 pt-2">
                        <Textarea
                            placeholder={`Reply to ${message.name}...`}
                            className="bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600 min-h-[100px]"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            required
                        />
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={loading !== null}
                            >
                                {loading === "reply" ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Reply className="w-4 h-4 mr-2" />
                                )}
                                Send Reply
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
