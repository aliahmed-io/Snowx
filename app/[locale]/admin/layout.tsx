import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { db } from "@/lib/db";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | Snow X",
    description: "Administrative control panel for Snow X application",
    robots: "noindex, nofollow"
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { getUser, isAuthenticated } = getKindeServerSession();

    if (!(await isAuthenticated())) {
        redirect("/api/auth/login");
    }

    const user = await getUser();

    if (!user) {
        redirect("/api/auth/login");
    }

    // Verify admin access via Environment Variable
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const userEmail = user.email;

    if (!userEmail || !adminEmails.includes(userEmail)) {
        redirect("/");
    }

    return (
        <div className="flex h-screen bg-[#020817]">
            <AdminSidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminHeader />
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
