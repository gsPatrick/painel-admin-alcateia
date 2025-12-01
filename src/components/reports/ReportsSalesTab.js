"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Percent, CreditCard, BarChart3, PieChart as PieChartIcon, ShoppingBag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ReportProductModal } from "./ReportProductModal";

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

export function ReportsSalesTab({ data }) {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const kpiStyles = [
        {
            gradient: "from-blue-600 to-violet-600",
            shadow: "shadow-blue-500/20",
            icon: DollarSign
        },
        {
            gradient: "from-emerald-500 to-teal-600",
            shadow: "shadow-emerald-500/20",
            icon: CreditCard
        },
        {
            gradient: "from-pink-500 to-rose-600",
            shadow: "shadow-pink-500/20",
            icon: Percent
        },
        {
            gradient: "from-amber-500 to-orange-600",
            shadow: "shadow-amber-500/20",
            icon: ShoppingCart
        }
    ];

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

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-7">
                {/* Main Revenue Chart */}
                <Card className="col-span-4 shadow-md">
                    <CardHeader>
                        <CardTitle>Evolução de Receita</CardTitle>
                        <CardDescription>Faturamento diário nos últimos 30 dias.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        {(!data.revenue_evolution || data.revenue_evolution.length === 0) ? (
                            <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground">
                                <BarChart3 className="size-12 mb-4 opacity-20" />
                                <p className="text-sm font-medium">Sem dados de receita</p>
                            </div>
                        ) : (
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.revenue_evolution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                            formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Receita']}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Category Donut Chart */}
                <Card className="col-span-3 shadow-md">
                    <CardHeader>
                        <CardTitle>Vendas por Categoria</CardTitle>
                        <CardDescription>Participação na receita total.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {(!data.sales_by_category || data.sales_by_category.length === 0) ? (
                            <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground">
                                <PieChartIcon className="size-12 mb-4 opacity-20" />
                                <p className="text-sm font-medium">Sem dados de categoria</p>
                            </div>
                        ) : (
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.sales_by_category}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={110}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.sales_by_category.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                            formatter={(value) => `R$ ${value.toLocaleString()}`}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top Products Table */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Top Produtos Mais Vendidos</CardTitle>
                    <CardDescription>Clique no produto para ver detalhes completos.</CardDescription>
                </CardHeader>
                <CardContent>
                    {(!data.top_products || data.top_products.length === 0) ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[200px]">
                            <ShoppingBag className="size-10 mb-3 opacity-20" />
                            <p className="text-sm font-medium">Nenhum produto vendido ainda</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {data.top_products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-border/50 hover:shadow-sm"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 rounded-xl border border-border/50 shadow-sm">
                                            <AvatarImage src={product.image} alt={product.name} className="object-cover" />
                                            <AvatarFallback>PD</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm text-foreground">{product.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">Estoque: {product.stock} un.</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold font-mono text-sm text-primary">{product.revenue}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{product.sales} vendas</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <ReportProductModal
                product={selectedProduct}
                open={!!selectedProduct}
                onOpenChange={(open) => !open && setSelectedProduct(null)}
            />
        </div>
    );
}
