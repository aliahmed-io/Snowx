"use client";

import { useState } from "react";
import {
    ShieldAlert,
    Bell,
    Check,
    X,
    AlertTriangle,
    Info,
    ShieldCheck,
    Lock
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Alert {
    id: string;
    type: string;
    level: "low" | "medium" | "high" | "critical";
    message: string;
    timestamp: string;
    isRead: boolean;
    source: string;
}

export default function SecurityAlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([
        {
            id: "alt_1",
            type: "Suspicious Login",
            level: "high",
            message: "Multiple failed login attempts detected from IP 45.23.12.98 (Russia)",
            timestamp: "2026-01-08T08:45:00.000Z",
            isRead: false,
            source: "Auth System"
        },
        {
            id: "alt_2",
            type: "API Rate Limit",
            level: "medium",
            message: "Client application 8f92-xxxx exceeded rate limit (1000 req/min)",
            timestamp: "2026-01-08T07:00:00.000Z",
            isRead: false,
            source: "API Gateway"
        },
        {
            id: "alt_3",
            type: "Database Backup",
            level: "low",
            message: "Daily backup completed successfully. Size: 1.2GB",
            timestamp: "2026-01-07T21:00:00.000Z",
            isRead: true,
            source: "System Task"
        },
        {
            id: "alt_4",
            type: "Privilege Escalation",
            level: "critical",
            message: "User usr_777 attempted to access /admin/settings without permission",
            timestamp: "2026-01-08T07:00:00.000Z",
            isRead: false,
            source: "Access Control"
        }
    ]);

    const handleMarkAsRead = (id: string) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
        toast.success("Alert marked as read");
    };

    const handleDismiss = (id: string) => {
        setAlerts(alerts.filter(a => a.id !== id));
        toast.success("Alert dismissed");
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case "critical": return "text-red-500 border-red-500/50 bg-red-500/10";
            case "high": return "text-orange-500 border-orange-500/50 bg-orange-500/10";
            case "medium": return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10";
            case "low": return "text-blue-500 border-blue-500/50 bg-blue-500/10";
            default: return "text-slate-500 border-slate-500/50 bg-slate-500/10";
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case "critical": return <ShieldAlert className="w-5 h-5 text-red-500" />;
            case "high": return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case "medium": return <Info className="w-5 h-5 text-yellow-500" />;
            case "low": return <Check className="w-5 h-5 text-blue-500" />;
            default: return <Bell className="w-5 h-5 text-slate-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Security Alerts</h1>
                    <p className="text-slate-400 mt-1">Real-time security notifications and system warnings</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-950/20 px-3 py-1">
                        {alerts.filter(a => !a.isRead && a.level === "critical").length} Critical
                    </Badge>
                    <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-950/20 px-3 py-1">
                        {alerts.filter(a => !a.isRead && a.level === "high").length} High Priority
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Alert Feed */}
                <div className="lg:col-span-2 space-y-4">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="bg-[#0f172a] border border-[#1e293b]">
                            <TabsTrigger value="all">All Alerts</TabsTrigger>
                            <TabsTrigger value="unread">Unread</TabsTrigger>
                            <TabsTrigger value="critical">Critical</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-4 space-y-4">
                            {alerts.map((alert) => (
                                <Card key={alert.id} className={`bg-[#0f172a] border-[#1e293b] transition-all hover:border-slate-700 ${!alert.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
                                    <div className="flex p-4 gap-4">
                                        <div className={`p-3 rounded-full h-fit shrink-0 ${alert.level === 'critical' ? 'bg-red-950/30' : 'bg-[#1e293b]'}`}>
                                            {getLevelIcon(alert.level)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                                                        {alert.type}
                                                        <Badge variant="outline" className={`text-xs ml-2 h-5 ${getLevelColor(alert.level)}`}>
                                                            {alert.level}
                                                        </Badge>
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                        <Lock className="w-3 h-3" />
                                                        {alert.source} • {new Date(alert.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1">
                                                    {!alert.isRead && (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-950/30" onClick={() => handleMarkAsRead(alert.id)} title="Mark as read">
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-950/30" onClick={() => handleDismiss(alert.id)} title="Dismiss">
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-300 pt-1 leading-relaxed">
                                                {alert.message}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card className="bg-[#0f172a] border-[#1e293b]">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Security Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Firewall</span>
                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">DDoS Protection</span>
                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">Enabled</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">SSL Certificate</span>
                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">Valid</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">2FA Enforcement</span>
                                <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-0">Optional</Badge>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-[#1e293b] hover:bg-[#2d3a4f] text-white">
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Security Audit
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="bg-linear-to-br from-blue-900/20 to-[#0f172a] border-[#1e293b] border-l-4 border-l-blue-500">
                        <CardHeader>
                            <CardTitle className="text-white text-base">Quick Action</CardTitle>
                            <CardDescription className="text-slate-400">Lock down system if under attack</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="w-full bg-red-900/80 hover:bg-red-800 text-white">
                                <Lock className="w-4 h-4 mr-2" />
                                Enable Lockdown Mode
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
