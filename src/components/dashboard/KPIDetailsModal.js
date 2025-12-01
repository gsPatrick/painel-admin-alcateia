"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

// Mock data for the mini chart in modal
const mockChartData = [
    { name: 'Seg', value: 400 },
    { name: 'Ter', value: 300 },
    { name: 'Qua', value: 550 },
    { name: 'Qui', value: 450 },
    { name: 'Sex', value: 600 },
    { name: 'Sáb', value: 700 },
    { name: 'Dom', value: 500 },
];

export function KPIDetailsModal({ kpi, open, onOpenChange }) {
    if (!kpi) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] overflow-hidden">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", kpi.iconBg || "bg-primary/10")}>
                            <kpi.icon className={cn("size-6", kpi.color || "text-primary")} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">{kpi.title}</DialogTitle>
                            <DialogDescription>Detalhamento do indicador.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Main Value & Trend */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Valor Atual</p>
                            <h2 className="text-4xl font-bold tracking-tight">{kpi.value}</h2>
                        </div>
                        <div className={cn(
                            "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium mb-1",
                            kpi.trendUp ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                        )}>
                            {kpi.trendUp ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                            {kpi.trend}
                        </div>
                    </div>

                    {/* Mini Chart */}
                    <div className="h-[150px] w-full bg-muted/30 rounded-xl p-4 border border-border/50">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Quick Actions / Filters */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="gap-2">
                            <Calendar className="size-4" /> Ver Histórico
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <Filter className="size-4" /> Segmentar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
