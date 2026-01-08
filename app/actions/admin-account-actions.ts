'use server'

import { AccountService } from "@/lib/services/account-service";
import { revalidatePath } from "next/cache";

export async function replaceAccountAction(oldAccountId: string, reason: string) {
    // Ideally add Admin Auth check here if not covered by middleware/layout
    // const session = await getKindeServerSession().getUser();
    // if (!isAdmin(session)) throw new Error("Unauthorized");

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
