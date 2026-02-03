import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { Link } from "@/navigation";
import Image from "next/image";
import { AdminPagination } from "@/components/admin/AdminPagination";

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;
    const PAGE_SIZE = 20;
    const skip = (page - 1) * PAGE_SIZE;

    const [customers, totalCustomers] = await Promise.all([
        db.user.findMany({
            where: { role: Role.CUSTOMER },
            include: {
                _count: {
                    select: { orders: true }
                },
                orders: {
                    select: { total: true }
                }
            },
            orderBy: { createdAt: "desc" },
            take: PAGE_SIZE,
            skip
        }),
        db.user.count({ where: { role: Role.CUSTOMER } })
    ]);

    // Map to shape expected by UI
    const mappedCustomers = customers.map(customer => ({
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        profileImage: customer.profileImage,
        createdAt: customer.createdAt,
        orderCount: customer._count.orders,
        totalSpent: customer.orders.reduce((acc, order) => acc + Number(order.total), 0)
    }));

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Customers</h1>

            {mappedCustomers.length === 0 ? (
                // ... (Empty state stays same)
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                    <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-gray-400">No customers yet</p>
                </div>
            ) : (
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-500 text-sm border-b border-white/10 bg-white/5">
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium hidden md:table-cell">Email</th>
                                <th className="p-4 font-medium">Orders</th>
                                <th className="p-4 font-medium">Total Spent</th>
                                <th className="p-4 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappedCustomers.map((customer) => (
                                <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <Link href={`/admin/customers/${customer.id}`} className="flex items-center gap-3">
                                            {customer.profileImage ? (
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                    <Image
                                                        src={customer.profileImage}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-snow-accent/20 flex items-center justify-center text-snow-accent font-bold">
                                                    {customer.firstName?.[0] || customer.email[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium group-hover:text-snow-accent transition-colors">
                                                    {customer.firstName} {customer.lastName || ""}
                                                </span>
                                                <span className="text-xs text-gray-500 md:hidden">{customer.email}</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 text-gray-400 hidden md:table-cell">{customer.email}</td>
                                    <td className="p-4">
                                        <span className="text-white">{customer.orderCount}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-green-400 font-medium">
                                            ${customer.totalSpent.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
