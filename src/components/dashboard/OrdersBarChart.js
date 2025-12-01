"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { OrderStatusListModal } from "./OrderStatusListModal";

import { BarChart as BarChartIcon } from "lucide-react";

export function OrdersBarChart({ data = [] }) {
    const [selectedStatus, setSelectedStatus] = useState(null);

    const handleBarClick = (data) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            setSelectedStatus(data.activePayload[0].payload.name);
        }
    };

    if (!data || data.length === 0) {
        return (
            <Card className="h-full shadow-sm border-border bg-card flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold">Status dos Pedidos</CardTitle>
                    <CardDescription>Clique nas barras para ver detalhes.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <BarChartIcon className="size-12 mb-4 opacity-20" />
                        <p className="text-sm font-medium">Nenhum pedido</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="h-full shadow-sm border-border bg-card flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold">Status dos Pedidos</CardTitle>
                    <CardDescription>Clique nas barras para ver detalhes.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            onClick={handleBarClick}
                            className="cursor-pointer"
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                                contentStyle={{
                                    backgroundColor: 'var(--background)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    color: 'var(--foreground)'
                                }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {data?.map((entry, index) => {
                                    let color = '#94a3b8';
                                    if (entry.name === 'Concluídos') color = '#10b981'; // Emerald
                                    if (entry.name === 'Pendentes') color = '#f59e0b'; // Amber
                                    if (entry.name === 'Processando') color = '#3b82f6'; // Blue
                                    if (entry.name === 'Cancelados') color = '#ef4444'; // Red
                                    return <Cell key={`cell-${index}`} fill={color} className="hover:opacity-80 transition-opacity" />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <OrderStatusListModal
                status={selectedStatus}
                open={!!selectedStatus}
                onOpenChange={(open) => !open && setSelectedStatus(null)}
            />
        </>
    );
}
