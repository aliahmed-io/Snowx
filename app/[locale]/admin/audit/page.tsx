import { db } from "@/lib/db";
import {
    FileText,
    User,
    Shield,
    ShoppingCart,
    Package,
    Settings,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
    // Fetch real audit logs from database
    const logs = await db.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            user: {
                select: { email: true, firstName: true, lastName: true }
            }
        }
    });

    const getActionIcon = (type: string) => {
        switch (type) {
            case "ORDER": return <ShoppingCart className="w-4 h-4 text-purple-400" />;
            case "PRODUCT": return <Package className="w-4 h-4 text-blue-400" />;
            case "USER": return <User className="w-4 h-4 text-green-400" />;
            case "AUTH": return <Shield className="w-4 h-4 text-red-400" />;
            case "SYSTEM": return <Settings className="w-4 h-4 text-slate-400" />;
            default: return <FileText className="w-4 h-4 text-slate-400" />;
        }
    };

    const getSeverityFromAction = (action: string) => {
        if (action.includes("DELETE") || action.includes("FAILED")) return "critical";
        if (action.includes("UPDATE") || action.includes("REFUND")) return "warning";
        return "info";
    };

    const getSeverityBadge = (action: string) => {
        const severity = getSeverityFromAction(action);
        switch (severity) {
            case "info": return <Badge variant="secondary" className="bg-[#1e293b] text-blue-400 hover:bg-[#1e293b]">Info</Badge>;
            case "warning": return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 border">Warning</Badge>;
            case "critical": return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 border">Critical</Badge>;
            default: return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Audit Logs</h1>
                    <p className="text-slate-400 mt-1">Track system activities and administrative actions</p>
                </div>
                <a
                    href="/api/admin/export/audit"
                    download
                    className="inline-flex items-center justify-center rounded-md border border-[#1e293b] bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:bg-[#1e293b] hover:text-white gap-2 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </a>
            </div>

            {/* Logs Table */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-[#1e293b]">
                        <TableRow className="border-b border-[#1e293b] hover:bg-transparent">
                            <TableHead className="text-slate-300 font-medium">Timestamp</TableHead>
                            <TableHead className="text-slate-300 font-medium">Action</TableHead>
                            <TableHead className="text-slate-300 font-medium">User</TableHead>
                            <TableHead className="text-slate-300 font-medium">Target</TableHead>
                            <TableHead className="text-slate-300 font-medium">Details</TableHead>
                            <TableHead className="text-right text-slate-300 font-medium">Severity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                    No audit logs found. Actions will appear here as they occur.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id} className="border-b border-[#1e293b] hover:bg-[#1e293b]/50">
                                    <TableCell className="whitespace-nowrap font-mono text-xs text-slate-400">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 rounded-md bg-[#1e293b] border border-slate-800">
                                                {getActionIcon(log.targetType)}
                                            </div>
                                            <span className="font-medium text-white text-sm">{log.action}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-slate-300">{log.user?.email || "System"}</span>
                                            <span className="text-xs text-slate-500 font-mono">{log.userId || "N/A"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-xs border-slate-800 text-slate-400">
                                            {log.targetType}
                                            {log.targetId && <span className="ml-1 opacity-50">: {log.targetId}</span>}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-400 max-w-xs truncate">
                                        {log.metadata ? JSON.stringify(log.metadata) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {getSeverityBadge(log.action)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
