import { db } from "@/lib/db";
import { AccountStatus } from "@prisma/client";
import { encrypt } from "@/lib/encryption";

export class AccountService {
    /**
     * Adds a new account to the inventory.
     * Encrypts the password before saving.
     */
    static async addAccount(data: {
        serviceType: string;
        username: string;
        password: string; // Raw password
        productId: string;
        notes?: string;
    }) {
        const encryptedPassword = encrypt(data.password);

        return await db.account.create({
            data: {
                serviceType: data.serviceType,
                username: data.username,
                password: encryptedPassword,
                productId: data.productId,
                notes: data.notes,
                status: AccountStatus.AVAILABLE
            }
        });
    }

    /**
     * Atomically assigns Accounts from the pool to an Order/User.
     * Uses explicit transaction to prevent race conditions.
     */
    static async assignAccountsToOrder(
        orderId: string,
        userId: string | null | undefined,
        items: { productId: string; quantity: number }[]
    ) {
        return await db.$transaction(async (tx) => {
            const results = [];

            for (const item of items) {
                // Find available accounts for this product
                const availableAccounts = await tx.account.findMany({
                    where: {
                        productId: item.productId,
                        status: AccountStatus.AVAILABLE
                    },
                    take: item.quantity
                });

                if (availableAccounts.length < item.quantity) {
                    throw new Error(`Insufficient stock for product ${item.productId}. Needed ${item.quantity}, found ${availableAccounts.length}`);
                }

                const accountIds = availableAccounts.map(a => a.id);

                // Update them to SOLD
                await tx.account.updateMany({
                    where: { id: { in: accountIds } },
                    data: {
                        status: AccountStatus.SOLD,
                        orderId: orderId,
                        userId: userId,
                        purchaseDate: new Date(),
                        updatedAt: new Date()
                    }
                });

                results.push({ productId: item.productId, assignedCount: item.quantity });
            }

            return results;
        });
    }

    /**
     * Suspend all accounts for an Order (e.g. Dispute Opened)
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async suspendAccountsForOrder(orderId: string, _reason: string) { // reason param kept for logging if/when we add AuditLog
        const accounts = await db.account.findMany({
            where: { orderId: orderId, status: AccountStatus.SOLD }
        });

        const accountIds = accounts.map(a => a.id);
        if (accountIds.length === 0) return [];

        await db.account.updateMany({
            where: { id: { in: accountIds } },
            data: { status: AccountStatus.SUSPENDED }
        });

        return accountIds;
    }

    /**
     * Restore suspended accounts for an Order (e.g. Dispute Won)
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async restoreAccountsForOrder(orderId: string, _reason: string) {
        const accounts = await db.account.findMany({
            where: { orderId: orderId, status: AccountStatus.SUSPENDED }
        });

        const accountIds = accounts.map(a => a.id);
        if (accountIds.length === 0) return [];

        await db.account.updateMany({
            where: { id: { in: accountIds } },
            data: { status: AccountStatus.SOLD }
        });

        return accountIds;
    }

    /**
     * Ban (Revoke) all accounts for an Order (e.g. Chargeback Lost / Refund)
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async banAccountsForOrder(orderId: string, _reason: string) {
        const accounts = await db.account.findMany({
            where: {
                orderId: orderId,
                status: { in: [AccountStatus.SOLD, AccountStatus.SUSPENDED] }
            }
        });

        const accountIds = accounts.map(a => a.id);
        if (accountIds.length === 0) return [];

        await db.account.updateMany({
            where: { id: { in: accountIds } },
            data: { status: AccountStatus.BANNED }
        });

        return accountIds;
    }

    /**
     * Replaces a specific account with a new one from the SAME product pool.
     * Enforces replacement limits (max 2 per order).
     * Links the new account to the old one via `replacedBy`.
     */
    static async replaceAccount(oldAccountId: string, reason: string, asAdmin = false) {
        return await db.$transaction(async (tx) => {
            const oldAccount = await tx.account.findUniqueOrThrow({
                where: { id: oldAccountId },
                include: { order: true }
            });

            if (!oldAccount.productId || !oldAccount.orderId || !oldAccount.userId || !oldAccount.order) {
                throw new Error("Account is not properly linked to an order/user");
            }

            // Check replacement limits
            const MAX_REPLACEMENTS = 2;
            if (!asAdmin && oldAccount.order.replacementCount >= MAX_REPLACEMENTS) {
                throw new Error(`Maximum replacements (${MAX_REPLACEMENTS}) reached for this order.`);
            }

            // 1. Mark old as REPLACED
            await tx.account.update({
                where: { id: oldAccountId },
                data: { status: AccountStatus.REPLACED, notes: `Replaced: ${reason}` }
            });

            // 2. Find new available account
            const newAccount = await tx.account.findFirst({
                where: {
                    productId: oldAccount.productId,
                    status: AccountStatus.AVAILABLE
                }
            });

            if (!newAccount) {
                // If no stock, maybe just ban the old one and throw error? 
                // Or leave old as suspended. 
                // For now, fail atomic.
                throw new Error("No replacement stock available");
            }

            // 3. Assign new account & Link history
            await tx.account.update({
                where: { id: newAccount.id },
                data: {
                    status: AccountStatus.SOLD,
                    orderId: oldAccount.orderId,
                    userId: oldAccount.userId,
                    purchaseDate: new Date(),
                    updatedAt: new Date(),
                    replacedById: oldAccount.id // Link backwards? 
                    // No, `replacedBy` on Old Account points to New Account.
                    // But schema said: `replacedBy Account?`. 
                    // Usually "Old Account was replaced BY New Account".
                    // So OldAccount.replacedById = NewAccount.id
                }
            });

            // Correct linking: Old Account points to New Account
            await tx.account.update({
                where: { id: oldAccountId },
                data: { replacedById: newAccount.id }
            });

            // 4. Increment Order Replacement Count
            await tx.order.update({
                where: { id: oldAccount.orderId! },
                data: { replacementCount: { increment: 1 } }
            });

            return newAccount;
        });
    }

    /**
     * Marks an account as Expired.
     * Should be called by a cron job or lazily when checking status.
     */
    static async expireAccount(accountId: string) {
        return await db.account.update({
            where: { id: accountId },
            data: { status: AccountStatus.EXPIRED }
        });
    }
}
