"use client";

import { useState } from "react";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/actions/admin";

interface OrderStatusFormProps {
    orderId: string;
    initialStatus: OrderStatus;
}

export function OrderStatusForm({ orderId, initialStatus }: OrderStatusFormProps) {
    const [status, setStatus] = useState<OrderStatus>(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const statuses = Object.values(OrderStatus);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateOrderStatus(orderId, status);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">Order Status</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    disabled={isLoading}
                    className="w-full bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-2.5 text-white focus:border-snow-accent/50 focus:outline-none disabled:opacity-50"
                >
                    {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-snow-accent text-[#020817] py-2 rounded-lg font-bold hover:bg-snow-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isLoading ? "Updating..." : "Update Status"}
                </button>
            </form>
        </div>
    );
}
