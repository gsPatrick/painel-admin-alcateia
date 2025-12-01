
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Wallet, ArrowUpRight, ArrowDownLeft, Landmark, TrendingUp, TrendingDown, LineChart as LineChartIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ReportSupplierModal } from "./ReportSupplierModal";

export function ReportsFinanceTab({ data }) {
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const kpiStyles = [
        {
            gradient: "from-emerald-600 to-green-600",
            shadow: "shadow-emerald-500/20",
            icon: Wallet
        },
        {
            gradient: "from-rose-500 to-red-600",
            shadow: "shadow-rose-500/20",
            icon: ArrowUpRight
        },
        {
            gradient: "from-amber-500 to-orange-600",
            shadow: "shadow-amber-500/20",
            icon: ArrowDownLeft
        },
        {
            gradient: "from-blue-600 to-cyan-600",
            shadow: "shadow-blue-500/20",
            icon: Landmark
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

            {/* Revenue vs Payouts Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Receita vs. Repasses</CardTitle>
                    <CardDescription>Comparativo anual de entradas e saídas para fornecedores.</CardDescription>
                </CardHeader>
                <CardContent>
                    {(!data.revenue_vs_payouts || data.revenue_vs_payouts.length === 0) ? (
                        <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground">
                            <LineChartIcon className="size-12 mb-4 opacity-20" />
                            <p className="text-sm font-medium">Sem dados financeiros</p>
                        </div>
                    ) : (
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.revenue_vs_payouts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000} k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        formatter={(value) => `R$ ${value.toLocaleString()} `}
                                    />
                                    <Legend verticalAlign="top" height={36} iconType="circle" />
                                    <Line type="monotone" dataKey="revenue" name="Receita Loja" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="payouts" name="Pagamento Fornecedores" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Supplier Extract Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Extrato de Fornecedores</CardTitle>
                    <CardDescription>Clique no fornecedor para ver detalhes.</CardDescription>
                </CardHeader>
                <CardContent>
                    {(!data.supplier_extract || data.supplier_extract.length === 0) ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[150px]">
                            <Users className="size-10 mb-3 opacity-20" />
                            <p className="text-sm font-medium">Nenhum fornecedor encontrado</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.supplier_extract.map((supplier) => (
                                <div
                                    key={supplier.id}
                                    className="flex items-center justify-between p-3 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors cursor-pointer rounded-lg"
                                    onClick={() => setSelectedSupplier(supplier)}
                                >
                                    <div>
                                        <p className="font-medium text-sm">{supplier.name}</p>
                                        <p className="text-xs text-muted-foreground">{supplier.sold_items} peças vendidas</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold font-mono text-sm">{supplier.to_receive}</p>
                                        <Badge variant={supplier.status === 'Pago' ? 'default' : 'secondary'} className="mt-1 text-[10px]">
                                            {supplier.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <ReportSupplierModal
                supplier={selectedSupplier}
                open={!!selectedSupplier}
                onOpenChange={(open) => !open && setSelectedSupplier(null)}
            />
        </div>
    );
}
