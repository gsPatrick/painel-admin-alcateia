"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ReportsSalesTab } from "@/components/reports/ReportsSalesTab";
import { ReportsInventoryTab } from "@/components/reports/ReportsInventoryTab";
import { ReportsFinanceTab } from "@/components/reports/ReportsFinanceTab";
import { MOCK_REPORTS } from "@/services/mockReports";

import { useQuery } from "@tanstack/react-query";
import AppService from "@/services/app.service";
import { Loader2 } from "lucide-react";

export default function ReportsPage() {
    const { data: salesData, isLoading: isLoadingSales } = useQuery({
        queryKey: ["reports-sales"],
        queryFn: () => AppService.getAnalyticsReports(),
    });

    const { data: productData, isLoading: isLoadingProducts } = useQuery({
        queryKey: ["reports-products"],
        queryFn: () => AppService.getProductPerformance(),
    });

    if (isLoadingSales || isLoadingProducts) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    // Transform data
    const sales = salesData || [];
    const products = productData || [];

    // Calculate KPIs
    const totalRevenue = sales.reduce((acc, curr) => acc + parseFloat(curr.revenue), 0);
    const totalOrders = sales.reduce((acc, curr) => acc + parseInt(curr.orders), 0);
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate Sales by Category
    const categoryMap = {};
    products.forEach(p => {
        const cat = p.category_name || 'Outros';
        if (!categoryMap[cat]) categoryMap[cat] = 0;
        categoryMap[cat] += parseFloat(p.revenue);
    });
    const salesByCategory = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    const formattedSalesData = {
        kpis: [
            {
                title: "Receita Total",
                value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                trend: "+12.5%", // Placeholder trend
                trendUp: true
            },
            {
                title: "Pedidos",
                value: totalOrders,
                trend: "+8.2%",
                trendUp: true
            },
            {
                title: "Ticket Médio",
                value: `R$ ${avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                trend: "-2.1%",
                trendUp: false
            },
            {
                title: "Produtos Vendidos",
                value: products.reduce((acc, p) => acc + parseInt(p.total_sold), 0),
                trend: "+5.4%",
                trendUp: true
            }
        ],
        revenue_evolution: sales.map(s => ({
            date: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            value: parseFloat(s.revenue)
        })),
        sales_by_category: salesByCategory,
        top_products: products.slice(0, 5).map(p => ({
            id: p.id,
            name: p.name,
            image: null, // API doesn't return image yet, use fallback
            stock: p.stock,
            revenue: `R$ ${parseFloat(p.revenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            sales: p.total_sold
        }))
    };

    // For Inventory, we need to construct the expected object structure
    const lowStockCount = products.filter(p => p.stock <= 5).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const totalStockValue = products.reduce((acc, p) => acc + (parseFloat(p.revenue) || 0), 0); // Using revenue as proxy for value if cost not available

    // Calculate Stock Aging
    const now = new Date();
    const agingBuckets = { '0-30 dias': 0, '31-60 dias': 0, '61-90 dias': 0, '90+ dias': 0 };

    products.forEach(p => {
        if (p.stock > 0) {
            const created = new Date(p.createdAt);
            const diffTime = Math.abs(now - created);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 30) agingBuckets['0-30 dias'] += p.stock;
            else if (diffDays <= 60) agingBuckets['31-60 dias'] += p.stock;
            else if (diffDays <= 90) agingBuckets['61-90 dias'] += p.stock;
            else agingBuckets['90+ dias'] += p.stock;
        }
    });

    const stockAgingData = Object.entries(agingBuckets).map(([name, value]) => ({ name, value }));

    const formattedInventoryData = {
        kpis: [
            {
                title: "Valor em Estoque",
                value: `R$ ${totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                trend: "+5%", // Placeholder
                trendUp: true
            },
            {
                title: "Baixo Estoque",
                value: lowStockCount,
                trend: lowStockCount > 0 ? "Atenção" : "Normal",
                trendUp: lowStockCount === 0
            },
            {
                title: "Novos Produtos",
                value: products.length, // Placeholder
                trend: "+12",
                trendUp: true
            },
            {
                title: "Giro de Estoque",
                value: "4.2x", // Placeholder
                trend: "+0.3",
                trendUp: true
            }
        ],
        stock_aging: stockAgingData,
        liquidation_suggestions: products
            .filter(p => p.stock > 0 && p.total_sold === 0) // Products with stock but no sales
            .slice(0, 5)
            .map(p => ({
                id: p.id,
                name: p.name,
                days_in_stock: Math.ceil(Math.abs(now - new Date(p.createdAt)) / (1000 * 60 * 60 * 24)),
                price: `R$ ${(parseFloat(p.revenue) || 100).toFixed(2)}`, // Placeholder price
                suggested_discount: '20%'
            }))
    };

    // Calculate Supplier Extract (using Brand as proxy)
    const supplierMap = {};
    products.forEach(p => {
        const supplier = p.brand || 'Sem Marca';
        if (!supplierMap[supplier]) {
            supplierMap[supplier] = { id: supplier, name: supplier, sold_items: 0, revenue: 0 };
        }
        supplierMap[supplier].sold_items += parseInt(p.total_sold);
        supplierMap[supplier].revenue += parseFloat(p.revenue);
    });

    const supplierExtractData = Object.values(supplierMap).map(s => ({
        ...s,
        to_receive: `R$ ${s.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        status: 'Pendente' // Placeholder status
    }));

    // For Finance, construct expected structure
    const formattedFinanceData = {
        kpis: formattedSalesData.kpis, // Reuse sales KPIs for now
        revenue_vs_payouts: formattedSalesData.revenue_evolution.map(d => ({
            name: d.date,
            revenue: d.value,
            payouts: d.value * 0.6 // Placeholder: payouts are 60% of revenue
        })),
        supplier_extract: supplierExtractData
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Relatórios e Analytics</h2>
                    <p className="text-muted-foreground mt-1">Inteligência de dados para tomada de decisão.</p>
                </div>
                <div className="flex items-center gap-2">
                    <DateRangePicker />
                    <Button variant="outline" size="icon">
                        <Download className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <FileText className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="sales" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="sales">Vendas</TabsTrigger>
                    <TabsTrigger value="inventory">Estoque</TabsTrigger>
                    <TabsTrigger value="finance">Financeiro</TabsTrigger>
                </TabsList>

                <TabsContent value="sales" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ReportsSalesTab data={formattedSalesData} />
                </TabsContent>

                <TabsContent value="inventory" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ReportsInventoryTab data={formattedInventoryData} />
                </TabsContent>

                <TabsContent value="finance" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ReportsFinanceTab data={formattedFinanceData} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
