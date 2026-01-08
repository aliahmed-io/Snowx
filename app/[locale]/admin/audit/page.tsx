"use client";

import { useState } from "react";
import {
    FileText,
    Search,
    Filter,
    Download,
    User,
    Shield,
    ShoppingCart,
    Package,
    Settings,
    ChevronDown,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface AuditLog {
    id: string;
    action: string;
    userId: string;
    userEmail: string;
    targetType: "ORDER" | "PRODUCT" | "USER" | "SYSTEM" | "AUTH";
    targetId?: string;
    metadata: string;
    timestamp: string;
    severity: "info" | "warning" | "critical";
}

export default function AuditLogsPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Placeholder data
    const [logs] = useState<AuditLog[]>([
        {
            id: "log_1",
            action: "UPDATE_PRODUCT_STOCK",
            userId: "usr_123",
            userEmail: "admin@snowx.com",
            targetType: "PRODUCT",
            targetId: "prod_snow_board_v2",
            metadata: "Updated stock from 45 to 50",
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            severity: "info"
        },
        {
            id: "log_2",
            action: "REFUND_ORDER",
            userId: "usr_123",
            userEmail: "admin@snowx.com",
            targetType: "ORDER",
            targetId: "ord_998877",
            metadata: "Processed refund for $129.99 (Reason: Defective)",
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            severity: "warning"
        },
        {
            id: "log_3",
            action: "LOGIN_ATTEMPT_FAILED",
            userId: "unknown",
            userEmail: "unknown@ip-192.168.1.1",
            targetType: "AUTH",
            metadata: "Failed login attempt from IP 192.168.1.1",
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            severity: "critical"
        },
        {
            id: "log_4",
            action: "SYSTEM_CONFIG_CHANGE",
            userId: "usr_999",
            userEmail: "superadmin@snowx.com",
            targetType: "SYSTEM",
            metadata: "Changed payment gateway settings",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            severity: "warning"
        },
        {
            id: "log_5",
            action: "USER_ROLE_UPDATE",
            userId: "usr_123",
            userEmail: "admin@snowx.com",
            targetType: "USER",
            targetId: "usr_555",
            metadata: "Promoted user to Moderator",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
            severity: "info"
        }
    ]);

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "info": return <Badge variant="secondary" className="bg-[#1e293b] text-blue-400 hover:bg-[#1e293b]">Info</Badge>;
            case "warning": return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 border">Warning</Badge>;
            case "critical": return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 border">Critical</Badge>;
            default: return <Badge variant="secondary">Unknown</Badge>;
        }
    };

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Audit Logs</h1>
                    <p className="text-slate-400 mt-1">Track system activities and administrative actions</p>
                </div>
                <Button variant="outline" className="border-[#1e293b] text-slate-300 hover:bg-[#1e293b] hover:text-white gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-[#0f172a] p-4 rounded-xl border border-[#1e293b]">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        placeholder="Search logs by action, user, or ID..."
                        className="pl-9 bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600"
                    />
                </div>
                <div className="flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="border-[#1e293b] text-slate-300 hover:bg-[#1e293b] hover:text-white gap-2 w-full sm:w-auto justify-start text-left font-normal">
                                <Calendar className="w-4 h-4" />
                                {date ? date.toLocaleDateString() : "Select date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-[#0f172a] border-[#1e293b]" align="end">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                className="bg-[#0f172a] text-white"
                            />
                        </PopoverContent>
                    </Popover>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-[#1e293b] text-slate-300 hover:bg-[#1e293b] hover:text-white gap-2">
                                <Filter className="w-4 h-4" />
                                Type
                                <ChevronDown className="w-3 h-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1e293b] border-[#020817] text-slate-200">
                            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-[#020817]" />
                            <DropdownMenuCheckboxItem checked>Orders</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked>Products</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked>Users</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked>System</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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
                        {logs.map((log) => (
                            <TableRow key={log.id} className="border-b border-[#1e293b] hover:bg-[#1e293b]/50">
                                <TableCell className="whitespace-nowrap font-mono text-xs text-slate-400">
                                    {new Date(log.timestamp).toLocaleString()}
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
                                        <span className="text-sm text-slate-300">{log.userEmail}</span>
                                        <span className="text-xs text-slate-500 font-mono">{log.userId}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-xs border-slate-800 text-slate-400">
                                        {log.targetType}
                                        {log.targetId && <span className="ml-1 opacity-50">: {log.targetId}</span>}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-slate-400 max-w-xs truncate" title={log.metadata}>
                                    {log.metadata}
                                </TableCell>
                                <TableCell className="text-right">
                                    {getSeverityBadge(log.severity)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
