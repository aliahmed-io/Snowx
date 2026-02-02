'use server'

import { AccountService } from "@/lib/services/account-service";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function replaceAccountAction(oldAccountId: string, reason: string) {
    // Verify Admin Auth
    await requireAdmin();

    try {
        const newAccount = await AccountService.replaceAccount(oldAccountId, reason);
        revalidatePath("/admin/orders");
        revalidatePath(`/admin/orders/[id]`); // Next.js dynamic path revalidation might need specific ID
        return { success: true, newAccountId: newAccount.id };
    } catch (error) {
        console.error("Replacement failed:", error);
        return { success: false, error: String(error) };
    }
}
