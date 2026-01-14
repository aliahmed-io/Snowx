"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { runSecurityAudit, toggleLockdownMode } from "@/actions/alerts";

export function SecurityAuditButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleAudit = async () => {
        setLoading(true);
        try {
            const result = await runSecurityAudit();
            if (result.success) {
                toast.success("Security audit complete", {
                    description: result.message
                });
                router.refresh();
            } else {
                toast.error("Audit failed", {
                    description: result.message
                });
            }
        } catch {
            toast.error("Failed to run security audit");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            className="w-full bg-[#1e293b] hover:bg-[#2d3a4f] text-white"
            onClick={handleAudit}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <ShieldCheck className="w-4 h-4 mr-2" />
            )}
            {loading ? "Running Audit..." : "Run Security Audit"}
        </Button>
    );
}

export function LockdownButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLockdown = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to enable lockdown mode? This will disable new registrations and restrict certain features."
        );

        if (!confirmed) return;

        setLoading(true);
        try {
            const result = await toggleLockdownMode(true);
            if (result.success) {
                toast.warning("Lockdown mode enabled", {
                    description: "System is now in lockdown mode"
                });
                router.refresh();
            } else {
                toast.error("Failed to enable lockdown", {
                    description: result.message
                });
            }
        } catch {
            toast.error("Failed to toggle lockdown mode");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="destructive"
            className="w-full bg-red-900/80 hover:bg-red-800 text-white"
            onClick={handleLockdown}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Lock className="w-4 h-4 mr-2" />
            )}
            {loading ? "Enabling..." : "Enable Lockdown Mode"}
        </Button>
    );
}
