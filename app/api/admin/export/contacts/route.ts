import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
    try {
        await requireAdmin();

        const contacts = await db.contact.findMany({
            orderBy: { createdAt: "desc" }
        });

        // Generate CSV
        const headers = ["ID", "Name", "Email", "Subject", "Message", "Status", "Read", "Created At"];
        const rows = contacts.map(c => [
            c.id,
            `"${c.name.replace(/"/g, '""')}"`,
            c.email,
            `"${c.subject.replace(/"/g, '""')}"`,
            `"${c.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
            c.status,
            c.isRead ? "Yes" : "No",
            c.createdAt.toISOString()
        ]);

        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="contacts-${new Date().toISOString().split('T')[0]}.csv"`
            }
        });
    } catch (error) {
        console.error("Export contacts error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
