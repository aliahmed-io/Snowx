import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
    try {
        // Check admin auth
        const { getUser, getPermissions } = getKindeServerSession();
        const user = await getUser();
        const permissions = await getPermissions();

        if (!user || !permissions?.permissions?.includes("admin:access")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const logs = await db.auditLog.findMany({
            include: {
                user: { select: { email: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Generate CSV
        const headers = [
            "ID",
            "Timestamp",
            "Action",
            "Target Type",
            "Target ID",
            "User Email",
            "User Name",
            "Metadata",
        ];

        const rows = logs.map((log) => [
            log.id,
            new Date(log.createdAt).toISOString(),
            log.action,
            log.targetType,
            log.targetId || "",
            log.user?.email || "System",
            log.user ? `${log.user.firstName || ""} ${log.user.lastName || ""}`.trim() : "",
            log.metadata ? JSON.stringify(log.metadata) : "",
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
            ),
        ].join("\n");

        const filename = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("Audit CSV Export Error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
