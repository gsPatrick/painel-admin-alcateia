'use client';

import styles from './steps.module.css';

export default function StepBranding({ data, updateData }) {
    const colorPresets = [
        { name: 'Clássico', primary: '#000000', secondary: '#666666', accent: '#0066CC' },
        { name: 'Natureza', primary: '#2D5A27', secondary: '#5D8A54', accent: '#8BC34A' },
        { name: 'Elegante', primary: '#1A1A2E', secondary: '#4A4E69', accent: '#D4AF37' },
        { name: 'Moderno', primary: '#6366F1', secondary: '#8B5CF6', accent: '#EC4899' },
        { name: 'Minimalista', primary: '#18181B', secondary: '#71717A', accent: '#18181B' },
    ];

    const applyPreset = (preset) => {
        updateData({
            primaryColor: preset.primary,
            secondaryColor: preset.secondary,
            accentColor: preset.accent,
        });
    };

    return (
        <div className={styles.step}>
            <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Identidade Visual</h2>
                <p className={styles.stepDescription}>
                    Defina a identidade visual da sua loja. Faça upload do logo e escolha as cores
                    que representam sua marca.
                </p>
            </div>

            <div className={styles.form}>
                {/* Logo */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Logo da Loja</label>
                    <div className={styles.uploadArea}>
                        {data.logoUrl ? (
                            <div className={styles.uploadedPreview}>
                                <img src={data.logoUrl} alt="Logo" />
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => updateData({ logoUrl: '' })}
                                >
                                    Remover
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className={styles.uploadIcon}>📷</span>
                                <p>Arraste uma imagem ou cole a URL abaixo</p>
                            </>
                        )}
                    </div>
                    <input
                        type="text"
                        className={styles.input}
                        value={data.logoUrl}
                        onChange={(e) => updateData({ logoUrl: e.target.value })}
                        placeholder="https://exemplo.com/logo.png"
                    />
                    <span className={styles.hint}>Recomendado: PNG transparente, 200x60px</span>
                </div>

                {/* Favicon */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Favicon</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={data.faviconUrl}
                        onChange={(e) => updateData({ faviconUrl: e.target.value })}
                        placeholder="https://exemplo.com/favicon.ico"
                    />
                    <span className={styles.hint}>Ícone que aparece na aba do navegador</span>
                </div>

                {/* Color Presets */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Paleta de Cores</label>
                    <div className={styles.presets}>
                        {colorPresets.map((preset) => (
                            <button
                                key={preset.name}
                                className={styles.presetBtn}
                                onClick={() => applyPreset(preset)}
                            >
                                <div className={styles.presetColors}>
                                    <span style={{ background: preset.primary }}></span>
                                    <span style={{ background: preset.secondary }}></span>
                                    <span style={{ background: preset.accent }}></span>
                                </div>
                                <span>{preset.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Colors */}
                <div className={styles.colorGrid}>
                    <div className={styles.colorField}>
                        <label>Cor Primária</label>
                        <div className={styles.colorInput}>
                            <input
                                type="color"
                                value={data.primaryColor}
                                onChange={(e) => updateData({ primaryColor: e.target.value })}
                            />
                            <input
                                type="text"
                                value={data.primaryColor}
                                onChange={(e) => updateData({ primaryColor: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className={styles.colorField}>
                        <label>Cor Secundária</label>
                        <div className={styles.colorInput}>
                            <input
                                type="color"
                                value={data.secondaryColor}
                                onChange={(e) => updateData({ secondaryColor: e.target.value })}
                            />
                            <input
                                type="text"
                                value={data.secondaryColor}
                                onChange={(e) => updateData({ secondaryColor: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className={styles.colorField}>
                        <label>Cor de Destaque</label>
                        <div className={styles.colorInput}>
                            <input
                                type="color"
                                value={data.accentColor}
                                onChange={(e) => updateData({ accentColor: e.target.value })}
                            />
                            <input
                                type="text"
                                value={data.accentColor}
                                onChange={(e) => updateData({ accentColor: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className={styles.colorPreview}>
                    <span style={{ background: data.primaryColor }}></span>
                    <span style={{ background: data.secondaryColor }}></span>
                    <span style={{ background: data.accentColor }}></span>
                </div>
            </div>
        </div>
    );
}
