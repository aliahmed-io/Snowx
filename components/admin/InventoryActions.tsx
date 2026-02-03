"use client";

import { AccountStatus } from "@prisma/client";

import { useState } from "react";
import { Edit, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "@/actions/inventory";
import { InventoryForm } from "@/components/admin/InventoryForm";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


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

interface InventoryActionsProps {
    account: Account;
    products: SlimProduct[];
}

export function InventoryActions({ account, products }: InventoryActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteAccount(account.id);
            toast.success("Account deleted");
            setDeleteOpen(false);
        } catch (error) {
            toast.error("Failed to delete account");
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditOpen(true)}
                className="hover:bg-white/10 hover:text-white text-gray-400"
            >
                <Edit className="w-4 h-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteOpen(true)}
                className="hover:bg-red-500/10 hover:text-red-400 text-gray-400"
            >
                <Trash className="w-4 h-4" />
            </Button>

            {/* Edit Dialog */}
            <InventoryForm
                products={products}
                account={account}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            {/* Delete Alert */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="bg-[#0f172a] border-snow-primary/20 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this account. If it was unsold, stock will be decremented.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent hover:bg-white/10 text-white border-white/10">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault(); // Prevent auto-closing to show loading
                                handleDelete();
                            }}
                            disabled={deleting}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
