import { CreditCard, QrCode, Landmark, Banknote } from "lucide-react";

export const getPaymentDetails = (order) => {
    if (order.Payments && order.Payments.length > 0) {
        // Get the latest payment or the first approved one
        const payment = order.Payments.find(p => p.status === 'approved') || order.Payments[order.Payments.length - 1];
        const provider = payment.provider;
        const method = payment.method;

        if (provider === 'mercadopago') {
            if (method === 'pix') return { label: 'Mercado Pago (Pix)', icon: QrCode, provider: 'Mercado Pago', method: 'Pix' };
            if (method === 'credit_card') return { label: 'Mercado Pago (Crédito)', icon: CreditCard, provider: 'Mercado Pago', method: 'Cartão de Crédito' };
            return { label: 'Mercado Pago', icon: CreditCard, provider: 'Mercado Pago', method: method };
        }
        if (provider === 'asaas') {
            if (method === 'pix') return { label: 'Asaas (Pix)', icon: QrCode, provider: 'Asaas', method: 'Pix' };
            return { label: 'Asaas (Boleto)', icon: Landmark, provider: 'Asaas', method: 'Boleto' };
        }
        if (provider === 'stripe') {
            return { label: 'Stripe', icon: CreditCard, provider: 'Stripe', method: 'Cartão' };
        }
    }

    // Fallback for legacy or manual orders
    const method = order.payment_method || order.paymentMethod;
    if (method === 'pix') return { label: 'Pix (Manual)', icon: QrCode, provider: 'Manual', method: 'Pix' };
    if (method === 'credit_card') return { label: 'Cartão (Manual)', icon: CreditCard, provider: 'Manual', method: 'Cartão' };

    return { label: 'Não Identificado', icon: Banknote, provider: 'N/A', method: 'N/A' };
};
