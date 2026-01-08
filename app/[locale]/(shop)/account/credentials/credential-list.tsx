"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import { revealCredential } from "@/app/actions/credentials";
import { toast } from "sonner";
import { Account, Product, Order } from "@prisma/client";

type AccountWithRelations = Account & {
    product: Product;
    order: Order | null;
};

interface CredentialListProps {
    accounts: AccountWithRelations[];
}

export function CredentialList({ accounts }: CredentialListProps) {
    // State for passwords and loading status
    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});
    const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

    // State for acknowledgments (id -> boolean)
    const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

    const handleAcknowledgmentChange = (accountId: string, checked: boolean) => {
        setAcknowledged(prev => ({ ...prev, [accountId]: checked }));
    };

    const handleReveal = async (accountId: string) => {
        if (revealedPasswords[accountId]) {
            // Toggle off
            const newRevealed = { ...revealedPasswords };
            delete newRevealed[accountId];
            setRevealedPasswords(newRevealed);
            return;
        }

        if (!acknowledged[accountId]) {
            toast.error("Please acknowledge the terms before revealing.");
            return;
        }

        setLoadingIds(prev => ({ ...prev, [accountId]: true }));
        try {
            const { password } = await revealCredential(accountId);
            setRevealedPasswords(prev => ({ ...prev, [accountId]: password }));
        } catch (error) {
            console.error(error);
            toast.error("Failed to reveal credentials");
        } finally {
            setLoadingIds(prev => ({ ...prev, [accountId]: false }));
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    if (accounts.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                    <p className="text-lg text-muted-foreground">You don&apos;t have any credentials yet.</p>
                    <Button asChild>
                        <Link href="/products">Browse Store</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accounts.map((account) => {
                        const isRevealed = !!revealedPasswords[account.id];
                        const isLoading = !!loadingIds[account.id];
                        const isAcknowledged = !!acknowledged[account.id];
                        const password = revealedPasswords[account.id];

                        return (
                            <TableRow key={account.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        {account.product.images[0] && (
                                            <Image
                                                src={account.product.images[0]}
                                                alt={account.product.name}
                                                width={32}
                                                height={32}
                                                className="rounded object-cover bg-muted"
                                            />
                                        )}
                                        <div className="flex flex-col">
                                            <span>{account.serviceType}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{account.product.name}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold selection:bg-snow-accent selection:text-black">
                                            {account.username}
                                        </code>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(account.username)}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-2 min-w-[180px]">
                                        <div className="flex items-center gap-2">
                                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold flex-1 flex items-center justify-center h-8">
                                                {isRevealed ? password : "••••••••"}
                                            </code>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => handleReveal(account.id)}
                                                disabled={isLoading || (!isAcknowledged && !isRevealed)}
                                            >
                                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                            </Button>
                                            {isRevealed && (
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(password)}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>

                                        {!isRevealed && (
                                            <div className="flex items-start gap-2 px-1">
                                                <input
                                                    type="checkbox"
                                                    id={`ack-${account.id}`}
                                                    className="mt-1 w-3 h-3 rounded-sm border-gray-400"
                                                    checked={isAcknowledged}
                                                    onChange={(e) => handleAcknowledgmentChange(account.id, e.target.checked)}
                                                />
                                                <label htmlFor={`ack-${account.id}`} className="text-[10px] leading-tight text-muted-foreground select-none cursor-pointer">
                                                    I agree: No refunds after reveal.
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        account.status === 'SOLD' ? 'default' :
                                            account.status === 'BANNED' || account.status === 'REPLACED' ? 'destructive' : 'secondary'
                                    }>
                                        {account.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {account.order?.orderNumber ? (
                                        <span className="font-mono text-xs">#{account.order.orderNumber}</span>
                                    ) : "N/A"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/contact">Report Issue</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
