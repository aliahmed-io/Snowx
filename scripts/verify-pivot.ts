import 'dotenv/config';
import { AccountService } from "@/lib/services/account-service";
import { db } from "@/lib/db";

async function main() {
    console.log("🚀 Starting Verification of Account System Pivot...");

    // 1. Verify Clean Slate / Seed Integrity
    const products = await db.product.findMany({ take: 1 });
    if (products.length === 0) {
        throw new Error("❌ No products found. Did you run the seed?");
    }
    const product = products[0];
    console.log(`✅ Found Product: ${product.name}`);

    // 2. Add Account (Simulating Admin Inventory Add)
    console.log("\n📦 Testing Account Addition...");
    const timestamp = Date.now();
    const accountData = {
        serviceType: "Spotify",
        username: `test_user_verify_${timestamp}@example.com`,
        password: "super_secure_password_123",
        productId: product.id,
        notes: "Verification Script Account"
    };

    const newAccount = await AccountService.addAccount(accountData);
    if (!newAccount) throw new Error("Failed to create account");
    console.log(`✅ Created Account ID: ${newAccount.id} [${newAccount.status}]`);

    // 3. Create Order & Assign Account (Simulating Checkout)
    console.log("\n💳 Testing Order & Assignment...");
    const user = await db.user.findFirst();
    if (!user) throw new Error("No user found for order simulation");

    const order = await db.order.create({
        data: {
            orderNumber: `TEST-ORDER-${Date.now()}`,
            total: 10,
            subtotal: 10,
            tax: 0,
            shipping: 0,
            status: "PROCESSING", // Initially processing
            userId: user.id
        }
    });

    // Manually assign (AccountService.assignAccountsToOrder uses transaction, mocking call here or calling it directly)
    // We already have a specific account we want to use for test? No, let's use the service naturally.
    // The service requires a list of items.

    // We need to ensure the account we just made is AVAILABLE. It should be by default.
    // Let's assume the service picks *any* available account for that product.

    // Actually, 'assignAccountsToOrder' is designed to be called by Stripe/PayPal webhook.
    await AccountService.assignAccountsToOrder(
        order.id,
        user.id,
        [{ productId: product.id, quantity: 1 }]
    );

    // Verify assignment
    const assignedAccount = await db.account.findFirst({
        where: { orderId: order.id }
    });

    if (!assignedAccount) throw new Error("❌ No account assigned to order");
    if (assignedAccount.status !== "SOLD") throw new Error(`❌ status is ${assignedAccount.status}, expected SOLD`);
    console.log(`✅ Account assigned successfully. Status: ${assignedAccount.status}`);

    // 4. Test Replacement (Simulating Admin Action)
    console.log("\n🔄 Testing Replacement Workflow...");
    const replacementReason = "Verification Script Auto-Replace";

    // Ensure we have ANOTHER available account for replacement to work
    await AccountService.addAccount({
        ...accountData,
        username: "replacement_candidate@example.com"
    });

    const replaced = await AccountService.replaceAccount(assignedAccount.id, replacementReason);

    if (replaced.id === assignedAccount.id) throw new Error("❌ Replacement returned same account ID");

    // Check old account status
    const oldAccount = await db.account.findUnique({ where: { id: assignedAccount.id } });
    if (oldAccount?.status !== "REPLACED") throw new Error(`❌ Old account status is ${oldAccount?.status}, expected REPLACED`);

    console.log(`✅ Replacement successful. New Account ID: ${replaced.id}`);
    console.log(`   Old Account Status: ${oldAccount.status} (Reason: ${oldAccount.notes})`);

    // 5. Test Replacement Limits
    console.log("\n🛑 Testing Replacement Limits...");
    // We already did 1 replacement. Let's do another one (Total 2).
    // Need stock for 2nd replacement
    await AccountService.addAccount({
        ...accountData,
        username: "replacement_candidate_2@example.com"
    });

    const replaced2 = await AccountService.replaceAccount(replaced.id, "Second Failure");
    console.log(`✅ 2nd Replacement successful (Limit reached). New ID: ${replaced2.id}`);

    // Try 3rd replacement -> Should Fail
    try {
        await AccountService.addAccount({
            ...accountData,
            username: "replacement_candidate_3@example.com"
        });
        await AccountService.replaceAccount(replaced2.id, "Third Failure");
        throw new Error("❌ Limits failed: Allowed 3rd replacement!");
    } catch (error: unknown) {
        if (String(error).includes("Maximum replacements")) {
            console.log("✅ Replacement Limit Enforced (Max 2).");
        } else {
            throw error;
        }
    }

    // 6. Test Duplicate Constraint
    console.log("\n👯 Testing Duplicate Constraint...");
    try {
        await AccountService.addAccount(accountData);
        throw new Error("❌ Duplicate Check failed: Allowed duplicate account!");
    } catch (error: unknown) {
        const errorStr = error instanceof Error ? error.message : String(error);
        if (errorStr.includes("Unique constraint") || errorStr.includes("P2002")) {
            console.log("✅ Duplicate Constraint Enforced.");
        } else {
            console.error("Unknown error caught:", error);
            throw error;
        }
    }

    console.log("\n🎉 Verification Completed Successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Verification Failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
