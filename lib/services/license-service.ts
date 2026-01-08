
import { db } from "@/lib/db";
import { LicenseEventType, LicenseStatus } from "@prisma/client";

export class LicenseAssignmentService {
    /**
     * Atomically assigns a License Key from the pool to an Order/User.
     * Uses explicit transaction to prevent race conditions.
     */
    static async assignLicenseToOrder(
        orderId: string,
        userId: string | null | undefined,
        items: { productId: string; quantity: number }[]
    ) {
        return await db.$transaction(async (tx) => {
            const results = [];

            for (const item of items) {
                // Find available keys for this product
                const availableKeys = await tx.licenseKey.findMany({
                    where: {
                        productId: item.productId,
                        status: LicenseStatus.AVAILABLE
                    },
                    take: item.quantity
                });

                if (availableKeys.length < item.quantity) {
                    throw new Error(`Insufficient stock for product ${item.productId}. Needed ${item.quantity}, found ${availableKeys.length}`);
                }

                const keyIds = availableKeys.map(k => k.id);

                // Update them to ACTIVE
                await tx.licenseKey.updateMany({
                    where: { id: { in: keyIds } },
                    data: {
                        status: LicenseStatus.ACTIVE,
                        orderId: orderId,
                        userId: userId,
                        updatedAt: new Date()
                    }
                });

                // Log events
                await tx.licenseEventLog.createMany({
                    data: keyIds.map(id => ({
                        licenseKeyId: id,
                        type: LicenseEventType.ASSIGNED,
                        metadata: { orderId, userId, assignedAt: new Date().toISOString() }
                    }))
                });

                results.push({ productId: item.productId, assignedCount: item.quantity });
            }

            return results;
        });
    }

    /**
     * Revoke a license (e.g. Chargeback)
     */
    static async revokeLicense(keyId: string, reason: string) {
        return await db.$transaction(async (tx) => {
            const key = await tx.licenseKey.update({
                where: { id: keyId },
                data: { status: LicenseStatus.REVOKED }
            });

            await tx.licenseEventLog.create({
                data: {
                    licenseKeyId: keyId,
                    type: LicenseEventType.REVOKED,
                    metadata: { reason, revokedAt: new Date().toISOString() }
                }
            });

            return key;
        });
    }

    /**
     * Suspend all licenses for an Order (e.g. Dispute Opened)
     */
    static async suspendLicensesForOrder(orderId: string, reason: string) {
        return await db.$transaction(async (tx) => {
            const keys = await tx.licenseKey.findMany({
                where: { orderId: orderId, status: LicenseStatus.ACTIVE }
            });

            const keyIds = keys.map(k => k.id);

            if (keyIds.length === 0) return [];

            await tx.licenseKey.updateMany({
                where: { id: { in: keyIds } },
                data: { status: LicenseStatus.SUSPENDED }
            });

            await tx.licenseEventLog.createMany({
                data: keyIds.map(id => ({
                    licenseKeyId: id,
                    type: LicenseEventType.SUSPENDED,
                    metadata: { reason, suspendedAt: new Date().toISOString() }
                }))
            });

            return keyIds;
        });
    }

    /**
     * Restore suspended licenses for an Order (e.g. Dispute Won)
     */
    static async restoreLicensesForOrder(orderId: string, reason: string) {
        return await db.$transaction(async (tx) => {
            const keys = await tx.licenseKey.findMany({
                where: { orderId: orderId, status: LicenseStatus.SUSPENDED }
            });

            const keyIds = keys.map(k => k.id);

            if (keyIds.length === 0) return [];

            await tx.licenseKey.updateMany({
                where: { id: { in: keyIds } },
                data: { status: LicenseStatus.ACTIVE }
            });

            await tx.licenseEventLog.createMany({
                data: keyIds.map(id => ({
                    licenseKeyId: id,
                    type: LicenseEventType.RESTORED,
                    metadata: { reason, restoredAt: new Date().toISOString() }
                }))
            });

            return keyIds;
        });
    }

    /**
     * Revoke all licenses for an Order (e.g. Chargeback Lost / Refund)
     */
    static async revokeLicensesForOrder(orderId: string, reason: string) {
        return await db.$transaction(async (tx) => {
            const keys = await tx.licenseKey.findMany({
                where: { orderId: orderId, status: { in: [LicenseStatus.ACTIVE, LicenseStatus.SUSPENDED] } }
            });

            const keyIds = keys.map(k => k.id);

            if (keyIds.length === 0) return [];

            await tx.licenseKey.updateMany({
                where: { id: { in: keyIds } },
                data: { status: LicenseStatus.REVOKED }
            });

            await tx.licenseEventLog.createMany({
                data: keyIds.map(id => ({
                    licenseKeyId: id,
                    type: LicenseEventType.REVOKED,
                    metadata: { reason, revokedAt: new Date().toISOString() }
                }))
            });

            return keyIds;
        });
    }
}
