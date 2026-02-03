import { db } from "@/lib/db";
import {
    Send,
    RefreshCw,
    Download,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import Link from "next/link";
import { CampaignForm } from "./CampaignForm";
import { SubscriberTable } from "./SubscriberTable";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

async function getEmailData(page: number = 1) {
    const skip = (page - 1) * PAGE_SIZE;

    const [subscribers, totalSubscribers, campaigns] = await Promise.all([
        db.newsletterSubscriber.findMany({
            orderBy: { createdAt: "desc" },
            take: PAGE_SIZE,
            skip: skip,
            include: {
                user: {
                    select: { firstName: true, lastName: true }
                }
            }
        }),
        db.newsletterSubscriber.count(),
        db.broadcast.findMany({
            where: { type: "EMAIL" },
            orderBy: { createdAt: "desc" },
            take: 10
        })
    ]);

    return { subscribers, totalSubscribers, campaigns };
}

interface EmailPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function EmailPage({ searchParams }: EmailPageProps) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const { subscribers, totalSubscribers, campaigns } = await getEmailData(currentPage);

    // Note: This filter happens post-fetch on the current page, which is acceptable for display stats
    // but ideally we'd fetch stats separately. For now, we display total subscribers count.
    const activeSubscribersCount = await db.newsletterSubscriber.count({ where: { status: "subscribed" } });

    return (
        <div className="space-y-6">
            <AutoRefresh intervalMs={30000} />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Email Marketing</h1>
                    <p className="text-slate-400 mt-1">Manage newsletters and subscriber campaigns</p>
                </div>
                <Link href="/api/admin/export/subscribers" target="_blank">
                    <Button variant="outline" className="border-[#1e293b] text-slate-300 hover:bg-[#1e293b] hover:text-white gap-2">
                        <Download className="w-4 h-4" />
                        Export Subscribers
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="campaigns" className="space-y-4">
                <TabsList className="bg-[#0f172a] border border-[#1e293b]">
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                    <TabsTrigger value="subscribers">
                        Subscribers ({totalSubscribers})
                    </TabsTrigger>
                </TabsList>

                {/* Campaigns Tab */}
                <TabsContent value="campaigns" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Compose */}
                        <Card className="lg:col-span-2 bg-[#0f172a] border-[#1e293b]">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Send className="w-5 h-5 text-blue-500" />
                                    New Campaign
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Create and send emails to your {activeSubscribersCount} subscribers
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CampaignForm subscriberCount={activeSubscribersCount} />
                            </CardContent>
                        </Card>

                        {/* Recent Campaigns */}
                        <div className="space-y-4">
                            <Card className="bg-[#0f172a] border-[#1e293b] h-full">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">History</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {campaigns.length === 0 ? (
                                        <p className="text-slate-500 text-sm">No campaigns sent yet</p>
                                    ) : (
                                        campaigns.map((camp) => {
                                            const stats = camp.stats as { sent?: number; opened?: number } | null;
                                            return (
                                                <div key={camp.id} className="p-3 bg-[#1e293b]/30 rounded-lg border border-[#1e293b] space-y-2">
                                                    <div className="flex items-start justify-between">
                                                        <h4 className="text-sm font-medium text-white line-clamp-1 mr-2">{camp.subject}</h4>
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-500/10 text-green-500">
                                                            sent
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                                        <span>{camp.sentAt ? new Date(camp.sentAt).toLocaleDateString() : 'Draft'}</span>
                                                        {stats?.sent && <span>Sent to: {stats.sent}</span>}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Subscribers Tab */}
                <TabsContent value="subscribers">
                    <Card className="bg-[#0f172a] border-[#1e293b]">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Subscribers</CardTitle>
                                <CardDescription className="text-slate-400">Manage your newsletter audience</CardDescription>
                            </div>
                            <Button variant="outline" className="border-[#1e293b] text-slate-300 hover:bg-[#1e293b] hover:text-white gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Sync
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <SubscriberTable subscribers={subscribers.map(s => ({
                                id: s.id,
                                email: s.email,
                                status: s.status,
                                userName: s.user ? `${s.user.firstName || ''} ${s.user.lastName || ''}`.trim() : null,
                                joinedAt: s.createdAt.toISOString()
                            }))} />

                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1e293b]">
                                <div className="text-sm text-slate-500">
                                    Showing {subscribers.length} of {totalSubscribers} subscribers
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" disabled={currentPage <= 1} className="border-[#1e293b] text-slate-300 hover:text-white" asChild>
                                        <Link href={`/admin/email?page=${currentPage - 1}`}>
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Previous
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" disabled={currentPage * PAGE_SIZE >= totalSubscribers} className="border-[#1e293b] text-slate-300 hover:text-white" asChild>
                                        <Link href={`/admin/email?page=${currentPage + 1}`}>
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
