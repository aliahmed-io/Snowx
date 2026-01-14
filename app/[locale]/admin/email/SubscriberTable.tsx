"use client";

import { useRouter } from "next/navigation";
import {
    MoreHorizontal,
    Trash2,
    Copy
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateSubscriberStatus, deleteSubscriber } from "@/actions/newsletter";

interface Subscriber {
    id: string;
    email: string;
    status: string;
    userName: string | null;
    joinedAt: string;
}

interface SubscriberTableProps {
    subscribers: Subscriber[];
}

export function SubscriberTable({ subscribers }: SubscriberTableProps) {
    const router = useRouter();

    const handleCopyEmail = (email: string) => {
        navigator.clipboard.writeText(email);
        toast.success("Email copied!");
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "subscribed" ? "unsubscribed" : "subscribed";
        try {
            await updateSubscriberStatus(id, newStatus);
            toast.success(`Subscriber ${newStatus}`);
            router.refresh();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this subscriber?")) return;

        try {
            await deleteSubscriber(id);
            toast.success("Subscriber removed");
            router.refresh();
        } catch {
            toast.error("Failed to remove subscriber");
        }
    };

    return (
        <div className="rounded-md border border-[#1e293b] overflow-hidden">
            <Table>
                <TableHeader className="bg-[#1e293b]">
                    <TableRow className="border-b border-[#020817] hover:bg-transparent">
                        <TableHead className="text-slate-300">Email</TableHead>
                        <TableHead className="text-slate-300">Name</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">Joined</TableHead>
                        <TableHead className="text-right text-slate-300">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subscribers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                No subscribers yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        subscribers.map((sub) => (
                            <TableRow key={sub.id} className="border-b border-[#1e293b] hover:bg-[#1e293b]/50 last:border-0">
                                <TableCell className="font-medium text-slate-200">{sub.email}</TableCell>
                                <TableCell className="text-slate-400">{sub.userName || "—"}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`border-0 cursor-pointer ${sub.status === 'subscribed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                                        onClick={() => handleToggleStatus(sub.id, sub.status)}
                                    >
                                        {sub.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-400 text-sm">
                                    {new Date(sub.joinedAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#1e293b] border-[#020817] text-slate-200">
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() => handleCopyEmail(sub.email)}
                                            >
                                                <Copy className="mr-2 h-4 w-4" />
                                                Copy Email
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-[#020817]" />
                                            <DropdownMenuItem
                                                className="text-red-400 cursor-pointer focus:bg-red-900/20 focus:text-red-300"
                                                onClick={() => handleDelete(sub.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
