import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    User,
    Download
} from "lucide-react";
import { AccountStatus, Prisma } from "@prisma/client";
import Image from "next/image";

export default async function InventoryPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; status?: string }>
}) {
    const { q, status } = await searchParams;

    const where: Prisma.AccountWhereInput = {};

    if (q) {
        where.OR = [
            { username: { contains: q, mode: 'insensitive' } },
            { order: { orderNumber: { contains: q, mode: 'insensitive' } } },
            { user: { email: { contains: q, mode: 'insensitive' } } },
            { serviceType: { contains: q, mode: 'insensitive' } }
        ];
    }

    if (status && status !== 'ALL') {
        where.status = status as AccountStatus;
    }

    const accounts = await db.account.findMany({
        where,
        include: {
            product: true,
            order: true,
            user: true
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    const statuses = ['ALL', ...Object.values(AccountStatus)];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Account Inventory</h2>
                    <p className="text-gray-400 mt-2">Manage credentials and subscription accounts.</p>
                </div>
                <div className="flex gap-2">
                    {/* Add Account Dialog Trigger would go here */}
                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-[#0a1628] border border-snow-primary/20 p-4 rounded-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <form>
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Search by Username, Service, Order ID..."
                            className="w-full bg-snow-primary/10 border border-snow-primary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-snow-accent/50 transition-colors"
                        />
                    </form>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    {statuses.map(s => (
                        <Link
                            key={s}
                            href={`/admin/inventory?status=${s}${q ? `&q=${q}` : ''}`}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
                                (status === s || (!status && s === 'ALL'))
                                    ? "bg-snow-accent text-[#020817]"
                                    : "bg-white/5 text-gray-400 hover:text-white"
                            )}
                        >
                            {s}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#020817] text-gray-200 uppercase font-medium border-b border-snow-primary/10">
                            <tr>
                                <th className="px-6 py-4">Service / Product</th>
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4">Purchase Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-snow-primary/10">
                            {accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <User className="w-8 h-8 mb-2 opacity-50" />
                                            <p>No accounts found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                accounts.map((account) => (
                                    <tr key={account.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {account.product.images[0] && (
                                                    <Image src={account.product.images[0]} width={24} height={24} className="rounded object-cover bg-white/5" alt="" />
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{account.serviceType}</span>
                                                    <span className="text-xs text-gray-500 truncate max-w-[150px]">{account.product.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-300">
                                            {account.username}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={
                                                account.status === 'SOLD' ? 'default' :
                                                    account.status === 'AVAILABLE' ? 'secondary' :
                                                        account.status === 'BANNED' || account.status === 'REPLACED' ? 'destructive' : 'outline'
                                            }>
                                                {account.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            {account.user ? (
                                                <div className="flex flex-col">
                                                    <span className="text-white text-xs">{account.user.email}</span>
                                                    {account.order && (
                                                        <Link href={`/admin/orders/${account.order.id}`} className="text-[10px] text-blue-400 hover:underline">
                                                            #{account.order.orderNumber}
                                                        </Link>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-600">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {account.purchaseDate ? new Date(account.purchaseDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {/* Actions placeholder - e.g. Edit, Ban */}
                                            <div className="flex justify-end gap-2">
                                                {/* <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
