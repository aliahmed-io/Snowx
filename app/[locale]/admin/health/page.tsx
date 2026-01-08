"use client";

import { useState } from "react";
import {
    Activity,
    Database,
    Server,
    Wifi,
    Cpu,
    HardDrive,
    Clock,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SystemStatus {
    name: string;
    status: "operational" | "degraded" | "down";
    uptime: string;
    latency: string;
    lastUpdated: string;
}

export default function SystemHealthPage() {
    const [lastRefreshed, setLastRefreshed] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    // Placeholder data - in a real app, fetch from an API route
    const systems: SystemStatus[] = [
        { name: "Database Primary (Postgres)", status: "operational", uptime: "99.99%", latency: "45ms", lastUpdated: "Just now" },
        { name: "Redis Cache Cluster", status: "operational", uptime: "100%", latency: "12ms", lastUpdated: "Just now" },
        { name: "Storage Service (S3)", status: "operational", uptime: "99.95%", latency: "120ms", lastUpdated: "Just now" },
        { name: "Authentication (Kinde)", status: "operational", uptime: "99.9%", latency: "85ms", lastUpdated: "Just now" },
        { name: "Payment Gateway (Stripe)", status: "operational", uptime: "100%", latency: "230ms", lastUpdated: "Just now" },
        { name: "Email Service (Resend)", status: "degraded", uptime: "98.5%", latency: "450ms", lastUpdated: "2 mins ago" },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "operational": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case "degraded": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case "down": return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Activity className="w-5 h-5 text-slate-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "operational": return "text-green-500";
            case "degraded": return "text-yellow-500";
            case "down": return "text-red-500";
            default: return "text-slate-500";
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            setLastRefreshed(new Date());
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Health</h1>
                    <p className="text-slate-400 mt-1">Monitor infrastructure status and performance metrics</p>
                </div>
                <Button
                    variant="outline"
                    className="border-[#1e293b] text-slate-300 hover:bg-[#1e293b] hover:text-white gap-2"
                    onClick={handleRefresh}
                    disabled={isLoading}
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Overall Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-[#0f172a] border-[#1e293b]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Overall Health</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">98%</div>
                        <p className="text-xs text-slate-500">All systems operational</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0f172a] border-[#1e293b]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">API Latency</CardTitle>
                        <Wifi className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">45ms</div>
                        <p className="text-xs text-slate-500">global avg</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0f172a] border-[#1e293b]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Error Rate</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">0.02%</div>
                        <p className="text-xs text-slate-500">Last 24 hours</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0f172a] border-[#1e293b]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Database Load</CardTitle>
                        <Database className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">24%</div>
                        <p className="text-xs text-slate-500">Connections used</p>
                    </CardContent>
                </Card>
            </div>

            {/* Service Status List */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-[#0f172a] border-[#1e293b]">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-white">Service Status</CardTitle>
                        <CardDescription className="text-slate-400">Real-time availability of core services</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {systems.map((system) => (
                            <div key={system.name} className="flex items-center justify-between border-b border-[#1e293b] pb-4 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(system.status)}
                                        <p className="font-medium text-slate-200">{system.name}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 ml-7">Latency: {system.latency} • Uptime: {system.uptime}</p>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className={`capitalize border-0 bg-opacity-10 ${system.status === 'operational' ? 'bg-green-500 text-green-500' :
                                        system.status === 'degraded' ? 'bg-yellow-500 text-yellow-500' : 'bg-red-500 text-red-500'
                                        }`}>
                                        {system.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Server Resources */}
                <Card className="bg-[#0f172a] border-[#1e293b]">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-white">Server Resources</CardTitle>
                        <CardDescription className="text-slate-400">Usage metrics for the current Vercel instance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Cpu className="w-4 h-4 text-blue-500" />
                                    <span>CPU Usage</span>
                                </div>
                                <span className="text-white font-mono">42%</span>
                            </div>
                            <Progress value={42} className="h-2 bg-[#1e293b]" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <HardDrive className="w-4 h-4 text-purple-500" />
                                    <span>Memory Usage</span>
                                </div>
                                <span className="text-white font-mono">68%</span>
                            </div>
                            <Progress value={68} className="h-2 bg-[#1e293b]" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Server className="w-4 h-4 text-orange-500" />
                                    <span>Function Invocation</span>
                                </div>
                                <span className="text-white font-mono">1.2k/min</span>
                            </div>
                            <Progress value={25} className="h-2 bg-[#1e293b]" />
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
                            </div>
                            <span>Region: us-east-1</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
