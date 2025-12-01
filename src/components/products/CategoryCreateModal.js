
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import AppService from "@/services/app.service";
import { toast } from "sonner";

export function CategoryCreateModal({ open, onOpenChange, onCreate, categories = [], mode = "category", defaultParentId = "none" }) {
    const [name, setName] = useState("");
    const [parentId, setParentId] = useState(defaultParentId);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Reset state when modal opens or props change
    useEffect(() => {
        if (open) {
            setName("");
            setParentId(defaultParentId);
            setImage(null);
            setImageFile(null);
            setLoading(false);
        }
    }, [open, defaultParentId]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!name) return;
        setLoading(true);

        try {
            let imageUrl = null;
            if (imageFile) {
                const uploadResult = await AppService.uploadFile(imageFile);
                imageUrl = uploadResult.url;
            }

            const payload = {
                name,
                parentId: mode === "category" ? null : (parentId === "none" ? null : parentId),
                image: imageUrl
            };

            await AppService.createCategory(payload);
            toast.success("Categoria criada com sucesso!");
            onCreate(); // Refresh list
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating category:", error);
            toast.error("Erro ao criar categoria.");
        } finally {
            setLoading(false);
        }
    };

    // Only show root categories as potential parents
    const potentialParents = categories.filter(c => !c.parentId);

    const isSubcategoryMode = mode === "subcategory";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] z-[100]">
                <DialogHeader>
                    <DialogTitle>
                        {isSubcategoryMode ? "Nova Subcategoria" : "Nova Categoria"}
                    </DialogTitle>
                    <DialogDescription>
                        {isSubcategoryMode
                            ? "Crie uma subcategoria vinculada a uma categoria pai."
                            : "Crie uma nova categoria principal."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Image Upload */}
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer group">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={handleImageUpload}
                            />
                            {image ? (
                                <>
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <ImageIcon className="text-white size-6" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-muted-foreground">
                                    <Upload className="size-6 mb-1" />
                                    <span className="text-[10px] uppercase font-bold">Imagem</span>
                                </div>
                            )}
                        </div>
                        {image && (
                            <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive hover:text-destructive" onClick={() => setImage(null)}>
                                Remover Imagem
                            </Button>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={isSubcategoryMode ? "Ex: Manga Curta" : "Ex: Camisetas"}
                        />
                    </div>

                    {isSubcategoryMode && (
                        <div className="grid gap-2">
                            <Label htmlFor="parent">Categoria Pai</Label>
                            <Select value={parentId} onValueChange={setParentId}>
                                <SelectTrigger className="z-[101]">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="z-[102]">
                                    <SelectItem value="none">Nenhuma (Tornar Principal)</SelectItem>
                                    {potentialParents.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={!name || loading}>
                        {loading ? "Criando..." : "Criar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
