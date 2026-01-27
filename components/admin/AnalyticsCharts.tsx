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
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueData {
    date: string;
    amount: number;
}

interface UserData {
    date: string;
    users: number;
}

interface CategoryData {
    name: string;
    value: number;
    [key: string]: any;
}

interface PlatformData {
    name: string;
    value: number;
    [key: string]: any;
}

interface ProductData {
    name: string;
    sales: number;
    price: number;
    [key: string]: any;
}

interface AnalyticsChartsProps {
    revenueData: RevenueData[];
    usersData: UserData[];
    salesByCategory: CategoryData[];
    salesByPlatform: PlatformData[];
    topProducts: ProductData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AnalyticsCharts({
    revenueData,
    usersData,
    salesByCategory,
    salesByPlatform,
    topProducts
}: AnalyticsChartsProps) {
    return (
        <div className="space-y-8">
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
                                    formatter={(value: any) => formatPrice(Number(value || 0))}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        borderRadius: '8px',
                                        padding: '8px 12px'
                                    }}
                                    itemStyle={{ color: '#60a5fa' }}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales by Category (Pie) */}
                <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Sales by Category</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={salesByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {salesByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => formatPrice(Number(value || 0))}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        borderRadius: '8px'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales by Platform (Bar) */}
                <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-6">Sales by Platform</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesByPlatform} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" tickFormatter={(val) => `$${val}`} stroke="#64748b" />
                                <YAxis dataKey="name" type="category" width={100} stroke="#64748b" tick={{ fill: '#cbd5e1' }} />
                                <Tooltip
                                    formatter={(value: any) => formatPrice(Number(value || 0))}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Top Selling Products</h3>
                <div className="space-y-4">
                    {topProducts.map((product, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-gray-400">
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-white truncate">{product.name}</span>
                                    <span className="text-snow-accent font-semibold">{product.sales} sold</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-snow-accent h-full rounded-full transition-all duration-500"
                                        style={{ width: `${(product.sales / (topProducts[0]?.sales || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="text-right min-w-[80px]">
                                <div className="text-sm text-gray-400">Price</div>
                                <div className="font-medium text-white">{formatPrice(product.price)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
