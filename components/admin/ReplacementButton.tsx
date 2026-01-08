"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { replaceAccountAction } from "@/app/actions/admin-account-actions";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReplacementButtonProps {
    accountId: string;
    username: string;
}

export function ReplacementButton({ accountId, username }: ReplacementButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("Customer reported failure");

    const handleReplace = async () => {
        setIsLoading(true);
        try {
            const res = await replaceAccountAction(accountId, reason);
            if (res.success) {
                toast.success("Account replaced successfully");
                setOpen(false);
                // Optional: router.refresh() if needed, but revalidatePath should handle it
            } else {
                toast.error(`Failed: ${res.error}`);
            }
        } catch {
            toast.error("Replacement failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-orange-400 border-orange-400/20 hover:bg-orange-400/10">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Replace
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-[#020817] border-snow-primary/20 text-white">
                <DialogHeader>
                    <DialogTitle>Replace Account</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        This will revoke access to <b>{username}</b> and assign a new available account from the inventory.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for replacement</Label>
                        <Input
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleReplace}
                        disabled={isLoading}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Confirm Replacement
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
