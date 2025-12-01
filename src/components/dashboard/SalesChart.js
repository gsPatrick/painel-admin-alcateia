"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3 } from "lucide-react";

export function SalesChart({ className, data = [] }) {
    if (!data || data.length === 0) {
        return (
            <Card className={`col-span-4 shadow-sm border-border bg-card flex flex-col ${className}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-8">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold">Receita Recente</CardTitle>
                        <CardDescription>Performance de vendas nos últimos 30 dias.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pl-0 flex-1 min-h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <BarChart3 className="size-12 mb-4 opacity-20" />
                        <p className="text-sm font-medium">Nenhum dado de vendas</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`col-span-4 shadow-sm border-border bg-card flex flex-col ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-8">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold">Receita Recente</CardTitle>
                    <CardDescription>Performance de vendas nos últimos 30 dias.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-medium">
                    <Calendar className="size-3.5" />
                    Últimos 30 dias
                </Button>
            </CardHeader>
            <CardContent className="pl-0 flex-1 min-h-[300px]">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <filter id="shadow" height="200%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#6366f1" floodOpacity="0.3" />
                                </filter>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `R$${value / 1000}k`}
                                dx={-10}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--background)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)',
                                    padding: '12px 16px',
                                    backdropFilter: 'blur(8px)'
                                }}
                                itemStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                                labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px', fontSize: '12px' }}
                                formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Receita']}
                                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#6366f1"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                                filter="url(#shadow)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
