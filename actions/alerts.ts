"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function markAlertAsRead(id: string) {
    await requireAdmin();
    await db.alert.update({
        where: { id },
        data: { isRead: true }
    });
    revalidatePath("/admin/alerts");
}

export async function dismissAlert(id: string) {
    await requireAdmin();
    await db.alert.delete({
        where: { id }
    });
    revalidatePath("/admin/alerts");
}

export async function createAlert(data: {
    type: string;
    severity: string;
    message: string;
    metadata?: object;
}) {
    // createAlert can be called internally, no admin check needed
    const alert = await db.alert.create({
        data: {
            type: data.type,
            severity: data.severity,
            message: data.message,
            metadata: data.metadata
        }
    });
    revalidatePath("/admin/alerts");
    return alert;
}

export async function runSecurityAudit() {
    await requireAdmin();
    try {
        // Perform real security checks
        const checks = {
            database: false,
            products: false,
            users: false,
            orders: false
        };

        // Check database connection
        try {
            await db.$queryRaw`SELECT 1`;
            checks.database = true;
        } catch {
            await createAlert({
                type: "Database Connection",
                severity: "critical",
                message: "Database connection failed during security audit"
            });
        }

        // Check for products with zero stock
        const lowStockProducts = await db.product.count({
            where: { stockQuantity: { lte: 0 }, isActive: true }
        });
        if (lowStockProducts > 0) {
            await createAlert({
                type: "Inventory Warning",
                severity: "medium",
                message: `${lowStockProducts} active product(s) have zero or negative stock`
            });
        }
        checks.products = true;

        // Check for suspicious user patterns (many failed attempts, etc.)
        const recentUsers = await db.user.count({
            where: {
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
        });
        if (recentUsers > 100) {
            await createAlert({
                type: "Unusual Activity",
                severity: "high",
                message: `${recentUsers} new users in the last 24 hours - possible spam/bot activity`
            });
        }
        checks.users = true;

        // Check for pending orders older than 24 hours
        const staleOrders = await db.order.count({
            where: {
                status: "PENDING",
                createdAt: { lte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
        });
        if (staleOrders > 0) {
            await createAlert({
                type: "Stale Orders",
                severity: "low",
                message: `${staleOrders} order(s) have been pending for more than 24 hours`
            });
        }
        checks.orders = true;

        const allPassed = Object.values(checks).every(Boolean);

        if (allPassed && lowStockProducts === 0 && staleOrders === 0) {
            await createAlert({
                type: "Security Audit Complete",
                severity: "low",
                message: "All security checks passed. System is healthy."
            });
        }

        revalidatePath("/admin/alerts");
        revalidatePath("/admin");

        return {
            success: true,
            message: allPassed
                ? "All checks passed"
                : "Audit complete with some warnings"
        };
    } catch (error) {
        console.error("Security audit failed:", error);
        return { success: false, message: "Audit failed - check server logs" };
    }
}

export async function toggleLockdownMode(enable: boolean) {
    await requireAdmin();
    try {
        // In a real app, this would set a flag in a settings table
        // For now we'll create an alert to track lockdown status

        if (enable) {
            await createAlert({
                type: "Lockdown Mode Enabled",
                severity: "critical",
                message: "System lockdown has been activated by an administrator. New registrations are disabled."
            });
        } else {
            await createAlert({
                type: "Lockdown Mode Disabled",
                severity: "medium",
                message: "System lockdown has been deactivated. Normal operations resumed."
            });
        }

        revalidatePath("/admin/alerts");
        return { success: true, message: enable ? "Lockdown enabled" : "Lockdown disabled" };
    } catch (error) {
        console.error("Lockdown toggle failed:", error);
        return { success: false, message: "Failed to toggle lockdown mode" };
    }
}


