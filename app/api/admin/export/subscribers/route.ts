import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
    try {
        await requireAdmin();

        const subscribers = await db.newsletterSubscriber.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { firstName: true, lastName: true }
                }
            }
        });

        // Generate CSV
        const headers = ["ID", "Email", "Name", "Status", "Created At"];
        const rows = subscribers.map(s => [
            s.id,
            s.email,
            s.user ? `"${[s.user.firstName, s.user.lastName].filter(Boolean).join(' ')}"` : '""',
            s.status,
            s.createdAt.toISOString()
        ]);

        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().split('T')[0]}.csv"`
            }
        });
    } catch (error) {
        console.error("Export subscribers error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
