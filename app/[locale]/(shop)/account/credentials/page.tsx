import { db } from "@/lib/db";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Commented out for dev/mock
import { CredentialList } from "./credential-list";

export default async function MyLicensesPage() {
    // Mock Auth for Dev - User ID from seed
    // const { getUser } = getKindeServerSession();
    // const user = await getUser();
    // if (!user) return null; // redirect("/api/auth/login");

    // Hardcoded Demo User ID from seed
    const demoUser = await db.user.findFirst({ where: { email: "demo@snowx.com" } });

    if (!demoUser) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold">Demo User not found</h1>
                <p>Please seed the database.</p>
            </div>
        );
    }

    const accounts = await db.account.findMany({
        where: {
            userId: demoUser.id
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
