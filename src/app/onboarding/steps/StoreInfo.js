'use client';

import styles from './steps.module.css';

export default function StepStoreInfo({ data, updateData }) {
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        updateData({
            storeName: name,
            storeSlug: generateSlug(name),
        });
    };

    return (
        <div className={styles.step}>
            <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Dados da Loja</h2>
                <p className={styles.stepDescription}>
                    Informe os dados básicos da sua loja. Essas informações aparecerão no cabeçalho,
                    rodapé e nas páginas da sua loja.
                </p>
            </div>

            <div className={styles.form}>
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Nome da Loja *
                        <input
                            type="text"
                            className={styles.input}
                            value={data.storeName}
                            onChange={handleNameChange}
                            placeholder="Ex: Minha Loja Fashion"
                        />
                    </label>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        URL da Loja
                        <div className={styles.inputWithPrefix}>
                            <span className={styles.prefix}>sualoja.com/</span>
                            <input
                                type="text"
                                className={styles.input}
                                value={data.storeSlug}
                                onChange={(e) => updateData({ storeSlug: e.target.value })}
                                placeholder="minha-loja"
                            />
                        </div>
                    </label>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Descrição da Loja
                        <textarea
                            className={styles.textarea}
                            value={data.storeDescription}
                            onChange={(e) => updateData({ storeDescription: e.target.value })}
                            placeholder="Descreva brevemente sua loja e o que você vende..."
                            rows={3}
                        />
                    </label>
                    <span className={styles.hint}>Essa descrição aparece nos resultados de busca</span>
                </div>

                <div className={styles.fieldRow}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            E-mail de Contato
                            <input
                                type="email"
                                className={styles.input}
                                value={data.storeEmail}
                                onChange={(e) => updateData({ storeEmail: e.target.value })}
                                placeholder="contato@minhaloja.com"
                            />
                        </label>
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            Telefone / WhatsApp
                            <input
                                type="tel"
                                className={styles.input}
                                value={data.storePhone}
                                onChange={(e) => updateData({ storePhone: e.target.value })}
                                placeholder="(11) 99999-9999"
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
