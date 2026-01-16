import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = 'force-dynamic';

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
    // This ensures the user is created in the database if they don't exist
    const user = await requireAuth();

    // Verify admin access via Environment Variable
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    if (process.env.ADMIN_EMAIL) {
        adminEmails.push(process.env.ADMIN_EMAIL);
    }
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
