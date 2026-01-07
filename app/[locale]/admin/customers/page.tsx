import { getCustomers } from "@/actions/admin";
import Image from "next/image";

export const metadata = {
    title: "Customers | Admin | SnowX",
};

export default async function AdminCustomersPage() {
    const customers = await getCustomers();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Customers</h1>

            {customers.length === 0 ? (
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
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Orders</th>
                                <th className="p-4 font-medium">Total Spent</th>
                                <th className="p-4 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
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
                                            <span className="text-white font-medium">
                                                {customer.firstName} {customer.lastName || ""}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400">{customer.email}</td>
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
