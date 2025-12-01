"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Printer,
    Ban,
    Truck,
    Check,
    DollarSign,
    Package,
    MapPin,
    MessageSquare,
    Copy,
    ExternalLink,
    MoreVertical,
    PackageCheck,
    Store,
    Globe,
    ShieldCheck,
    ShieldAlert,
    Smartphone,
    Monitor,
    CreditCard,
    Calendar,
    TrendingUp,
    Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AppService from "@/services/app.service";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { getPaymentDetails } from "@/lib/formatters";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFulfillmentModalOpen, setIsFulfillmentModalOpen] = useState(false);
    const [fulfillmentData, setFulfillmentData] = useState({
        carrier: "",
        trackingCode: "",
        trackingUrl: "",
    });

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const data = await AppService.getOrderById(params.id);
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
                toast.error("Erro ao carregar detalhes do pedido.");
            } finally {
                setLoading(false);
            }
        };
        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

    const handleFulfillOrder = async () => {
        // Mock logic to update order status - In a real app this would be an API call
        // For now we just update the local state as if the API call succeeded
        // Ideally we should have an AppService.fulfillOrder(id, data) method

        const newEvent = {
            id: `EVT-${Date.now()}`,
            type: "fulfilled",
            title: "Pedido enviado",
            date: new Date().toISOString(),
            icon: "Truck",
            description: `Rastreio: ${fulfillmentData.trackingCode} (${fulfillmentData.carrier})`,
        };

        const updatedOrder = {
            ...order,
            fulfillmentStatus: "fulfilled",
            timeline: [...(order.timeline || []), newEvent],
        };

        setOrder(updatedOrder);
        setIsFulfillmentModalOpen(false);
        toast.success("Pedido marcado como enviado!");
    };

    const handleMarkAsPaid = async () => {
        const newEvent = {
            id: `EVT-${Date.now()}`,
            type: "paid",
            title: "Pagamento confirmado",
            date: new Date().toISOString(),
            icon: "DollarSign",
            description: "Marcado como pago manualmente"
        };

        const updatedOrder = {
            ...order,
            paymentStatus: "paid",
            timeline: [...(order.timeline || []), newEvent]
        };
        setOrder(updatedOrder);
        toast.success("Pedido marcado como pago!");
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!order) {
        return <div className="p-8">Pedido não encontrado.</div>;
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "paid":
                return <Badge className="bg-green-500 hover:bg-green-600">Pago</Badge>;
            case "pending":
                return (
                    <Badge variant="secondary" className="text-yellow-600 bg-yellow-100">
                        Pendente
                    </Badge>
                );
            case "refunded":
                return <Badge variant="outline">Reembolsado</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTimelineIcon = (type) => {
        switch (type) {
            case 'created': return <Check className="h-4 w-4 text-white" />;
            case 'paid': return <DollarSign className="h-4 w-4 text-white" />;
            case 'fulfilled': return <Truck className="h-4 w-4 text-white" />;
            case 'delivered': return <PackageCheck className="h-4 w-4 text-white" />;
            default: return <Check className="h-4 w-4 text-white" />;
        }
    };

    const getRiskBadge = (score) => {
        if (score === 'low') return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><ShieldCheck className="w-3 h-3 mr-1" /> Baixo Risco</Badge>;
        if (score === 'medium') return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><ShieldAlert className="w-3 h-3 mr-1" /> Risco Médio</Badge>;
        return <Badge variant="destructive"><ShieldAlert className="w-3 h-3 mr-1" /> Alto Risco</Badge>;
    };

    const getPaymentMethodDisplay = (order) => {
        const details = getPaymentDetails(order);
        const Icon = details.icon;

        return (
            <div className="flex items-center gap-1">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{details.label}</span>
            </div>
        );
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            Pedido #{order.id}
                            <Badge variant="outline" className="text-xs font-normal">
                                {order.fulfillmentStatus === "fulfilled" ? "Enviado" : "Não Enviado"}
                            </Badge>
                            {order.riskAnalysis && getRiskBadge(order.riskAnalysis.score)}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {order.createdAt && format(new Date(order.createdAt), "d 'de' MMMM 'de' yyyy 'às' HH:mm", {
                                locale: ptBR,
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Ban className="mr-2 h-4 w-4" />
                        Cancelar
                    </Button>
                    {order.fulfillmentStatus === "unfulfilled" ? (
                        <Dialog open={isFulfillmentModalOpen} onOpenChange={setIsFulfillmentModalOpen}>
                            <DialogTrigger asChild>
                                <Button>Marcar como Enviado</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Marcar como Enviado</DialogTitle>
                                    <DialogDescription>
                                        Insira os detalhes de envio para notificar o cliente.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="carrier" className="text-right">
                                            Transportadora
                                        </Label>
                                        <Select
                                            onValueChange={(value) =>
                                                setFulfillmentData({ ...fulfillmentData, carrier: value })
                                            }
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="correios">Correios</SelectItem>
                                                <SelectItem value="jadlog">Jadlog</SelectItem>
                                                <SelectItem value="loggi">Loggi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="tracking" className="text-right">
                                            Cód. Rastreio
                                        </Label>
                                        <Input
                                            id="tracking"
                                            className="col-span-3"
                                            value={fulfillmentData.trackingCode}
                                            onChange={(e) =>
                                                setFulfillmentData({
                                                    ...fulfillmentData,
                                                    trackingCode: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="url" className="text-right">
                                            URL Rastreio
                                        </Label>
                                        <Input
                                            id="url"
                                            className="col-span-3"
                                            placeholder="Opcional"
                                            value={fulfillmentData.trackingUrl}
                                            onChange={(e) =>
                                                setFulfillmentData({
                                                    ...fulfillmentData,
                                                    trackingUrl: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleFulfillOrder}>Salvar e Enviar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Button variant="outline">
                            <Truck className="mr-2 h-4 w-4" />
                            Rastrear
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                {/* Main Column (Left) */}
                <div className="md:col-span-2 space-y-4">
                    {/* Items Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Itens do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Produto</TableHead>
                                        <TableHead>Detalhes</TableHead>
                                        <TableHead className="text-right">Preço</TableHead>
                                        <TableHead className="text-right">Qtd</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(order.items || []).map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="h-12 w-12 rounded-md bg-muted overflow-hidden">
                                                    <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.productName}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {item.variant}
                                                    </span>
                                                    <div className="flex gap-2 mt-1 flex-wrap">
                                                        {item.sku && <span className="text-xs text-muted-foreground bg-muted px-1 rounded">SKU: {item.sku}</span>}
                                                        {item.attributes_snapshot && typeof item.attributes_snapshot === 'object' && (
                                                            Object.entries(item.attributes_snapshot).map(([key, value]) => (
                                                                <span key={key} className="text-xs text-muted-foreground bg-muted px-1 rounded">
                                                                    {key}: {value}
                                                                </span>
                                                            ))
                                                        )}
                                                        {item.type === "Brechó" && (
                                                            <Badge variant="secondary" className="text-[10px] px-1 py-0 bg-purple-100 text-purple-700">
                                                                Peça Única
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.price.toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {(item.price * item.quantity).toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <div className="bg-muted/50 p-6">
                            <div className="flex flex-col gap-2 w-full max-w-xs ml-auto">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{(order.subtotal || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Frete (Sedex)</span>
                                    <span>{(order.shipping || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Descontos</span>
                                    <span>- {(order.discount || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{(order.total || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Payment Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">Pagamento</CardTitle>
                            {getStatusBadge(order.paymentStatus)}
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-start pt-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        {getPaymentMethodDisplay(order)}
                                    </div>
                                    {order.paymentDetails?.cardLast4 && (
                                        <span className="text-sm text-muted-foreground ml-6">**** {order.paymentDetails.cardLast4}</span>
                                    )}
                                    {order.paymentDetails?.installments && (
                                        <span className="text-sm text-muted-foreground ml-6">
                                            {order.paymentDetails.installments}x de {((order.paymentDetails.installmentValue || order.total) / order.paymentDetails.installments).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        </span>
                                    )}
                                    {order.paymentDetails?.transactionId && (
                                        <span className="text-xs text-muted-foreground mt-2 bg-muted px-2 py-1 rounded w-fit font-mono">
                                            ID: {order.paymentDetails.transactionId}
                                        </span>
                                    )}
                                    {order.paymentDetails?.authorizationCode && (
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded w-fit font-mono">
                                            Auth: {order.paymentDetails.authorizationCode}
                                        </span>
                                    )}
                                </div>
                                {order.paymentStatus === 'pending' && (
                                    <Button variant="outline" size="sm" onClick={handleMarkAsPaid}>
                                        Marcar como Pago
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                {(order.timeline || []).map((event, index) => (
                                    <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            {getTimelineIcon(event.type)}
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-slate-900">{event.title}</div>
                                                <time className="font-caveat font-medium text-indigo-500 text-xs">
                                                    {format(new Date(event.date), "HH:mm")}
                                                </time>
                                            </div>
                                            {event.description && (
                                                <div className="text-slate-500 text-sm">{event.description}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <div className="relative">
                                    <Input placeholder="Adicionar comentário interno..." className="pr-10" />
                                    <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Side Column (Right) */}
                <div className="space-y-4">
                    {/* Customer Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cliente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                        {(order.customer?.avatar || "C")}
                                    </div>
                                    <div className="flex flex-col">
                                        <Link href="#" className="font-medium hover:underline text-primary">
                                            {order.customer?.name}
                                        </Link>
                                        <span className="text-sm text-muted-foreground">{order.customer?.ordersCount} pedidos anteriores</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Email</span>
                                        <div className="flex items-center gap-2">
                                            <span className="truncate max-w-[150px]" title={order.customer?.email}>{order.customer?.email}</span>
                                            <Copy className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Telefone</span>
                                        <div className="flex items-center gap-2">
                                            <span>{order.customer?.phone}</span>
                                            <ExternalLink className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" />
                                        </div>
                                    </div>
                                </div>
                                {order.customer?.stats && (
                                    <>
                                        <Separator />
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-muted/50 p-2 rounded">
                                                <span className="text-xs text-muted-foreground block">Total Gasto (LTV)</span>
                                                <span className="font-medium text-sm text-green-600">
                                                    {order.customer.stats.totalSpent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                </span>
                                            </div>
                                            <div className="bg-muted/50 p-2 rounded">
                                                <span className="text-xs text-muted-foreground block">Ticket Médio</span>
                                                <span className="font-medium text-sm">
                                                    {order.customer.stats.aov.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                </span>
                                            </div>
                                        </div>
                                        {order.customer.stats.marketingOptIn && (
                                            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                                                <Mail className="h-3 w-3" />
                                                Aceita Marketing
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Entrega</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-sm">
                                    <p>{order.shippingAddress?.street}</p>
                                    <p>{order.shippingAddress?.city} - {order.shippingAddress?.state}</p>
                                    <p>{order.shippingAddress?.zip}</p>
                                    <p>{order.shippingAddress?.country}</p>
                                </div>
                                <div className="h-32 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                    <MapPin className="h-8 w-8 opacity-50" />
                                    <span className="ml-2 text-sm">Mapa indisponível</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Analysis Card */}
                    {order.riskAnalysis && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Análise de Risco</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Score de Fraude</span>
                                        {getRiskBadge(order.riskAnalysis.score)}
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-muted-foreground block mb-1">IP do Cliente</span>
                                        <div className="flex items-center justify-between bg-muted p-2 rounded">
                                            <span className="font-mono text-xs">{order.riskAnalysis.ip}</span>
                                            <span className="text-xs text-muted-foreground">{order.riskAnalysis.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <ShieldCheck className="h-3 w-3 text-green-500" />
                                        Recomendação: {order.riskAnalysis.recommendation === 'approve' ? 'Aprovar Pedido' : 'Revisar Manualmente'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Metadata Card */}
                    {order.metadata && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Metadados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            {order.metadata.device.includes('Mobile') ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                                            <span>Dispositivo</span>
                                        </div>
                                        <span>{order.metadata.device}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Globe className="h-4 w-4" />
                                            <span>Navegador</span>
                                        </div>
                                        <span>{order.metadata.browser}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>Origem</span>
                                        </div>
                                        <Badge variant="secondary" className="font-normal">{order.metadata.channel}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tags Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">VIP</Badge>
                                    <Badge variant="outline">Novo Cliente</Badge>
                                </div>
                                <Input placeholder="Adicionar tag..." />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
