"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, User, CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getPaymentDetails } from "@/lib/formatters";

export function OrderDetailsModal({ order, open, onOpenChange }) {
    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between pr-8">
                        <DialogTitle className="text-xl">Pedido #{order.id}</DialogTitle>
                        <Badge variant="outline" className={`
                ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800' :
                                order.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}
            `}>
                            {order.status}
                        </Badge>
                    </div>
                    <DialogDescription>
                        Realizado em {new Date(order.createdAt).toLocaleDateString()} às {new Date(order.createdAt).toLocaleTimeString()}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Customer Info */}
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                        <User className="size-5 text-muted-foreground mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-sm">Cliente</h4>
                            <p className="text-sm text-muted-foreground">{order.User?.name}</p>
                            <p className="text-xs text-muted-foreground">{order.User?.email}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                        <CreditCard className="size-5 text-muted-foreground mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-sm">Pagamento</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{getPaymentDetails(order).label}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items (Mocked for now if not in order object) */}
                    <div>
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Package className="size-4" /> Itens do Pedido
                        </h4>
                        <div className="space-y-3">
                            {/* Mock Items if not present */}
                            {(order.items || [
                                { name: 'Produto Exemplo A', quantity: 1, price: order.total * 0.6 },
                                { name: 'Produto Exemplo B', quantity: 2, price: order.total * 0.2 }
                            ]).map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground">{item.quantity}x {item.name || item.Product?.name || item.productName}</span>
                                        {item.attributes_snapshot && (
                                            <span className="text-xs text-muted-foreground ml-4">
                                                {Object.entries(item.attributes_snapshot).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-medium">R$ {parseFloat(item.price).toFixed(2)}</span>
                                </div>
                            ))}
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>R$ {parseFloat(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <Link href={`/orders/${order.id}`} className="w-full">
                            <Button variant="outline" className="w-full gap-2">
                                <ExternalLink className="size-4" />
                                Ver Detalhes Completos
                            </Button>
                        </Link>
                        <Button className="w-full gap-2">
                            <Truck className="size-4" />
                            Gerar Etiqueta
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
