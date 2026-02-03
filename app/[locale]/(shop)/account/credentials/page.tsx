import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { CredentialList } from "./credential-list";

export default async function MyLicensesPage() {
    // Real Auth
    const user = await requireAuth();

    const accounts = await db.account.findMany({
        where: {
            userId: user.id
        },
        include: {
            product: true,
            order: true
        },
        orderBy: {
            purchaseDate: 'desc'
        }
    });

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Credentials</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your purchased accounts and subscriptions.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                <CredentialList accounts={accounts} />
            </div>
        </div>
    );
}
