"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import AppService from "@/services/app.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Palette, Globe, Share2, Save, RefreshCw } from "lucide-react";

export default function SettingsPage() {
    const { theme, updateTheme } = useTheme();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await AppService.getSettings();
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch settings:", error);
                toast.error("Erro ao carregar configurações.");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleIdentityChange = (field, value) => {
        const newIdentity = { ...settings.identity, [field]: value };
        setSettings({ ...settings, identity: newIdentity });

        // Real-time preview update
        if (['storeName', 'logoUrl', 'primaryColor', 'secondaryColor'].includes(field)) {
            updateTheme({ [field]: value });
        }
    };

    const handleInputChange = (section, field, value) => {
        setSettings({
            ...settings,
            [section]: { ...settings[section], [field]: value }
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Simulate saving each section
            await AppService.updateSettings('identity', settings.identity);
            await AppService.updateSettings('seo', settings.seo);
            toast.success("Configurações salvas com sucesso!");
        } catch (error) {
            console.error("Failed to save settings:", error);
            toast.error("Erro ao salvar configurações.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!settings) return <div className="p-8">Erro ao carregar configurações.</div>;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Configurações da Loja</h2>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Salvar Alterações
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="identity" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="identity" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" /> Identidade & Tema
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Contato & SEO
                    </TabsTrigger>
                </TabsList>

                {/* ABA 1: IDENTIDADE & TEMA */}
                <TabsContent value="identity" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Branding</CardTitle>
                                <CardDescription>Personalize a identidade visual da sua loja.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nome da Loja</Label>
                                    <Input
                                        value={settings.identity.storeName}
                                        onChange={(e) => handleIdentityChange('storeName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Logo URL</Label>
                                    <Input
                                        value={settings.identity.logoUrl}
                                        onChange={(e) => handleIdentityChange('logoUrl', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    <p className="text-xs text-muted-foreground">Cole a URL do seu logo. Ele atualizará o sidebar instantaneamente.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Cores (Theming)</CardTitle>
                                <CardDescription>Defina as cores principais do sistema.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Cor da Marca</Label>
                                        <div className="text-xs text-muted-foreground">{settings.identity.secondaryColor}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="color"
                                            className="h-10 w-20 p-1 cursor-pointer"
                                            value={settings.identity.secondaryColor}
                                            onChange={(e) => handleIdentityChange('secondaryColor', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label>Preview</Label>
                                    <div className="p-4 border rounded-lg flex items-center gap-4 justify-center bg-background">
                                        <Button style={{ backgroundColor: theme.primaryColor }}>Botão Primário</Button>
                                        <div className="px-2.5 py-0.5 text-xs font-semibold rounded-full text-white" style={{ backgroundColor: settings.identity.secondaryColor }}>
                                            Badge Secundário
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>



                {/* ABA 3: CONTATO & SEO */}
                <TabsContent value="seo" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações de Contato</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>WhatsApp</Label>
                                    <Input
                                        value={settings.seo.whatsapp}
                                        onChange={(e) => handleInputChange('seo', 'whatsapp', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Instagram</Label>
                                    <Input
                                        value={settings.seo.instagram}
                                        onChange={(e) => handleInputChange('seo', 'instagram', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email de Suporte</Label>
                                    <Input
                                        value={settings.seo.supportEmail}
                                        onChange={(e) => handleInputChange('seo', 'supportEmail', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Padrão</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Meta Title Padrão</Label>
                                <Input
                                    value={settings.seo.metaTitle}
                                    onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Meta Description Padrão</Label>
                                <Input
                                    value={settings.seo.metaDescription}
                                    onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
