"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { KPIDetailsModal } from "./KPIDetailsModal";

export function KPICards({ data }) {
    const [selectedKPI, setSelectedKPI] = useState(null);

    const kpis = [
        {
            title: "Faturamento Total",
            value: data?.total_sales ? `R$ ${data.total_sales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "R$ 0,00",
            icon: DollarSign,
            trend: "+12.5%",
            trendUp: true,
            // Gradient Blue/Purple
            className: "bg-gradient-to-br from-blue-600 to-violet-600 dark:bg-none dark:bg-zinc-900 text-white dark:text-blue-100 border-none dark:border dark:border-blue-800 shadow-xl shadow-blue-500/20",
            iconBg: "bg-white/20 dark:bg-blue-500/20",
            trendColor: "text-white/90 bg-white/20 dark:bg-blue-500/20 dark:text-blue-200",
            color: "text-white dark:text-blue-400" // For modal icon
        },
        {
            title: "Pedidos Pendentes",
            value: data?.pending_orders || 0,
            icon: ShoppingBag,
            trend: "+4",
            trendUp: false,
            // Gradient Orange/Red
            className: "bg-gradient-to-br from-amber-500 to-orange-600 dark:bg-none dark:bg-zinc-900 text-white dark:text-amber-100 border-none dark:border dark:border-amber-800 shadow-xl shadow-orange-500/20",
            iconBg: "bg-white/20 dark:bg-amber-500/20",
            trendColor: "text-white/90 bg-white/20 dark:bg-amber-500/20 dark:text-amber-200",
            color: "text-white dark:text-amber-400"
        },
        {
            title: "Produtos Ativos",
            value: data?.total_products || 0,
            icon: Package,
            trend: "+2 novos",
            trendUp: true,
            // Gradient Emerald/Teal
            className: "bg-gradient-to-br from-emerald-500 to-teal-600 dark:bg-none dark:bg-zinc-900 text-white dark:text-emerald-100 border-none dark:border dark:border-emerald-800 shadow-xl shadow-emerald-500/20",
            iconBg: "bg-white/20 dark:bg-emerald-500/20",
            trendColor: "text-white/90 bg-white/20 dark:bg-emerald-500/20 dark:text-emerald-200",
            color: "text-white dark:text-emerald-400"
        },
        {
            title: "Clientes Totais",
            value: data?.total_customers || 0,
            icon: Users,
            trend: "+18%",
            trendUp: true,
            // Gradient Pink/Rose
            className: "bg-gradient-to-br from-pink-500 to-rose-600 dark:bg-none dark:bg-zinc-900 text-white dark:text-pink-100 border-none dark:border dark:border-pink-800 shadow-xl shadow-pink-500/20",
            iconBg: "bg-white/20 dark:bg-pink-500/20",
            trendColor: "text-white/90 bg-white/20 dark:bg-pink-500/20 dark:text-pink-200",
            color: "text-white dark:text-pink-400"
        },
    ];

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi, index) => (
                    <Card
                        key={index}
                        className={cn("relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer", kpi.className)}
                        onClick={() => setSelectedKPI(kpi)}
                    >
                        {/* Decorative circles */}
                        <div className="absolute -right-6 -top-6 size-32 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -left-6 -bottom-6 size-32 rounded-full bg-black/5 blur-2xl" />

                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-3 rounded-xl backdrop-blur-sm", kpi.iconBg)}>
                                    <kpi.icon className={cn("size-6", kpi.color)} />
                                </div>
                                {kpi.trend && (
                                    <div className={cn("flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm", kpi.trendColor)}>
                                        {kpi.trendUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                        {kpi.trend}
                                    </div>
                                )}
                            </div>
                            <div className="mt-5">
                                <p className="text-sm font-medium text-white/80 dark:text-muted-foreground">{kpi.title}</p>
                                <h3 className={cn("text-3xl font-bold tracking-tight mt-1", kpi.color)}>{kpi.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <KPIDetailsModal
                kpi={selectedKPI}
                open={!!selectedKPI}
                onOpenChange={(open) => !open && setSelectedKPI(null)}
            />
        </>
    );
}
