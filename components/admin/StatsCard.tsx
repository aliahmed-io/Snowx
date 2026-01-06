import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
        positive?: boolean;
    };
    description?: string;
    loading?: boolean;
}

export function StatsCard({ title, value, icon: Icon, trend, description, loading }: StatsCardProps) {
    return (
        <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-white mt-2">
                        {loading ? <div className="h-8 w-24 bg-white/10 animate-pulse rounded" /> : value}
                    </h3>
                </div>
                <div className="p-3 bg-snow-accent/10 rounded-lg">
                    <Icon className="w-6 h-6 text-snow-accent" />
                </div>
            </div>

            {(trend || description) && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                    {trend && (
                        <span className={cn(
                            "font-medium",
                            trend.positive ? "text-green-400" : "text-red-400"
                        )}>
                            {trend.positive ? "+" : ""}{trend.value}%
                        </span>
                    )}
                    <span className="text-gray-500">
                        {trend ? trend.label : description}
                    </span>
                </div>
            )}
        </div>
    );
}
