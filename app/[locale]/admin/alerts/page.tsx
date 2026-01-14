import { db } from "@/lib/db";
import {
    ShieldAlert,
    Bell,
    AlertTriangle,
    Info,
    ShieldCheck,
    Lock,
    Check
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertActions } from "./AlertActions";
import { SecurityAuditButton, LockdownButton } from "./SecurityButtons";

export const dynamic = "force-dynamic";

export default async function SecurityAlertsPage() {
    // Fetch real alerts from database
    const alerts = await db.alert.findMany({
        orderBy: { createdAt: "desc" },
        take: 50
    });

    const getLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case "critical": return "text-red-500 border-red-500/50 bg-red-500/10";
            case "high": return "text-orange-500 border-orange-500/50 bg-orange-500/10";
            case "medium": return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10";
            case "low": return "text-blue-500 border-blue-500/50 bg-blue-500/10";
            default: return "text-slate-500 border-slate-500/50 bg-slate-500/10";
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level.toLowerCase()) {
            case "critical": return <ShieldAlert className="w-5 h-5 text-red-500" />;
            case "high": return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case "medium": return <Info className="w-5 h-5 text-yellow-500" />;
            case "low": return <Check className="w-5 h-5 text-blue-500" />;
            default: return <Bell className="w-5 h-5 text-slate-500" />;
        }
    };

    const criticalCount = alerts.filter(a => !a.isRead && a.severity.toLowerCase() === "critical").length;
    const highCount = alerts.filter(a => !a.isRead && a.severity.toLowerCase() === "high").length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Security Alerts</h1>
                    <p className="text-slate-400 mt-1">Real-time security notifications and system warnings</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-950/20 px-3 py-1">
                        {criticalCount} Critical
                    </Badge>
                    <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-950/20 px-3 py-1">
                        {highCount} High Priority
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Alert Feed */}
                <div className="lg:col-span-2 space-y-4">
                    {alerts.length === 0 ? (
                        <Card className="bg-[#0f172a] border-[#1e293b]">
                            <CardContent className="py-12 text-center text-slate-500">
                                <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-green-500" />
                                <p className="text-lg font-medium text-white">All Clear</p>
                                <p>No security alerts at this time.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        alerts.map((alert) => (
                            <Card key={alert.id} className={`bg-[#0f172a] border-[#1e293b] transition-all hover:border-slate-700 ${!alert.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
                                <div className="flex p-4 gap-4">
                                    <div className={`p-3 rounded-full h-fit shrink-0 ${alert.severity.toLowerCase() === 'critical' ? 'bg-red-950/30' : 'bg-[#1e293b]'}`}>
                                        {getLevelIcon(alert.severity)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                                                    {alert.type}
                                                    <Badge variant="outline" className={`text-xs ml-2 h-5 ${getLevelColor(alert.severity)}`}>
                                                        {alert.severity}
                                                    </Badge>
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                    <Lock className="w-3 h-3" />
                                                    {new Date(alert.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <AlertActions alertId={alert.id} isRead={alert.isRead} />
                                        </div>
                                        <p className="text-sm text-slate-300 pt-1 leading-relaxed">
                                            {alert.message}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card className="bg-[#0f172a] border-[#1e293b]">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Security Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Database</span>
                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">Connected</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">SSL Certificate</span>
                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">Valid</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Auth Provider</span>
                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">Kinde Active</Badge>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <SecurityAuditButton />
                        </CardFooter>
                    </Card>

                    <Card className="bg-linear-to-br from-blue-900/20 to-[#0f172a] border-[#1e293b] border-l-4 border-l-blue-500">
                        <CardHeader>
                            <CardTitle className="text-white text-base">Quick Action</CardTitle>
                            <CardDescription className="text-slate-400">Lock down system if under attack</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LockdownButton />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
