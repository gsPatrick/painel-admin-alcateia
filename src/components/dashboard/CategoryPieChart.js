"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Vibrant Palette
const COLORS = [
    '#3b82f6', // Blue 500
    '#8b5cf6', // Violet 500
    '#ec4899', // Pink 500
    '#10b981', // Emerald 500
    '#f59e0b'  // Amber 500
];

import { PieChart as PieChartIcon } from "lucide-react";

export function CategoryPieChart({ data = [] }) {
    const [viewType, setViewType] = useState("category");

    if (!data || data.length === 0) {
        return (
            <Card className="h-full shadow-sm border-border bg-card flex flex-col">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-bold">Vendas</CardTitle>
                        <CardDescription>Por Categoria</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <PieChartIcon className="size-12 mb-4 opacity-20" />
                        <p className="text-sm font-medium">Nenhuma categoria</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full shadow-sm border-border bg-card flex flex-col">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-bold">Vendas</CardTitle>
                    <CardDescription>Por Categoria</CardDescription>
                </div>
                <Select value={viewType} onValueChange={setViewType}>
                    <SelectTrigger className="w-[110px] h-8 text-xs">
                        <SelectValue placeholder="Visualizar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="category">Categoria</SelectItem>
                        <SelectItem value="subcategory">Subcat.</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] flex items-center justify-center p-0">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {data?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--background)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    color: 'var(--foreground)'
                                }}
                                formatter={(value) => `R$ ${value.toLocaleString()}`}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
