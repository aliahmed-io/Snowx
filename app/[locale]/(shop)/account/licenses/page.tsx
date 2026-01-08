
import { db } from "@/lib/db";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Commented out for dev/mock
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

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

    const licenses = await db.licenseKey.findMany({
        where: {
            userId: demoUser.id
        },
        include: {
            product: true,
            order: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Licenses</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your digital products and license keys.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {licenses.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                            <p className="text-lg text-muted-foreground">You don&apos;t have any licenses yet.</p>
                            <Button asChild>
                                <Link href="/products">Browse Store</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>License Key</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {licenses.map((license) => (
                                    <TableRow key={license.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                {license.product.images[0] && (
                                                    <Image
                                                        src={license.product.images[0]}
                                                        alt={license.product.name}
                                                        width={32}
                                                        height={32}
                                                        className="rounded object-cover bg-muted"
                                                    />
                                                )}
                                                <span>{license.product.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                                {license.key}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                license.status === 'ACTIVE' ? 'default' :
                                                    license.status === 'REVOKED' ? 'destructive' : 'secondary'
                                            }>
                                                {license.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {license.order?.orderNumber || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" title="Copy Key">
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}
