"use client";

import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { markAlertAsRead, dismissAlert } from "@/actions/alerts";

interface AlertActionsProps {
    alertId: string;
    isRead: boolean;
}

export function AlertActions({ alertId, isRead }: AlertActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const handleMarkAsRead = async () => {
        setLoading("read");
        try {
            await markAlertAsRead(alertId);
            router.refresh();
            toast.success("Alert marked as read");
        } catch {
            toast.error("Failed to mark as read");
        } finally {
            setLoading(null);
        }
    };

    const handleDismiss = async () => {
        setLoading("dismiss");
        try {
            await dismissAlert(alertId);
            router.refresh();
            toast.success("Alert dismissed");
        } catch {
            toast.error("Failed to dismiss alert");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex gap-1">
            {!isRead && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-950/30"
                    onClick={handleMarkAsRead}
                    disabled={loading !== null}
                    title="Mark as read"
                >
                    {loading === "read" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </Button>
            )}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-950/30"
                onClick={handleDismiss}
                disabled={loading !== null}
                title="Dismiss"
            >
                {loading === "dismiss" ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            </Button>
        </div>
    );
}
