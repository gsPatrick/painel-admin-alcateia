'use client';

import styles from './steps.module.css';

export default function StepSocialMedia({ data, updateData }) {
    const socialLinks = [
        { key: 'instagram', label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/sualoja' },
        { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/sualoja' },
        { key: 'whatsapp', label: 'WhatsApp', icon: '💬', placeholder: '5511999999999' },
        { key: 'tiktok', label: 'TikTok', icon: '🎵', placeholder: 'https://tiktok.com/@sualoja' },
        { key: 'youtube', label: 'YouTube', icon: '▶️', placeholder: 'https://youtube.com/@sualoja' },
    ];

    return (
        <div className={styles.step}>
            <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Redes Sociais</h2>
                <p className={styles.stepDescription}>
                    Conecte suas redes sociais à loja. Esses links aparecerão no rodapé
                    e na página de contato.
                </p>
            </div>

            <div className={styles.form}>
                {socialLinks.map((social) => (
                    <div key={social.key} className={styles.socialField}>
                        <span className={styles.socialIcon}>{social.icon}</span>
                        <div className={styles.socialInput}>
                            <label className={styles.socialLabel}>{social.label}</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={data[social.key] || ''}
                                onChange={(e) => updateData({ [social.key]: e.target.value })}
                                placeholder={social.placeholder}
                            />
                        </div>
                    </div>
                ))}

                <div className={styles.tipBox}>
                    <span className={styles.tipIcon}>💡</span>
                    <div>
                        <strong>Dica:</strong> Para o WhatsApp, use apenas números com código do país (ex: 5511999999999)
                    </div>
                </div>
            </div>
        </div>
    );
}
