"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/orders";

interface OrderStatusFormProps {
    orderId: string;
    currentStatus: string;
}

export function OrderStatusForm({ orderId, currentStatus }: OrderStatusFormProps) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (status === currentStatus) return;

        setLoading(true);
        try {
            await updateOrderStatus(orderId, status as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED");
            router.refresh();
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-snow-accent"
            >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
            </select>
            <button
                onClick={handleUpdate}
                disabled={loading || status === currentStatus}
                className="bg-snow-accent text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Updating..." : "Update"}
            </button>
        </div>
    );
}
