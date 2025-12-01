"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Wallet,
    ShoppingBag,
    TrendingUp,
    MoreVertical,
    Edit,
    Lock,
    Ban,
    Copy,
    ExternalLink,
    Plus,
    Minus,
    MessageSquare,
    Check,
    CreditCard,
    DollarSign,
    Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
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
import { Textarea } from "@/components/ui/textarea";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import AppService from "@/services/app.service";
import Link from "next/link";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function CustomerProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noteText, setNoteText] = useState("");
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
    const [balanceAdjustment, setBalanceAdjustment] = useState({ type: "credit", amount: "" });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            setLoading(true);
            try {
                const data = await AppService.getCustomerById(params.id);
                if (data) {
                    setCustomer(data);
                } else {
                    toast.error("Cliente não encontrado.");
                    router.push('/customers');
                }
            } catch (error) {
                console.error("Failed to fetch customer:", error);
                toast.error("Erro ao carregar cliente.");
            } finally {
                setLoading(false);
            }
        };
        if (params.id) {
            fetchCustomer();
        }
    }, [params.id, router]);

    // Calculate Metrics if not provided by API
    const calculateMetrics = () => {
        if (!customer) return { ltv: 0, avgTicket: 0, ordersCount: 0 };

        const orders = customer.orders || [];
        const ordersCount = orders.length;
        const ltv = customer.ltv || orders.reduce((acc, order) => acc + parseFloat(order.total || 0), 0);
        const avgTicket = ordersCount > 0 ? ltv / ordersCount : 0;

        return { ltv, avgTicket, ordersCount };
    };

    const metrics = calculateMetrics();

    const handleAddNote = () => {
        if (!noteText.trim()) return;
        const newNote = {
            id: `NOTE-${Date.now()}`,
            text: noteText,
            author: "Admin", // Mock author
            date: new Date().toISOString()
        };
        setCustomer({
            ...customer,
            notes: [newNote, ...(customer.notes || [])]
        });
        setNoteText("");
    };

    const handleAdjustBalance = () => {
        const amount = parseFloat(balanceAdjustment.amount);
        if (isNaN(amount) || amount <= 0) return;

        const newBalance = balanceAdjustment.type === 'credit'
            ? (customer.walletBalance || 0) + amount
            : (customer.walletBalance || 0) - amount;

        const newHistoryItem = {
            id: `WH-${Date.now()}`,
            type: balanceAdjustment.type,
            amount: amount,
            description: "Ajuste Manual Admin",
            date: new Date().toISOString()
        };

        setCustomer({
            ...customer,
            walletBalance: newBalance,
            walletHistory: [newHistoryItem, ...(customer.walletHistory || [])]
        });
        setIsBalanceModalOpen(false);
        setBalanceAdjustment({ type: "credit", amount: "" });
    };

    const handleOrderClick = (orderId) => {
        // Mocking full order details for the modal
        setSelectedOrder({
            id: orderId,
            date: new Date().toISOString(),
            status: "completed",
            total: orderId === "#1024" ? 150.00 : 89.90,
            items: [
                { name: "Produto Exemplo", quantity: 1, price: orderId === "#1024" ? 150.00 : 89.90 }
            ],
            paymentMethod: "Credit Card",
            shippingAddress: "Rua Augusta, 500 - SP"
        });
        setIsOrderModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!customer) {
        return <div className="p-8">Cliente não encontrado.</div>;
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-2xl">
                            {(customer.name || "C").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                {customer.name}
                                {customer.status === 'blocked' && <Badge variant="destructive">Bloqueado</Badge>}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Cliente desde {customer.createdAt ? format(new Date(customer.createdAt), "MMMM 'de' yyyy", { locale: ptBR }) : 'N/A'}</span>
                                <span>•</span>
                                <div className="flex gap-1">
                                    {(customer.tags || []).map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Perfil
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Lock className="mr-2 h-4 w-4" /> Resetar Senha
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                <Ban className="mr-2 h-4 w-4" /> Bloquear Cliente
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                {/* Main Column (Left) */}
                <div className="md:col-span-2 space-y-4">
                    {/* Metrics Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Gasto (LTV)</CardTitle>
                                <TrendingUp className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {metrics.ltv.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </div>
                                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1 flex flex-col">
                                    <span>Total em Pedidos</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-purple-50 border-purple-100 dark:bg-purple-900/10 dark:border-purple-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Ticket Médio</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                    {metrics.avgTicket.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Créditos</CardTitle>
                                <Wallet className="h-4 w-4 text-green-700 dark:text-green-300" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    {(customer.walletBalance || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </div>
                                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                    Disponível para uso
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Últimos Pedidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* Real Orders Mapping */}
                                    {(customer.orders || []).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                                                Nenhum pedido encontrado.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        (customer.orders || []).slice(0, 5).map(order => (
                                            <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleOrderClick(order.id)}>
                                                <TableCell className="font-medium">#{order.id}</TableCell>
                                                <TableCell>
                                                    {order.createdAt ? formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ptBR }) : 'N/A'}
                                                </TableCell>
                                                <TableCell><Badge variant="outline">{order.status}</Badge></TableCell>
                                                <TableCell className="text-right">
                                                    {parseFloat(order.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <div className="mt-4 text-center">
                                <Button variant="link" className="text-primary">Ver todos os pedidos deste cliente</Button>
                            </div>

                            <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Detalhes do Pedido {selectedOrder?.id}</DialogTitle>
                                        <DialogDescription>
                                            Realizado em {selectedOrder && format(new Date(selectedOrder.date), "dd/MM/yyyy 'às' HH:mm")}
                                        </DialogDescription>
                                    </DialogHeader>
                                    {selectedOrder && (
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-muted-foreground">Status</Label>
                                                    <div className="font-medium">{selectedOrder.status}</div>
                                                </div>
                                                <div>
                                                    <Label className="text-muted-foreground">Total</Label>
                                                    <div className="font-medium">
                                                        {selectedOrder.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-muted-foreground">Pagamento</Label>
                                                    <div className="font-medium">{selectedOrder.paymentMethod}</div>
                                                </div>
                                                <div>
                                                    <Label className="text-muted-foreground">Endereço</Label>
                                                    <div className="font-medium">{selectedOrder.shippingAddress}</div>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <Label className="mb-2 block">Itens</Label>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Produto</TableHead>
                                                            <TableHead className="text-right">Qtd</TableHead>
                                                            <TableHead className="text-right">Preço</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {selectedOrder.items.map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{item.name}</TableCell>
                                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                                <TableCell className="text-right">
                                                                    {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    {/* Internal Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notas Internas</CardTitle>
                            <CardDescription>Anotações visíveis apenas para a equipe.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Textarea
                                        placeholder="Adicionar uma nota..."
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                    />
                                    <Button className="self-end" onClick={handleAddNote}>Adicionar</Button>
                                </div>
                                <div className="space-y-4 mt-4">
                                    {(customer.notes || []).map(note => (
                                        <div key={note.id} className="bg-muted p-3 rounded-md text-sm">
                                            <p>{note.text}</p>
                                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                                <span>{note.author}</span>
                                                <span>{format(new Date(note.date), "dd/MM/yyyy HH:mm")}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Side Column (Right) */}
                <div className="space-y-4">
                    {/* Contact Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contato</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate max-w-[180px]" title={customer.email}>{customer.email}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{customer.phone}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ExternalLink className="h-3 w-3" />
                                </Button>
                            </div>
                            <Separator />
                            <div className="flex items-center space-x-2">
                                <Checkbox id="marketing" checked={customer.marketingOptIn} disabled />
                                <label
                                    htmlFor="marketing"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Aceita Marketing/Newsletter
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Addresses */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Endereços</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            {(customer.addresses || []).length === 0 ? (
                                <div className="text-sm text-muted-foreground text-center py-2">Nenhum endereço cadastrado.</div>
                            ) : (
                                (customer.addresses || []).map(addr => (
                                    <div key={addr.id} className="border rounded p-3 text-sm relative">
                                        {addr.default && <Badge variant="secondary" className="absolute top-2 right-2 text-[10px]">Padrão</Badge>}
                                        <div className="font-medium">{addr.street}</div>
                                        <div className="text-muted-foreground">{addr.city} - {addr.state}</div>
                                        <div className="text-muted-foreground">{addr.zip}</div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Wallet / Cashback */}
                    <Card className="border-green-100 bg-green-50/30 dark:border-green-800 dark:bg-green-900/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                <Wallet className="h-5 w-5" />
                                Credits
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-sm text-muted-foreground">Saldo Atual</span>
                                    <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                                        {(customer.walletBalance || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </div>
                                </div>
                                <Dialog open={isBalanceModalOpen} onOpenChange={setIsBalanceModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20">
                                            Ajustar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Ajustar Saldo</DialogTitle>
                                            <DialogDescription>Adicione ou remova créditos da carteira do cliente.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right">Tipo</Label>
                                                <div className="flex gap-2 col-span-3">
                                                    <Button
                                                        variant={balanceAdjustment.type === 'credit' ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setBalanceAdjustment({ ...balanceAdjustment, type: 'credit' })}
                                                    >
                                                        <Plus className="mr-2 h-3 w-3" /> Adicionar
                                                    </Button>
                                                    <Button
                                                        variant={balanceAdjustment.type === 'debit' ? 'destructive' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setBalanceAdjustment({ ...balanceAdjustment, type: 'debit' })}
                                                    >
                                                        <Minus className="mr-2 h-3 w-3" /> Remover
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="amount" className="text-right">Valor (R$)</Label>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    className="col-span-3"
                                                    value={balanceAdjustment.amount}
                                                    onChange={(e) => setBalanceAdjustment({ ...balanceAdjustment, amount: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleAdjustBalance}>Confirmar Ajuste</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <span className="text-xs font-medium text-muted-foreground">Histórico Recente</span>
                                {(customer.walletHistory || []).map(history => (
                                    <div key={history.id} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground truncate max-w-[150px]">{history.description}</span>
                                        <span className={history.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                                            {history.type === 'credit' ? '+' : '-'} {history.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-2">
                                <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full text-xs h-8">
                                            Ver histórico completo
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[800px]">
                                        <DialogHeader>
                                            <DialogTitle>Histórico Detalhado de Créditos</DialogTitle>
                                            <DialogDescription>
                                                Acompanhe a evolução do saldo, ganhos, gastos e expirações por mês.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <Tabs defaultValue="2024-12" className="w-full">
                                            <div className="flex items-center justify-between mb-4">
                                                <TabsList>
                                                    <TabsTrigger value="2024-12">Dezembro 2024</TabsTrigger>
                                                    <TabsTrigger value="2024-11">Novembro 2024</TabsTrigger>
                                                </TabsList>
                                            </div>

                                            {["2024-12", "2024-11"].map((month) => {
                                                const monthData = (customer.walletHistory || []).filter(h => h.month === month);
                                                const received = monthData.filter(h => h.type === 'credit').reduce((acc, curr) => acc + curr.amount, 0);
                                                const spent = monthData.filter(h => h.type === 'debit').reduce((acc, curr) => acc + curr.amount, 0);
                                                const expired = monthData.filter(h => h.type === 'expired').reduce((acc, curr) => acc + curr.amount, 0);
                                                const productsAcquired = monthData.filter(h => h.type === 'debit').flatMap(h => h.products || []);

                                                return (
                                                    <TabsContent key={month} value={month} className="space-y-4">
                                                        <div className="grid grid-cols-3 gap-4">
                                                            <Card className="bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800">
                                                                <CardHeader className="pb-2">
                                                                    <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Recebido</CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                                                                        +{received.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                            <Card className="bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800">
                                                                <CardHeader className="pb-2">
                                                                    <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Utilizado</CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                                                        -{spent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                            <Card className="bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800">
                                                                <CardHeader className="pb-2">
                                                                    <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Expirado (Reset)</CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                                                                        -{expired.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle className="text-sm">Extrato do Mês</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="max-h-[200px] overflow-y-auto">
                                                                    <Table>
                                                                        <TableBody>
                                                                            {monthData.map((history) => (
                                                                                <TableRow key={history.id}>
                                                                                    <TableCell className="text-xs text-muted-foreground">
                                                                                        {format(parseISO(history.date), "dd/MM HH:mm")}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-sm">{history.description}</TableCell>
                                                                                    <TableCell className={`text-right font-medium text-sm ${history.type === 'credit' ? 'text-green-600' :
                                                                                        history.type === 'expired' ? 'text-red-600' : 'text-blue-600'
                                                                                        }`}>
                                                                                        {history.type === 'credit' ? '+' : '-'} {history.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                            {monthData.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Sem movimentações.</TableCell></TableRow>}
                                                                        </TableBody>
                                                                    </Table>
                                                                </CardContent>
                                                            </Card>

                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle className="text-sm">Produtos Adquiridos com Crédito</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="max-h-[200px] overflow-y-auto">
                                                                    {productsAcquired.length > 0 ? (
                                                                        <ul className="space-y-2">
                                                                            {productsAcquired.map((prod, idx) => (
                                                                                <li key={idx} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                                                                                    <span>{prod.name}</span>
                                                                                    <span className="font-medium text-blue-600">
                                                                                        {prod.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                                                    </span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    ) : (
                                                                        <p className="text-sm text-muted-foreground text-center py-4">Nenhum produto adquirido com créditos neste mês.</p>
                                                                    )}
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    </TabsContent>
                                                );
                                            })}
                                        </Tabs>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
