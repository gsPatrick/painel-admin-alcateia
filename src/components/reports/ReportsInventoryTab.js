
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Package, AlertTriangle, RefreshCw, PlusCircle, ArrowRight, TrendingUp, TrendingDown, BarChart3, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ReportProductModal } from "./ReportProductModal";

export function ReportsInventoryTab({ data }) {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const kpiStyles = [
        {
            gradient: "from-emerald-500 to-teal-600",
            shadow: "shadow-emerald-500/20",
            icon: Package
        },
        {
            gradient: "from-rose-500 to-red-600",
            shadow: "shadow-rose-500/20",
            icon: AlertTriangle
        },
        {
            gradient: "from-blue-500 to-indigo-600",
            shadow: "shadow-blue-500/20",
            icon: PlusCircle
        },
        {
            gradient: "from-violet-500 to-purple-600",
            shadow: "shadow-violet-500/20",
            icon: RefreshCw
        }
    ];

    // Helper to adapt liquidation item to product modal format
    const handleOpenProduct = (item) => {
        setSelectedProduct({
            id: item.id,
            name: item.name,
            revenue: "R$ 0,00", // Mock data for liquidation items
            sales: 0,
            stock: 1,
            image: "https://picsum.photos/seed/p1/50/50" // Mock image
        });
    };

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {data.kpis?.map((kpi, i) => {
                    const style = kpiStyles[i % kpiStyles.length];
                    return (
                        <Card
                            key={i}
                            className={cn(
                                "relative overflow-hidden border-none shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer",
                                `bg-gradient-to-br ${style.gradient} ${style.shadow}`
                            )}
                        >
                            <div className="absolute -right-6 -top-6 size-32 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute -left-6 -bottom-6 size-32 rounded-full bg-black/5 blur-2xl" />

                            <CardContent className="p-6 relative z-10 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                                        <style.icon className="size-5 text-white" />
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm bg-white/20 text-white/90"
                                    )}>
                                        {kpi.trendUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                        {kpi.trend}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white/80">{kpi.title}</p>
                                    <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Stock Aging Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Envelhecimento de Estoque</CardTitle>
                        <CardDescription>Quantidade de peças por tempo em estoque.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {(!data.stock_aging || data.stock_aging.length === 0) ? (
                            <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground">
                                <BarChart3 className="size-12 mb-4 opacity-20" />
                                <p className="text-sm font-medium">Sem dados de estoque</p>
                            </div>
                        ) : (
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.stock_aging} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {data.stock_aging.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 3 ? '#ef4444' : index === 2 ? '#f59e0b' : '#10b981'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Liquidation Suggestions */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Sugestão de Liquidação</CardTitle>
                        <CardDescription>Peças paradas com sugestão de desconto.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto">
                        {(!data.liquidation_suggestions || data.liquidation_suggestions.length === 0) ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[200px]">
                                <PackageX className="size-10 mb-3 opacity-20" />
                                <p className="text-sm font-medium">Nenhuma sugestão no momento</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.liquidation_suggestions.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                                        onClick={() => handleOpenProduct(item)}
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                                                    {item.days_in_stock} dias
                                                </Badge>
                                                <span className="text-xs text-muted-foreground line-through">{item.price}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="destructive" className="mb-1">-{item.suggested_discount}</Badge>
                                            <Button size="sm" variant="ghost" className="h-6 text-xs px-2 w-full">
                                                Aplicar <ArrowRight className="size-3 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ReportProductModal
                product={selectedProduct}
                open={!!selectedProduct}
                onOpenChange={(open) => !open && setSelectedProduct(null)}
            />
        </div>
    );
}
