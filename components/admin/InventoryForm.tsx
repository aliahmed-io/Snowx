"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { createAccount, updateAccount } from "@/actions/inventory";
import { AccountStatus } from "@prisma/client";
import { toast } from "sonner"; // Assuming sonner is used, or generic alert

interface Account {
    id: string;
    productId: string;
    serviceType: string;
    username: string;
    password: string;
    status: AccountStatus;
    notes?: string | null;
}

interface SlimProduct {
    id: string;
    name: string;
}

interface InventoryFormProps {
    products: SlimProduct[];
    account?: Account; // If passed, we are in Edit mode
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

export function InventoryForm({ products, account, open, onOpenChange, children }: InventoryFormProps) {
    const router = useRouter();
    const [internalOpen, setInternalOpen] = useState(false);
    const isEdit = !!account;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        productId: account?.productId || (products[0]?.id || ""),
        serviceType: account?.serviceType || (products[0]?.name || ""), // Default to product name
        username: account?.username || "",
        password: account?.password || "",
        status: account?.status || "AVAILABLE",
        notes: account?.notes || "",
    });

    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await updateAccount(account.id, formData);
                toast.success("Account updated successfully");
            } else {
                await createAccount(formData);
                toast.success("Account added successfully");
            }
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {children ? (
                <DialogTrigger asChild>{children}</DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <Button className="bg-snow-accent text-[#020817] hover:bg-snow-accent/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Account
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="bg-[#0f172a] border-snow-primary/20 text-white w-[95%] max-w-md fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:-mt-60 sm:ml-[100px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Account" : "Add Inventory"}</DialogTitle>
                </DialogHeader>

                <div className="max-h-[75vh] overflow-y-auto px-1 pr-2 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        {/* Product Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Product</label>
                            <select
                                className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-snow-accent/50 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.productId}
                                onChange={(e) => {
                                    const prod = products.find(p => p.id === e.target.value);
                                    setFormData({
                                        ...formData,
                                        productId: e.target.value,
                                        serviceType: prod ? prod.name : formData.serviceType
                                    });
                                }}
                                required
                            >
                                {products.map((p) => (
                                    <option key={p.id} value={p.id} className="bg-[#0f172a]">
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Service Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Service Type</label>
                            <input
                                type="text"
                                value={formData.serviceType}
                                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-snow-accent/50 placeholder:text-gray-500"
                                placeholder="e.g. Netflix Premium"
                                required
                            />
                        </div>

                        {/* Credentials */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Username / Email</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-snow-accent/50"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                <input
                                    type="text"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-snow-accent/50"
                                    required
                                />
                            </div>
                        </div>

                        {/* Status & Notes */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Status</label>
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-snow-accent/50"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AccountStatus })}
                                >
                                    <option value="AVAILABLE" className="bg-[#0f172a]">Available</option>
                                    <option value="SOLD" className="bg-[#0f172a]">Sold</option>
                                    <option value="SUSPENDED" className="bg-[#0f172a]">Suspended</option>
                                    <option value="BANNED" className="bg-[#0f172a]">Banned</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Internal Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-snow-accent/50 placeholder:text-gray-500"
                                placeholder="e.g. Purchase date, recovery email info..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-[#0f172a] pb-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/10 hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-snow-accent text-[#020817] hover:bg-snow-accent/90"
                            >
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isEdit ? "Save Changes" : "Add Account"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
