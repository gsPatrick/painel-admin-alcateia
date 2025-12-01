import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Image as ImageIcon, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppService from "@/services/app.service";

export function CategoryProductsModal({ open, onOpenChange, category }) {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open && category) {
            fetchCategoryProducts();
        }
    }, [open, category]);

    const fetchCategoryProducts = async () => {
        setLoading(true);
        try {
            // In a real scenario, we might want an endpoint like /products?category=ID
            // For now, we fetch all and filter client-side as per current AppService capabilities
            const allProducts = await AppService.getProducts();
            const filtered = allProducts.filter(p => p.categoryId === category.id);
            setProducts(filtered);
        } catch (error) {
            console.error("Error fetching category products:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!category) return null;

    const handleProductClick = (productId) => {
        onOpenChange(false);
        router.push(`/products/${productId}`);
    };

    const handleViewAllClick = () => {
        onOpenChange(false);
        router.push(`/products?category=${category.id}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] sm:max-w-[90vw] h-[85vh] flex flex-col p-6 z-[100]">
                <DialogHeader className="px-1 shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        {category.name}
                        <Badge variant="secondary" className="text-sm font-normal px-2 py-0.5">
                            {products.length} produtos
                        </Badge>
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        Visualização rápida e gerenciamento dos produtos nesta categoria.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 mt-4 border rounded-md bg-muted/10">
                    <ScrollArea className="h-full p-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group relative border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                                        onClick={() => handleProductClick(product.id)}
                                    >
                                        <div className="aspect-square bg-muted relative overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 bg-muted/50">
                                                    <ImageIcon className="h-10 w-10 mb-2" />
                                                    <span className="text-xs font-medium uppercase tracking-wider">Sem Imagem</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <Badge className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black hover:bg-white/90 shadow-sm">
                                                    Editar Produto
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-semibold text-base truncate" title={product.name}>{product.name}</h4>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-lg font-bold text-primary">
                                                    {parseFloat(product.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </span>
                                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                                    {product.stock || 0} est.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* "View More" Card */}
                                <div
                                    className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all aspect-square text-muted-foreground hover:text-primary group"
                                    onClick={handleViewAllClick}
                                >
                                    <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                                        <Package className="h-8 w-8" />
                                    </div>
                                    <span className="font-semibold text-base">Ver Todos</span>
                                    <span className="text-xs text-center px-4">Ir para lista completa filtrada</span>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className="sm:justify-between gap-2 mt-4 pt-4 border-t">
                    <Button variant="ghost" className="text-muted-foreground" onClick={() => onOpenChange(false)}>
                        Fechar
                    </Button>
                    <Button onClick={handleViewAllClick} size="lg" className="w-full sm:w-auto shadow-sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Gerenciar Produtos desta Categoria
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
