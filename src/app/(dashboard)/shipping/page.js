"use client";

import { useState, useEffect } from "react";
import AppService from "@/services/app.service";
import { ShippingRuleModal } from "@/components/shipping/ShippingRuleModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Truck, Settings2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ShippingPage() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingRule, setEditingRule] = useState(null);

    // Global Config State (Mocked locally for now as per prompt instructions for UI)
    const [globalConfig, setGlobalConfig] = useState({
        defaultFixedPrice: 25.00,
        globalFreeShipping: 500.00
    });

    const fetchRules = async () => {
        setLoading(true);
        try {
            const data = await AppService.getShippingRules();
            setRules(data || []);
        } catch (error) {
            console.error("Failed to fetch rules:", error);
            toast.error("Erro ao carregar regras.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleSaveRule = async (data) => {
        setIsSaving(true);
        try {
            // In a real app, we would check if we are editing or creating
            await AppService.createShippingRule(data);
            toast.success("Regra salva com sucesso!");
            setIsModalOpen(false);
            fetchRules();
        } catch (error) {
            console.error("Failed to save rule:", error);
            toast.error("Erro ao salvar regra.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditClick = (rule) => {
        setEditingRule(rule);
        setIsModalOpen(true);
    };

    const handleNewRuleClick = () => {
        setEditingRule(null);
        setIsModalOpen(true);
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Regras de Frete</h2>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleNewRuleClick}>
                        <Plus className="mr-2 h-4 w-4" /> Nova Regra
                    </Button>
                </div>
            </div>

            {/* Global Configuration Card */}
            <Card className="bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <CardTitle className="text-base font-medium text-slate-800 dark:text-slate-200">Configuração Global (Fallback)</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-4">
                        <div className="space-y-2 flex-1">
                            <Label>Frete Fixo Padrão (R$)</Label>
                            <Input
                                type="number"
                                value={globalConfig.defaultFixedPrice}
                                onChange={(e) => setGlobalConfig({ ...globalConfig, defaultFixedPrice: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">Usado se nenhuma regra de CEP for encontrada.</p>
                        </div>
                        <div className="space-y-2 flex-1">
                            <Label>Frete Grátis Global acima de (R$)</Label>
                            <Input
                                type="number"
                                value={globalConfig.globalFreeShipping}
                                onChange={(e) => setGlobalConfig({ ...globalConfig, globalFreeShipping: e.target.value })}
                            />
                        </div>
                        <Button variant="secondary" onClick={() => toast.success("Configuração global salva!")}>
                            Salvar Config Global
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Rules Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Faixa de CEP</TableHead>
                            <TableHead>Custo Base</TableHead>
                            <TableHead>Custo/Kg</TableHead>
                            <TableHead>Prazo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">Carregando regras...</TableCell>
                            </TableRow>
                        ) : rules.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">Nenhuma regra cadastrada.</TableCell>
                            </TableRow>
                        ) : (
                            rules.map((rule) => (
                                <TableRow key={rule.id}>
                                    <TableCell className="font-medium">{rule.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <span className="font-mono">{rule.zipStart}</span>
                                            <span>até</span>
                                            <span className="font-mono">{rule.zipEnd}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>R$ {rule.baseCost.toFixed(2)}</TableCell>
                                    <TableCell>+ R$ {rule.costPerKg.toFixed(2)}</TableCell>
                                    <TableCell>{rule.deliveryDays} dias</TableCell>
                                    <TableCell>
                                        <Switch checked={rule.status === 'active'} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(rule)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingRule ? "Editar Regra" : "Nova Regra de Frete"}</DialogTitle>
                        <DialogDescription>
                            Defina a faixa de CEP e os custos de envio.
                        </DialogDescription>
                    </DialogHeader>
                    <ShippingRuleModal
                        initialData={editingRule}
                        onSubmit={handleSaveRule}
                        isLoading={isSaving}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
