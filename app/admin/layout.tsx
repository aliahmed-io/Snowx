import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id) {
        redirect("/api/auth/login");
    }

    // Check if user is admin
    const user = await db.user.findUnique({
        where: { kindeId: kindeUser.id },
        select: { role: true },
    });

    if (user?.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-16">
            <div className="flex">
                {/* Sidebar */}
                <aside className="fixed left-0 top-16 bottom-0 w-64 bg-gray-900 border-r border-white/10 p-6 overflow-y-auto">
                    <nav className="space-y-2">
                        <NavItem href="/admin" icon="dashboard">Dashboard</NavItem>
                        <NavItem href="/admin/products" icon="products">Products</NavItem>
                        <NavItem href="/admin/categories" icon="categories">Categories</NavItem>
                        <NavItem href="/admin/orders" icon="orders">Orders</NavItem>
                        <NavItem href="/admin/customers" icon="customers">Customers</NavItem>
                    </nav>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <Link
                            href="/"
                            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors px-3 py-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Store
                        </Link>
                    </div>
                </aside>

                {/* Main content */}
                <main className="ml-64 flex-1 p-8 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
    const icons: Record<string, React.ReactNode> = {
        dashboard: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
        products: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        categories: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
        ),
        orders: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        customers: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    };

    return (
        <Link
            href={href}
            className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2.5 transition-all"
        >
            {icons[icon]}
            <span className="font-medium">{children}</span>
        </Link>
    );
}
