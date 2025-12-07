"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppService from "@/services/app.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function BrandCreateModal({ open, onOpenChange, onCreate, onUpdate, initialData }) {
    const [name, setName] = useState("");
    const [logo, setLogo] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setLogo(initialData.logo || "");
        } else {
            setName("");
            setLogo("");
        }
    }, [initialData, open]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            const res = await AppService.uploadFile(file);
            // Assuming response is { url: '...' }
            setLogo(res.url);
            toast.success("Imagem enviada com sucesso!");
        } catch (error) {
            console.error("Failed to upload image:", error);
            toast.error("Erro ao enviar imagem.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            if (initialData) {
                const updatedBrand = await AppService.updateBrand(initialData.id, { name, logo });
                toast.success("Marca atualizada com sucesso!");
                if (onUpdate) onUpdate(updatedBrand);
            } else {
                const newBrand = await AppService.createBrand({ name, logo });
                toast.success("Marca criada com sucesso!");
                if (onCreate) onCreate(newBrand);
            }
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to create brand:", error);
            toast.error("Erro ao criar marca.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Marca" : "Nova Marca"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="brand-name">Nome da Marca</Label>
                        <Input
                            id="brand-name"
                            placeholder="Ex: Nike, Zara..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="brand-logo">Logo da Marca</Label>
                        <div className="flex gap-4 items-center">
                            {logo && (
                                <img src={logo} alt="Preview" className="h-12 w-12 object-contain border rounded" />
                            )}
                            <div className="flex-1">
                                <Label htmlFor="upload-logo" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full">
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {logo ? "Alterar Imagem" : "Escolher Imagem"}
                                </Label>
                                <Input
                                    id="upload-logo"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : (initialData ? "Salvar Alterações" : "Criar Marca")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
