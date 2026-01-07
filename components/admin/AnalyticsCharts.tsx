"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { formatPrice } from '@/lib/utils';

interface RevenueData {
    date: string;
    amount: number;
}

interface UserData {
    date: string;
    users: number;
}

interface AnalyticsChartsProps {
    revenueData: RevenueData[];
    usersData: UserData[];
}

export function AnalyticsCharts({ revenueData, usersData }: AnalyticsChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Chart */}
            <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#020817', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                itemStyle={{ color: '#0ea5e9' }}
                                formatter={(value: number | string | (string | number)[] | undefined) => [formatPrice(Number(value || 0)), "Revenue"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#0ea5e9"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">User Growth</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={usersData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#020817', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                            <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
