
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Key,
    Download
} from "lucide-react";
import { LicenseStatus, Prisma } from "@prisma/client";
import Image from "next/image";

export default async function LicensesPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; status?: string }>
}) {
    const { q, status } = await searchParams;

    const where: Prisma.LicenseKeyWhereInput = {};

    if (q) {
        where.OR = [
            { key: { contains: q, mode: 'insensitive' } },
            { order: { orderNumber: { contains: q, mode: 'insensitive' } } },
            { user: { email: { contains: q, mode: 'insensitive' } } }
        ];
    }

    if (status && status !== 'ALL') {
        where.status = status as LicenseStatus;
    }

    const licenses = await db.licenseKey.findMany({
        where,
        include: {
            product: true,
            order: true,
            user: true
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    const statuses = ['ALL', ...Object.values(LicenseStatus)];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">License Management</h2>
                    <p className="text-gray-400 mt-2">View and manage all license keys across products</p>
                </div>
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Export CSV</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-[#0a1628] border border-snow-primary/20 p-4 rounded-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <form>
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Search by Key, Order ID, or User Email..."
                            className="w-full bg-snow-primary/10 border border-snow-primary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-snow-accent/50 transition-colors"
                        />
                    </form>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    {statuses.map(s => (
                        <Link
                            key={s}
                            href={`/admin/licenses?status=${s}${q ? `&q=${q}` : ''}`}
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
                                <th className="px-6 py-4">Key</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">User / Order</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-snow-primary/10">
                            {licenses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Key className="w-8 h-8 mb-2 opacity-50" />
                                            <p>No licenses found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                licenses.map((license) => (
                                    <tr key={license.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-white">
                                            {license.key}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {license.product.images[0] && (
                                                    <Image src={license.product.images[0]} width={24} height={24} className="rounded object-cover bg-white/5" alt="" />
                                                )}
                                                <span className="truncate max-w-[150px]" title={license.product.name}>{license.product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={
                                                license.status === 'ACTIVE' ? 'default' :
                                                    license.status === 'AVAILABLE' ? 'secondary' :
                                                        license.status === 'REVOKED' ? 'destructive' : 'outline'
                                            }>
                                                {license.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            {license.user ? (
                                                <div className="flex flex-col">
                                                    <span className="text-white text-xs">{license.user.email}</span>
                                                    {license.order && (
                                                        <Link href={`/admin/orders/${license.order.id}`} className="text-[10px] text-blue-400 hover:underline">
                                                            #{license.order.orderNumber}
                                                        </Link>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-600">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {new Date(license.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {/* Actions placeholder */}
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
