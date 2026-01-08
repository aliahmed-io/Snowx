'use server'

import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function revealCredential(accountId: string) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
        throw new Error("Unauthorized");
    }

    const dbUser = await db.user.findUnique({
        where: { kindeId: user.id }
    });

    if (!dbUser) {
        throw new Error("User not found");
    }

    const account = await db.account.findUnique({
        where: { id: accountId }
    });

    if (!account) {
        throw new Error("Account not found");
    }

    if (account.userId !== dbUser.id) {
        throw new Error("Unauthorized access to this account");
    }

    // Decrypt and return
    try {
        const password = decrypt(account.password);
        return { password };
    } catch (e) {
        console.error("Decryption failed", e);
        throw new Error("Failed to decrypt credentials");
    }
}
