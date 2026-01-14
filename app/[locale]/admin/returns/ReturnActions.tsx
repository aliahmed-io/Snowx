"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { approveReturnRequest, rejectReturnRequest, processRefund } from "@/actions/returns";
import { formatPrice } from "@/lib/utils";

interface ReturnActionsProps {
    returnId: string;
    status: string;
    orderNumber: string;
    customerEmail: string;
    reason: string;
    amount: number;
    requestedAt: string;
}

export function ReturnActions({
    returnId,
    status,
    orderNumber,
    customerEmail,
    reason,
    amount,
    requestedAt
}: ReturnActionsProps) {
    const router = useRouter();
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);

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

    const handleApprove = async () => {
        setLoading("approve");
        try {
            await approveReturnRequest(returnId);
            toast.success("Return request approved");
            router.refresh();
            setIsDetailsOpen(false);
        } catch (error) {
            toast.error("Failed to approve request");
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    const handleReject = async () => {
        setLoading("reject");
        try {
            await rejectReturnRequest(returnId);
            toast.success("Return request rejected");
            router.refresh();
            setIsDetailsOpen(false);
        } catch (error) {
            toast.error("Failed to reject request");
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    const handleProcessRefund = async () => {
        setLoading("refund");
        try {
            await processRefund(returnId);
            toast.success("Refund processed successfully");
            router.refresh();
            setIsDetailsOpen(false);
        } catch (error) {
            toast.error("Failed to process refund");
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                onClick={() => setIsDetailsOpen(true)}
            >
                <Eye className="w-4 h-4 mr-1" />
                Details
            </Button>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="bg-[#0f172a] border-[#1e293b] text-white sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Return Details</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Review return request for Order #{orderNumber.slice(0, 12)}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-slate-400">Customer</h4>
                                <p className="text-sm text-white">{customerEmail}</p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-slate-400">Date Requested</h4>
                                <p className="text-sm text-white">{new Date(requestedAt).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-slate-400">Refund Amount</h4>
                                <p className="text-lg font-semibold text-white">{formatPrice(amount)}</p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-slate-400">Status</h4>
                                <div>{getStatusBadge(status)}</div>
                            </div>
                        </div>

                        <div className="bg-[#1e293b]/50 p-4 rounded-lg space-y-2">
                            <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Reason for Return
                            </h4>
                            <p className="text-sm text-slate-400">{reason}</p>
                        </div>

                        {status === "PENDING" && (
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    variant="outline"
                                    className="border-red-900/50 text-red-500 hover:bg-red-950 hover:text-red-400 hover:border-red-800"
                                    onClick={handleReject}
                                    disabled={loading !== null}
                                >
                                    {loading === "reject" ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <XCircle className="w-4 h-4 mr-2" />
                                    )}
                                    Reject Request
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={handleApprove}
                                    disabled={loading !== null}
                                >
                                    {loading === "approve" ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                    )}
                                    Approve Refund
                                </Button>
                            </DialogFooter>
                        )}

                        {status === "APPROVED" && (
                            <DialogFooter>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={handleProcessRefund}
                                    disabled={loading !== null}
                                >
                                    {loading === "refund" ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                    )}
                                    Process Refund
                                </Button>
                            </DialogFooter>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
