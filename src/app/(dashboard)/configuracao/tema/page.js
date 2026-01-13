"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Palette, Upload, Save, Eye, ArrowLeft,
    Image as ImageIcon, Type, Instagram, Facebook,
    MessageCircle, MapPin, ChevronDown, ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import styles from "./page.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ThemeConfigPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [storeTheme, setStoreTheme] = useState(null);
    const [expandedSection, setExpandedSection] = useState("colors");

    // Customizations state
    const [customizations, setCustomizations] = useState({
        colors: {
            primary: "#000000",
            secondary: "#666666",
            accent: "#0066CC",
            background: "#FFFFFF",
            text: "#1A1A1A"
        },
        logo: {
            url: "",
            width: 150,
            height: 50
        },
        favicon: "",
        footer: {
            showSocialLinks: true,
            instagram: "",
            facebook: "",
            whatsapp: "",
            address: "",
            copyrightText: ""
        },
        storeName: ""
    });

    useEffect(() => {
        fetchStoreTheme();
    }, []);

    const getToken = () => {
        if (typeof window !== "undefined") {
            const storage = localStorage.getItem("auth-storage");
            if (storage) {
                try {
                    const parsed = JSON.parse(storage);
                    return parsed.state?.token;
                } catch (e) { }
            }
            return localStorage.getItem("token");
        }
        return null;
    };

    const fetchStoreTheme = async () => {
        try {
            const token = getToken();
            const res = await fetch(`${API_URL}/api/themes/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success && data.data) {
                setStoreTheme(data.data);
                if (data.data.customizations) {
                    setCustomizations(prev => ({
                        ...prev,
                        ...data.data.customizations
                    }));
                }
            }
        } catch (err) {
            console.error("Error fetching store theme:", err);
            toast.error("Erro ao carregar configurações");
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = (key, value) => {
        setCustomizations(prev => ({
            ...prev,
            colors: { ...prev.colors, [key]: value }
        }));
    };

    const handleFooterChange = (key, value) => {
        setCustomizations(prev => ({
            ...prev,
            footer: { ...prev.footer, [key]: value }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = getToken();
            const res = await fetch(`${API_URL}/api/themes/me/customizations`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ customizations })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Configurações salvas!");
            } else {
                toast.error(data.message || "Erro ao salvar");
            }
        } catch (err) {
            console.error("Error saving:", err);
            toast.error("Erro ao salvar configurações");
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        setSaving(true);
        try {
            const token = getToken();

            // First save, then publish
            await fetch(`${API_URL}/api/themes/me/customizations`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ customizations })
            });

            const res = await fetch(`${API_URL}/api/themes/me/publish`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Tema publicado com sucesso!");
                fetchStoreTheme();
            } else {
                toast.error(data.message || "Erro ao publicar");
            }
        } catch (err) {
            console.error("Error publishing:", err);
            toast.error("Erro ao publicar tema");
        } finally {
            setSaving(false);
        }
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
                <p>Carregando configurações...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={18} />
                    Voltar
                </button>
                <div className={styles.headerInfo}>
                    <Palette className={styles.headerIcon} />
                    <div>
                        <h1 className={styles.title}>Configurar Tema</h1>
                        <p className={styles.subtitle}>
                            Personalize as cores, logo e informações da sua loja
                        </p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <Save size={16} />
                        Salvar
                    </button>
                    <button
                        className={styles.publishButton}
                        onClick={handlePublish}
                        disabled={saving}
                    >
                        <Eye size={16} />
                        Publicar
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                {/* Sidebar - Configurações */}
                <div className={styles.sidebar}>
                    {/* Store Name */}
                    <div className={styles.section}>
                        <button
                            className={styles.sectionHeader}
                            onClick={() => toggleSection("general")}
                        >
                            <span><Type size={18} /> Informações Gerais</span>
                            {expandedSection === "general" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSection === "general" && (
                            <div className={styles.sectionContent}>
                                <label className={styles.label}>
                                    Nome da Loja
                                    <input
                                        type="text"
                                        value={customizations.storeName || ""}
                                        onChange={(e) => setCustomizations(prev => ({
                                            ...prev,
                                            storeName: e.target.value
                                        }))}
                                        className={styles.input}
                                        placeholder="Minha Loja"
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Colors */}
                    <div className={styles.section}>
                        <button
                            className={styles.sectionHeader}
                            onClick={() => toggleSection("colors")}
                        >
                            <span><Palette size={18} /> Cores</span>
                            {expandedSection === "colors" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSection === "colors" && (
                            <div className={styles.sectionContent}>
                                {Object.entries(customizations.colors).map(([key, value]) => (
                                    <label key={key} className={styles.colorLabel}>
                                        <span className={styles.colorName}>
                                            {key === "primary" && "Cor Primária"}
                                            {key === "secondary" && "Cor Secundária"}
                                            {key === "accent" && "Cor de Destaque"}
                                            {key === "background" && "Fundo"}
                                            {key === "text" && "Texto"}
                                        </span>
                                        <div className={styles.colorInput}>
                                            <input
                                                type="color"
                                                value={value}
                                                onChange={(e) => handleColorChange(key, e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => handleColorChange(key, e.target.value)}
                                                className={styles.colorText}
                                            />
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Logo */}
                    <div className={styles.section}>
                        <button
                            className={styles.sectionHeader}
                            onClick={() => toggleSection("logo")}
                        >
                            <span><ImageIcon size={18} /> Logo</span>
                            {expandedSection === "logo" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSection === "logo" && (
                            <div className={styles.sectionContent}>
                                <label className={styles.label}>
                                    URL do Logo
                                    <input
                                        type="text"
                                        value={customizations.logo?.url || ""}
                                        onChange={(e) => setCustomizations(prev => ({
                                            ...prev,
                                            logo: { ...prev.logo, url: e.target.value }
                                        }))}
                                        className={styles.input}
                                        placeholder="https://..."
                                    />
                                </label>
                                {customizations.logo?.url && (
                                    <div className={styles.logoPreview}>
                                        <img src={customizations.logo.url} alt="Logo preview" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className={styles.section}>
                        <button
                            className={styles.sectionHeader}
                            onClick={() => toggleSection("footer")}
                        >
                            <span><MapPin size={18} /> Rodapé</span>
                            {expandedSection === "footer" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSection === "footer" && (
                            <div className={styles.sectionContent}>
                                <label className={styles.label}>
                                    <Instagram size={16} /> Instagram
                                    <input
                                        type="text"
                                        value={customizations.footer?.instagram || ""}
                                        onChange={(e) => handleFooterChange("instagram", e.target.value)}
                                        className={styles.input}
                                        placeholder="https://instagram.com/..."
                                    />
                                </label>
                                <label className={styles.label}>
                                    <Facebook size={16} /> Facebook
                                    <input
                                        type="text"
                                        value={customizations.footer?.facebook || ""}
                                        onChange={(e) => handleFooterChange("facebook", e.target.value)}
                                        className={styles.input}
                                        placeholder="https://facebook.com/..."
                                    />
                                </label>
                                <label className={styles.label}>
                                    <MessageCircle size={16} /> WhatsApp
                                    <input
                                        type="text"
                                        value={customizations.footer?.whatsapp || ""}
                                        onChange={(e) => handleFooterChange("whatsapp", e.target.value)}
                                        className={styles.input}
                                        placeholder="5511999999999"
                                    />
                                </label>
                                <label className={styles.label}>
                                    Endereço
                                    <textarea
                                        value={customizations.footer?.address || ""}
                                        onChange={(e) => handleFooterChange("address", e.target.value)}
                                        className={styles.textarea}
                                        placeholder="Rua Example, 123 - Cidade/UF"
                                        rows={2}
                                    />
                                </label>
                                <label className={styles.label}>
                                    Texto de Copyright
                                    <input
                                        type="text"
                                        value={customizations.footer?.copyrightText || ""}
                                        onChange={(e) => handleFooterChange("copyrightText", e.target.value)}
                                        className={styles.input}
                                        placeholder="© 2025 Minha Loja"
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview */}
                <div className={styles.preview}>
                    <div className={styles.previewHeader}>
                        <Eye size={18} />
                        <span>Pré-visualização</span>
                    </div>
                    <div
                        className={styles.previewFrame}
                        style={{
                            "--preview-primary": customizations.colors.primary,
                            "--preview-secondary": customizations.colors.secondary,
                            "--preview-accent": customizations.colors.accent,
                            "--preview-bg": customizations.colors.background,
                            "--preview-text": customizations.colors.text
                        }}
                    >
                        {/* Mini Header */}
                        <div className={styles.miniHeader}>
                            {customizations.logo?.url ? (
                                <img src={customizations.logo.url} alt="Logo" className={styles.miniLogo} />
                            ) : (
                                <span className={styles.miniLogoText}>
                                    {customizations.storeName || "Minha Loja"}
                                </span>
                            )}
                            <div className={styles.miniNav}>
                                <span>Início</span>
                                <span>Loja</span>
                                <span>Sobre</span>
                            </div>
                        </div>

                        {/* Mini Hero */}
                        <div className={styles.miniHero}>
                            <h2>Nova Coleção</h2>
                            <button>Ver Produtos</button>
                        </div>

                        {/* Mini Products */}
                        <div className={styles.miniProducts}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={styles.miniProduct}>
                                    <div className={styles.miniProductImage}></div>
                                    <div className={styles.miniProductInfo}>
                                        <span className={styles.miniProductName}>Produto {i}</span>
                                        <span className={styles.miniProductPrice}>R$ 99,90</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mini Footer */}
                        <div className={styles.miniFooter}>
                            <span>{customizations.footer?.copyrightText || `© ${new Date().getFullYear()} ${customizations.storeName || "Minha Loja"}`}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
