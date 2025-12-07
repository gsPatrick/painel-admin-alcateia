"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Filter } from "lucide-react";
import AppService from "@/services/app.service";
import { toast } from "sonner";
import { BrandCreateModal } from "@/components/products/BrandCreateModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BrandsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setIsLoading(true);
        try {
            const data = await AppService.getBrands();
            setBrands(data || []);
        } catch (error) {
            console.error("Error fetching brands:", error);
            toast.error("Erro ao carregar marcas.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = (newBrand) => {
        setBrands([...brands, newBrand]);
        setIsModalOpen(false);
    };

    const handleUpdate = (updatedBrand) => {
        setBrands(brands.map(b => b.id === updatedBrand.id ? updatedBrand : b));
        setIsModalOpen(false);
        setEditingBrand(null);
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja excluir esta marca?")) return;

        try {
            await AppService.deleteBrand(id);
            setBrands(brands.filter(b => b.id !== id));
            toast.success("Marca excluída com sucesso!");
        } catch (error) {
            console.error("Error deleting brand:", error);
            toast.error("Erro ao excluir marca.");
        }
    };

    const openEditModal = (brand) => {
        setEditingBrand(brand);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingBrand(null);
        setIsModalOpen(true);
    };

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Marcas</h1>
                    <p className="text-muted-foreground">Gerencie as marcas dos seus produtos.</p>
                </div>
                <Button className="shadow-md" onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" /> Nova Marca
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle>Listagem de Marcas</CardTitle>
                    <CardDescription>Visualize e gerencie todas as marcas cadastradas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar marcas..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="border rounded-md bg-card shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="w-[80px]">Logo</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-32 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredBrands.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Filter className="h-8 w-8 opacity-20" />
                                                <p>Nenhuma marca encontrada.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBrands.map((brand) => (
                                        <TableRow key={brand.id} className="group">
                                            <TableCell>
                                                <Avatar className="h-10 w-10 rounded-lg border">
                                                    <AvatarImage src={brand.logo} alt={brand.name} />
                                                    <AvatarFallback className="rounded-lg">{brand.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">{brand.name}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="sr-only">Abrir menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => openEditModal(brand)}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(brand.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <BrandCreateModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                initialData={editingBrand}
            />
        </div>
    );
}
