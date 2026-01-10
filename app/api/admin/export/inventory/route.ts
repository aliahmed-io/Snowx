import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { decrypt } from "@/lib/encryption";
import { AccountStatus, Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
    try {
        // Check admin auth
        const { getUser, getPermissions } = getKindeServerSession();
        const user = await getUser();
        const permissions = await getPermissions();

        if (!user || !permissions?.permissions?.includes("admin:access")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get query params for filtering
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const includePasswords = searchParams.get("passwords") === "true";

        const where: Prisma.AccountWhereInput = {};
        if (status && status !== "ALL") {
            where.status = status as AccountStatus;
        }

        const accounts = await db.account.findMany({
            where,
            include: {
                product: { select: { name: true } },
                order: { select: { orderNumber: true } },
                user: { select: { email: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Generate CSV
        const headers = [
            "ID",
            "Service Type",
            "Product",
            "Username",
            ...(includePasswords ? ["Password"] : []),
            "Status",
            "Assigned To",
            "Order Number",
            "Purchase Date",
            "Created At",
        ];

        const rows = accounts.map((acc) => [
            acc.id,
            acc.serviceType,
            acc.product?.name || "",
            acc.username,
            ...(includePasswords ? [(() => {
                try { return decrypt(acc.password); } catch { return "***"; }
            })()] : []),
            acc.status,
            acc.user?.email || "",
            acc.order?.orderNumber || "",
            acc.purchaseDate ? new Date(acc.purchaseDate).toISOString() : "",
            new Date(acc.createdAt).toISOString(),
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
            ),
        ].join("\n");

        const filename = `inventory-export-${new Date().toISOString().split("T")[0]}.csv`;

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("CSV Export Error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
