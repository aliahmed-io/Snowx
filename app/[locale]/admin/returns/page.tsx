"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Undo2,
    AlertCircle
} from "lucide-react";
import { toast } from "sonner";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Placeholder type matches schema
interface ReturnRequest {
    id: string;
    orderNumber: string;
    customerEmail: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";
    amount: number;
    requestedAt: string;
}

export default function ReturnsPage() {
    // Placeholder data
    const [returns, setReturns] = useState<ReturnRequest[]>([
        {
            id: "ret_1",
            orderNumber: "ORD-001-234",
            customerEmail: "alice@example.com",
            reason: "Wrong size",
            status: "PENDING",
            amount: 129.99,
            requestedAt: new Date().toISOString()
        }
    ]);

    const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleAction = (id: string, action: string) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1000)),
            {
                loading: `${action} return request...`,
                success: `Return request ${action.toLowerCase()} successfully`,
                error: `Failed to ${action.toLowerCase()} request`
            }
        );
        setIsDetailsOpen(false);
    };

    const getStatusBadge = (status: string) => {
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
    };

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
                                    <TableCell className="font-mono text-slate-300">{request.orderNumber}</TableCell>
                                    <TableCell className="text-slate-300">{request.customerEmail}</TableCell>
                                    <TableCell className="text-slate-400 truncate max-w-[200px]">{request.reason}</TableCell>
                                    <TableCell className="text-slate-300">${request.amount.toFixed(2)}</TableCell>
                                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                                    <TableCell className="text-slate-400 text-sm">
                                        {new Date(request.requestedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-400 hover:text-white"
                                            onClick={() => {
                                                setSelectedReturn(request);
                                                setIsDetailsOpen(true);
                                            }}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="bg-[#0f172a] border-[#1e293b] text-white sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Return Details</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Review return request for Order #{selectedReturn?.orderNumber}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedReturn && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-slate-400">Customer</h4>
                                    <p className="text-sm text-white">{selectedReturn.customerEmail}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-slate-400">Date Requested</h4>
                                    <p className="text-sm text-white">{new Date(selectedReturn.requestedAt).toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-slate-400">Refund Amount</h4>
                                    <p className="text-lg font-semibold text-white">${selectedReturn.amount.toFixed(2)}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-slate-400">Status</h4>
                                    <div>{getStatusBadge(selectedReturn.status)}</div>
                                </div>
                            </div>

                            <div className="bg-[#1e293b]/50 p-4 rounded-lg space-y-2">
                                <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Reason for Return
                                </h4>
                                <p className="text-sm text-slate-400">{selectedReturn.reason}</p>
                            </div>

                            {selectedReturn.status === "PENDING" && (
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button
                                        variant="outline"
                                        className="border-red-900/50 text-red-500 hover:bg-red-950 hover:text-red-400 hover:border-red-800"
                                        onClick={() => handleAction(selectedReturn.id, "Rejected")}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject Request
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleAction(selectedReturn.id, "Approved")}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Refund
                                    </Button>
                                </DialogFooter>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
