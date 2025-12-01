"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, RefreshCw, Info, Tag, DollarSign, ShieldCheck, Calendar as CalendarIconLucide } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
    code: z.string().min(3, "Código deve ter pelo menos 3 caracteres").max(20).toUpperCase(),
    description: z.string().min(5, "Descrição é obrigatória"),
    type: z.enum(["percentage", "fixed", "shipping"]),
    value: z.coerce.number().min(0, "Valor deve ser positivo"),
    minOrderValue: z.coerce.number().min(0).optional(),
    usageLimit: z.coerce.number().min(0).optional(),
    limitPerCustomer: z.coerce.number().min(0).optional(),
    applyToConsigned: z.boolean().default(false),
    isMain: z.boolean().default(false),
    startDate: z.date(),
    endDate: z.date().optional().nullable(),
});

export function CouponForm({ initialData, onSubmit, isLoading }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            code: "",
            description: "",
            type: "percentage",
            value: 0,
            minOrderValue: 0,
            usageLimit: 0,
            limitPerCustomer: 1,
            limitPerCustomer: 1,
            applyToConsigned: false,
            isMain: false,
            startDate: new Date(),
            endDate: null,
        },
    });

    const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        form.setValue("code", `PROMO-${result}`);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => {
                // Adapter: camelCase (Front) -> snake_case (API)
                const payload = {
                    code: data.code,
                    description: data.description,
                    type: data.type === 'percentage' ? 'percent' : data.type, // Enum conversion
                    value: Number(data.value),
                    min_purchase: Number(data.minOrderValue || 0),
                    usage_limit: Number(data.usageLimit || 0),
                    usage_count: 0, // Reset on create
                    usage_count: 0, // Reset on create
                    is_main: data.isMain, // Adapter
                    start_date: data.startDate.toISOString(),
                    end_date: data.endDate ? data.endDate.toISOString() : null,
                    status: 'active'
                };
                onSubmit(payload);
            })} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Section A: Basic Definition */}
                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardHeader className="bg-blue-50/50 pb-4">
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <Tag className="h-5 w-5" />
                                Definição Básica
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Código do Cupom</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input placeholder="EX: VERAO2025" {...field} className="uppercase font-mono" />
                                            </FormControl>
                                            <Button type="button" variant="outline" size="icon" onClick={generateCode} title="Gerar código aleatório">
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormDescription>O código que o cliente irá digitar no checkout.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição Interna</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Ex: Campanha de Natal para VIPs" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Section B: Values & Type */}
                    <Card className="border-l-4 border-l-green-500 shadow-sm">
                        <CardHeader className="bg-green-50/50 pb-4">
                            <CardTitle className="flex items-center gap-2 text-green-700">
                                <DollarSign className="h-5 w-5" />
                                Valores e Tipo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Tipo de Desconto</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="percentage" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Porcentagem (%)</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="fixed" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Valor Fixo (R$)</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="shipping" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Frete Grátis</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor do Desconto</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} disabled={form.watch("type") === "shipping"} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="minOrderValue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor Mínimo (R$)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section C: Rules & Restrictions */}
                    <Card className="border-l-4 border-l-purple-500 shadow-sm">
                        <CardHeader className="bg-purple-50/50 pb-4">
                            <CardTitle className="flex items-center gap-2 text-purple-700">
                                <ShieldCheck className="h-5 w-5" />
                                Regras e Restrições
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="usageLimit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Limite Global</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0 = Ilimitado" {...field} />
                                            </FormControl>
                                            <FormDescription>Total de vezes que pode ser usado.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="limitPerCustomer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Limite por Cliente</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Separator />
                            <FormField
                                control={form.control}
                                name="applyToConsigned"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-amber-50 border-amber-200">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base text-amber-900 font-semibold">Aplicar em itens consignados (Brechó)?</FormLabel>
                                            <FormDescription className="text-amber-700/80">
                                                Se desativado, o desconto não será aplicado em peças de parceiros para proteger a margem.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-amber-600"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Separator />
                            <FormField
                                control={form.control}
                                name="isMain"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-purple-50 border-purple-200">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base text-purple-900 font-semibold">Cupom Principal da Loja</FormLabel>
                                            <FormDescription className="text-purple-700/80">
                                                Este cupom aparecerá em destaque na Home/Banner.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Section D: Scheduling */}
                    <Card className="border-l-4 border-l-orange-500 shadow-sm">
                        <CardHeader className="bg-orange-50/50 pb-4">
                            <CardTitle className="flex items-center gap-2 text-orange-700">
                                <CalendarIconLucide className="h-5 w-5" />
                                Agendamento
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Data de Início</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP", { locale: ptBR })
                                                        ) : (
                                                            <span>Selecione uma data</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Data de Término (Opcional)</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP", { locale: ptBR })
                                                        ) : (
                                                            <span>Nunca expira</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancelar</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar Cupom"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
