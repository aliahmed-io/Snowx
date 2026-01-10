import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { encrypt } from "@/lib/encryption";

export async function POST(request: NextRequest) {
    try {
        // Check admin auth
        const { getUser, getPermissions } = getKindeServerSession();
        const user = await getUser();
        const permissions = await getPermissions();

        if (!user || !permissions?.permissions?.includes("admin:access")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const productId = formData.get("productId") as string;

        if (!file || !productId) {
            return NextResponse.json(
                { error: "Missing file or productId" },
                { status: 400 }
            );
        }

        // Verify product exists
        const product = await db.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Parse CSV
        const text = await file.text();
        const lines = text.split("\n").filter((line) => line.trim());

        // Skip header if present (check if first line looks like a header)
        const startIndex = lines[0]?.toLowerCase().includes("username") ? 1 : 0;

        const accounts: { username: string; password: string }[] = [];
        const errors: string[] = [];

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Handle both comma and tab separated values
            const parts = line.includes(",")
                ? line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""))
                : line.split("\t").map((p) => p.trim());

            if (parts.length < 2) {
                errors.push(`Line ${i + 1}: Invalid format (need username,password)`);
                continue;
            }

            const [username, password] = parts;
            if (!username || !password) {
                errors.push(`Line ${i + 1}: Empty username or password`);
                continue;
            }

            accounts.push({ username, password });
        }

        if (accounts.length === 0) {
            return NextResponse.json(
                { error: "No valid accounts found in CSV", errors },
                { status: 400 }
            );
        }

        // Create accounts in database
        const createdAccounts = await db.account.createMany({
            data: accounts.map((acc) => ({
                username: acc.username,
                password: encrypt(acc.password),
                productId: productId,
                serviceType: product.name,
                status: "AVAILABLE",
            })),
        });

        return NextResponse.json({
            success: true,
            imported: createdAccounts.count,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error("CSV Import Error:", error);
        return NextResponse.json(
            { error: "Import failed" },
            { status: 500 }
        );
    }
}
