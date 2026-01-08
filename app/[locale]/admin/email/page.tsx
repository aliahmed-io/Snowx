"use client";

import { useState, FormEvent } from "react";
import {
    Send,
    MoreHorizontal,
    Trash2,
    Copy,
    RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Subscriber {
    id: string;
    email: string;
    status: "subscribed" | "unsubscribed";
    joinedAt: string;
}

interface Campaign {
    id: string;
    subject: string;
    sentAt: string | null;
    status: "draft" | "sent";
    recipients: number;
    openRate?: string;
}

export default function EmailPage() {
    const [activeTab, setActiveTab] = useState("campaigns");

    // Placeholder data
    const [subscribers] = useState<Subscriber[]>([
        { id: "sub_1", email: "alex@example.com", status: "subscribed", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
        { id: "sub_2", email: "sarah@design.co", status: "subscribed", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString() },
        { id: "sub_3", email: "mike@tech.io", status: "unsubscribed", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString() },
        { id: "sub_4", email: "emma@snowx.com", status: "subscribed", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
    ]);

    const [campaigns, setCampaigns] = useState<Campaign[]>([
        { id: "cam_1", subject: "Winter Collection Early Access", sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), status: "sent", recipients: 2450, openRate: "42%" },
        { id: "cam_2", subject: "New Features Update", sentAt: null, status: "draft", recipients: 0 },
    ]);

    const handleSendCampaign = (e: FormEvent) => {
        e.preventDefault();
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Sending campaign...',
                success: 'Campaign scheduled for delivery!',
                error: 'Failed to send campaign'
            }
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Email Marketing</h1>
                    <p className="text-slate-400 mt-1">Manage newsletters and subscriber campaigns</p>
                </div>
            </div>

            <Tabs defaultValue="campaigns" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList className="bg-[#0f172a] border border-[#1e293b]">
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                    <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
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
                                    Create and send emails to your subscribers
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSendCampaign} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Subject Line</label>
                                        <Input placeholder="Enter a catchy subject..." className="bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Content</label>
                                        <Textarea placeholder="Write your email content here (Markdown supported)..." rows={10} className="bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600 font-mono text-sm" required />
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <p className="text-xs text-slate-500">Targeting: All Subscribers ({subscribers.filter(s => s.status === 'subscribed').length})</p>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="outline" className="border-[#1e293b] text-slate-300 hover:bg-[#1e293b] hover:text-white">Save Draft</Button>
                                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Now
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Recent Campaigns */}
                        <div className="space-y-4">
                            <Card className="bg-[#0f172a] border-[#1e293b] h-full">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">History</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {campaigns.map((camp) => (
                                        <div key={camp.id} className="p-3 bg-[#1e293b]/30 rounded-lg border border-[#1e293b] space-y-2">
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-sm font-medium text-white line-clamp-1 mr-2">{camp.subject}</h4>
                                                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${camp.status === 'sent' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-400'}`}>
                                                    {camp.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <span>{camp.sentAt ? new Date(camp.sentAt).toLocaleDateString() : 'Last edited just now'}</span>
                                                {camp.openRate && <span>Open Rate: {camp.openRate}</span>}
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="ghost" className="w-full text-sm text-slate-400 hover:text-white">View All History</Button>
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
                            <div className="rounded-md border border-[#1e293b] overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-[#1e293b]">
                                        <TableRow className="border-b border-[#020817] hover:bg-transparent">
                                            <TableHead className="text-slate-300">Email</TableHead>
                                            <TableHead className="text-slate-300">Status</TableHead>
                                            <TableHead className="text-slate-300">Joined</TableHead>
                                            <TableHead className="text-right text-slate-300">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subscribers.map((sub) => (
                                            <TableRow key={sub.id} className="border-b border-[#1e293b] hover:bg-[#1e293b]/50 last:border-0">
                                                <TableCell className="font-medium text-slate-200">{sub.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`border-0 ${sub.status === 'subscribed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        {sub.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-400 text-sm">{new Date(sub.joinedAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-[#1e293b] border-[#020817] text-slate-200">
                                                            <DropdownMenuItem className="cursor-pointer">
                                                                <Copy className="mr-2 h-4 w-4" />
                                                                Copy Email
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-[#020817]" />
                                                            <DropdownMenuItem className="text-red-400 cursor-pointer focus:bg-red-900/20 focus:text-red-300">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
