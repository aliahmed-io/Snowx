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
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                stroke="#64748b"
                                tick={{ fill: '#64748b', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                tickCount={5}
                                tickFormatter={(value) => `$${value}`}
                                width={55}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    padding: '8px 12px'
                                }}
                                itemStyle={{ color: '#60a5fa' }}
                                formatter={(value: number | string | (string | number)[] | undefined) => [formatPrice(Number(value || 0)), "Revenue"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#3b82f6"
                                strokeWidth={2}
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
                        <BarChart data={usersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                stroke="#64748b"
                                tick={{ fill: '#64748b', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                tickCount={5}
                                allowDecimals={false}
                                width={25}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    padding: '8px 12px'
                                }}
                                itemStyle={{ color: '#60a5fa' }}
                            />
                            <Bar
                                dataKey="users"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
