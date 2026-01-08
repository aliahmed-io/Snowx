import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import {
    Search,
    ShoppingBag
} from "lucide-react";

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
    const search = (await searchParams).search;

    const where: Prisma.UserWhereInput = {};
    if (search) {
        where.OR = [
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } }
        ];
    }

    const users = await db.user.findMany({
        where,
        include: {
            _count: {
                select: { orders: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Users</h2>
                <p className="text-gray-400 mt-2">Manage customer accounts and access</p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 bg-[#0a1628] border border-snow-primary/20 p-4 rounded-xl">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-snow-primary/10 border border-snow-primary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-snow-accent/50 transition-colors"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Orders</th>
                                <th className="px-6 py-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-snow-primary/10">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.profileImage ? (
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                        <Image
                                                            src={user.profileImage}
                                                            alt=""
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-snow-accent/20 flex items-center justify-center text-snow-accent">
                                                        {user.firstName?.[0] || user.email[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-white/5 px-2 py-1 rounded-md text-xs font-medium">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-gray-300">
                                                <ShoppingBag className="w-3.5 h-3.5 text-gray-500" />
                                                {user._count.orders}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(user.createdAt).toLocaleDateString()}
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
