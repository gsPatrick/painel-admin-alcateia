"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Palette, Sparkles, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ThemeSetupPage() {
    const router = useRouter();
    const [themes, setThemes] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchThemes();
    }, []);

    const fetchThemes = async () => {
        try {
            const res = await fetch(`${API_URL}/api/themes`);
            const data = await res.json();
            if (data.success) {
                setThemes(data.data);
            }
        } catch (err) {
            console.error("Error fetching themes:", err);
            setError("Erro ao carregar temas");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTheme = async () => {
        if (!selectedTheme) return;

        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/themes/me/select`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ themeId: selectedTheme.id })
            });

            const data = await res.json();
            if (data.success) {
                router.push("/configuracao/tema");
            } else {
                setError(data.message || "Erro ao selecionar tema");
            }
        } catch (err) {
            console.error("Error selecting theme:", err);
            setError("Erro ao selecionar tema");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
                <p>Carregando temas...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.iconWrapper}>
                    <Palette className={styles.icon} />
                </div>
                <h1 className={styles.title}>Escolha o tema da sua loja</h1>
                <p className={styles.subtitle}>
                    Selecione um tema que combine com sua marca. Você poderá personalizar cores, logo e muito mais depois.
                </p>
            </motion.div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            <div className={styles.themesGrid}>
                {themes.map((theme, index) => (
                    <motion.div
                        key={theme.id}
                        className={`${styles.themeCard} ${selectedTheme?.id === theme.id ? styles.selected : ""}`}
                        onClick={() => setSelectedTheme(theme)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className={styles.themePreview}>
                            {theme.thumbnail ? (
                                <img src={theme.thumbnail} alt={theme.name} />
                            ) : (
                                <div
                                    className={styles.themePreviewPlaceholder}
                                    style={{
                                        background: theme.config?.colors?.primary || "#000"
                                    }}
                                >
                                    <Sparkles size={32} />
                                </div>
                            )}
                        </div>

                        <div className={styles.themeInfo}>
                            <div className={styles.themeHeader}>
                                <h3 className={styles.themeName}>{theme.name}</h3>
                                {selectedTheme?.id === theme.id && (
                                    <CheckCircle2 className={styles.checkIcon} />
                                )}
                            </div>
                            <p className={styles.themeDescription}>
                                {theme.description}
                            </p>

                            <div className={styles.themeFeatures}>
                                {theme.features?.slice(0, 3).map((feature, i) => (
                                    <span key={i} className={styles.featureTag}>
                                        {feature.replace(/-/g, " ")}
                                    </span>
                                ))}
                            </div>

                            <div className={styles.themeColors}>
                                {Object.entries(theme.config?.colors || {}).slice(0, 5).map(([key, color]) => (
                                    <div
                                        key={key}
                                        className={styles.colorDot}
                                        style={{ background: color }}
                                        title={key}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className={styles.footer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <button
                    className={styles.continueButton}
                    onClick={handleSelectTheme}
                    disabled={!selectedTheme || saving}
                >
                    {saving ? (
                        <>
                            <div className={styles.buttonSpinner} />
                            Salvando...
                        </>
                    ) : (
                        <>
                            Continuar com {selectedTheme?.name || "tema selecionado"}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
}
