'use client';

import { useState, useEffect } from 'react';
import styles from './steps.module.css';

const THEMES_FALLBACK = [
    { id: '1', name: 'Clean', slug: 'clean', description: 'Estilo Shopify Dawn - Minimal e alta conversão', preview: 'https://placehold.co/400x300/f5f5f5/333?text=Clean' },
    { id: '2', name: 'Classic', slug: 'classic', description: 'Estilo WooCommerce - Tradicional com barra superior', preview: 'https://placehold.co/400x300/e5e5e5/333?text=Classic' },
    { id: '3', name: 'Modern', slug: 'modern', description: 'Estilo OS 2.0 - Gradientes e cards arredondados', preview: 'https://placehold.co/400x300/d5d5d5/333?text=Modern' },
    { id: '4', name: 'Bold', slug: 'bold', description: 'Estilo Impact - Dark mode com tipografia forte', preview: 'https://placehold.co/400x300/1a1a2e/fff?text=Bold' },
    { id: '5', name: 'Minimal', slug: 'minimal', description: 'Estilo Apple Store - Extremamente simples', preview: 'https://placehold.co/400x300/fafafa/333?text=Minimal' },
];

export default function StepThemeSelection({ data, updateData }) {
    const [themes, setThemes] = useState(THEMES_FALLBACK);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${API_URL}/api/themes`);
                const result = await response.json();

                if (result.success && result.data?.length > 0) {
                    setThemes(result.data);
                }
            } catch (error) {
                console.error('Error fetching themes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchThemes();
    }, []);

    const selectTheme = (theme) => {
        updateData({
            selectedThemeId: theme.id,
            selectedThemeSlug: theme.slug,
        });
    };

    return (
        <div className={styles.step}>
            <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Escolha o Tema</h2>
                <p className={styles.stepDescription}>
                    Selecione o layout visual da sua loja. Você poderá personalizar
                    cores e elementos depois.
                </p>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Carregando temas...</p>
                </div>
            ) : (
                <div className={styles.themesGrid}>
                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            className={`${styles.themeCard} ${data.selectedThemeSlug === theme.slug ? styles.selected : ''}`}
                            onClick={() => selectTheme(theme)}
                        >
                            <div className={styles.themePreview}>
                                <img
                                    src={theme.preview || `https://placehold.co/400x300/f5f5f5/333?text=${theme.name}`}
                                    alt={theme.name}
                                />
                                {data.selectedThemeSlug === theme.slug && (
                                    <div className={styles.selectedBadge}>✓ Selecionado</div>
                                )}
                            </div>
                            <div className={styles.themeInfo}>
                                <h3 className={styles.themeName}>{theme.name}</h3>
                                <p className={styles.themeDesc}>{theme.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.tipBox}>
                <span className={styles.tipIcon}>💡</span>
                <div>
                    <strong>Dica:</strong> Você pode trocar de tema a qualquer momento nas configurações da loja.
                </div>
            </div>
        </div>
    );
}
