import { db } from "@/lib/db";
import {
    FileText,
    User,
    Shield,
    ShoppingCart,
    Package,
    Settings,
    Download,
    Upload,
    ChevronDown,
    ChevronUp,
    Clock
} from "lucide-react";
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

// Format relative time
function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Format metadata as readable key-value pairs
function formatMetadata(metadata: unknown): { key: string; value: string }[] | null {
    if (!metadata || typeof metadata !== 'object') return null;
    const entries: { key: string; value: string }[] = [];

    const formatKey = (key: string) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    };

    for (const [key, value] of Object.entries(metadata as Record<string, unknown>)) {
        if (value !== null && value !== undefined) {
            let formattedValue: string;
            if (typeof value === 'object') {
                formattedValue = JSON.stringify(value);
            } else {
                formattedValue = String(value);
            }
            entries.push({ key: formatKey(key), value: formattedValue });
        }
    }
    return entries.length > 0 ? entries : null;
}

// Collapsible metadata component (client-rendered via details/summary)
function MetadataDisplay({ metadata }: { metadata: unknown }) {
    const entries = formatMetadata(metadata);
    if (!entries) return <span className="text-slate-500">—</span>;

    return (
        <details className="group">
            <summary className="cursor-pointer text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 list-none">
                <span>View Details</span>
                <ChevronDown className="w-3 h-3 group-open:hidden" />
                <ChevronUp className="w-3 h-3 hidden group-open:block" />
            </summary>
            <div className="mt-2 p-3 bg-[#1e293b] rounded-lg border border-slate-700 space-y-1.5 max-w-sm">
                {entries.map(({ key, value }, idx) => (
                    <div key={idx} className="flex gap-2 text-xs">
                        <span className="text-slate-400 font-medium shrink-0">{key}:</span>
                        <span className="text-slate-300 break-all">{value}</span>
                    </div>
                ))}
            </div>
        </details>
    );
}

export default async function AuditLogsPage() {
    // Fetch real audit logs from database
    const logs = await db.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            user: {
                select: { email: true, firstName: true, lastName: true, role: true }
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

    // Get admin display name
    const getAdminName = (user: { email: string; firstName: string | null; lastName: string | null; role: string } | null) => {
        if (!user) return { name: "System", role: "SYSTEM", email: "Automated" };
        const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email.split('@')[0];
        return { name, role: user.role, email: user.email };
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Audit Logs</h1>
                    <p className="text-slate-400 mt-1">Track administrative actions and system changes</p>
                </div>
                <div className="flex gap-2">
                    <label
                        className="inline-flex items-center justify-center rounded-md border border-[#1e293b] bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:bg-[#1e293b] hover:text-white gap-2 transition-colors cursor-pointer"
                    >
                        <Upload className="w-4 h-4" />
                        Import CSV
                        <input type="file" accept=".csv" className="hidden" />
                    </label>
                    <a
                        href="/api/admin/export/audit"
                        download
                        className="inline-flex items-center justify-center rounded-md border border-[#1e293b] bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:bg-[#1e293b] hover:text-white gap-2 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </a>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-[#1e293b]">
                        <TableRow className="border-b border-[#1e293b] hover:bg-transparent">
                            <TableHead className="text-slate-300 font-medium">When</TableHead>
                            <TableHead className="text-slate-300 font-medium">Administrator</TableHead>
                            <TableHead className="text-slate-300 font-medium">Action</TableHead>
                            <TableHead className="text-slate-300 font-medium">Target</TableHead>
                            <TableHead className="text-slate-300 font-medium">Changes</TableHead>
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
                            logs.map((log) => {
                                const admin = getAdminName(log.user);
                                return (
                                    <TableRow key={log.id} className="border-b border-[#1e293b] hover:bg-[#1e293b]/50">
                                        <TableCell className="whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-200 flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3 text-slate-500" />
                                                    {getRelativeTime(new Date(log.createdAt))}
                                                </span>
                                                <span className="text-xs text-slate-500 font-mono">
                                                    {new Date(log.createdAt).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-white">{admin.name}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] px-1.5 py-0 border-0 ${admin.role === 'ADMIN'
                                                                ? 'bg-purple-500/10 text-purple-400'
                                                                : admin.role === 'SYSTEM'
                                                                    ? 'bg-slate-500/10 text-slate-400'
                                                                    : 'bg-blue-500/10 text-blue-400'
                                                            }`}
                                                    >
                                                        {admin.role}
                                                    </Badge>
                                                    <span className="text-xs text-slate-500 truncate max-w-[120px]">{admin.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-md bg-[#1e293b] border border-slate-700">
                                                    {getActionIcon(log.targetType)}
                                                </div>
                                                <span className="font-medium text-white text-sm">{log.action}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs border-slate-700 text-slate-300">
                                                {log.targetType}
                                                {log.targetId && <span className="ml-1 opacity-60 font-mono">#{log.targetId.slice(0, 8)}</span>}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            <MetadataDisplay metadata={log.metadata} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {getSeverityBadge(log.action)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
