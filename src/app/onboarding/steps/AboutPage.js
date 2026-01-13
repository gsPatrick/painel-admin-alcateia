'use client';

import { useState } from 'react';
import styles from './steps.module.css';

export default function StepAboutPage({ data, updateData }) {
    const addSection = () => {
        updateData({
            aboutSections: [
                ...data.aboutSections,
                { title: '', content: '', image: '' }
            ]
        });
    };

    const updateSection = (index, field, value) => {
        const newSections = [...data.aboutSections];
        newSections[index] = { ...newSections[index], [field]: value };
        updateData({ aboutSections: newSections });
    };

    const removeSection = (index) => {
        updateData({
            aboutSections: data.aboutSections.filter((_, i) => i !== index)
        });
    };

    const addTeamMember = () => {
        updateData({
            teamMembers: [
                ...data.teamMembers,
                { name: '', role: '', image: '' }
            ]
        });
    };

    const updateTeamMember = (index, field, value) => {
        const newMembers = [...data.teamMembers];
        newMembers[index] = { ...newMembers[index], [field]: value };
        updateData({ teamMembers: newMembers });
    };

    const removeTeamMember = (index) => {
        updateData({
            teamMembers: data.teamMembers.filter((_, i) => i !== index)
        });
    };

    return (
        <div className={styles.step}>
            <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>Página Sobre</h2>
                <p className={styles.stepDescription}>
                    Configure o conteúdo da página institucional da sua loja.
                    Conte sua história e apresente sua equipe.
                </p>
            </div>

            <div className={styles.form}>
                {/* Hero */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Título Principal
                        <input
                            type="text"
                            className={styles.input}
                            value={data.aboutTitle}
                            onChange={(e) => updateData({ aboutTitle: e.target.value })}
                            placeholder="Sobre Nós"
                        />
                    </label>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Imagem de Capa (URL)
                        <input
                            type="text"
                            className={styles.input}
                            value={data.aboutHeroImage}
                            onChange={(e) => updateData({ aboutHeroImage: e.target.value })}
                            placeholder="https://exemplo.com/imagem-capa.jpg"
                        />
                    </label>
                </div>

                {/* Sections */}
                <div className={styles.sectionDivider}>
                    <h3>Seções</h3>
                    <button className={styles.addBtn} onClick={addSection}>+ Adicionar Seção</button>
                </div>

                {data.aboutSections.map((section, index) => (
                    <div key={index} className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <span>Seção {index + 1}</span>
                            <button
                                className={styles.removeBtn}
                                onClick={() => removeSection(index)}
                            >
                                Remover
                            </button>
                        </div>
                        <div className={styles.fieldGroup}>
                            <input
                                type="text"
                                className={styles.input}
                                value={section.title}
                                onChange={(e) => updateSection(index, 'title', e.target.value)}
                                placeholder="Título da seção (ex: Nossa História)"
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <textarea
                                className={styles.textarea}
                                value={section.content}
                                onChange={(e) => updateSection(index, 'content', e.target.value)}
                                placeholder="Conteúdo da seção..."
                                rows={4}
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <input
                                type="text"
                                className={styles.input}
                                value={section.image}
                                onChange={(e) => updateSection(index, 'image', e.target.value)}
                                placeholder="URL da imagem (opcional)"
                            />
                        </div>
                    </div>
                ))}

                {/* Team */}
                <div className={styles.sectionDivider}>
                    <h3>Equipe (Opcional)</h3>
                    <button className={styles.addBtn} onClick={addTeamMember}>+ Adicionar Membro</button>
                </div>

                <div className={styles.teamGrid}>
                    {data.teamMembers.map((member, index) => (
                        <div key={index} className={styles.teamCard}>
                            <button
                                className={styles.teamRemove}
                                onClick={() => removeTeamMember(index)}
                            >
                                ✕
                            </button>
                            <input
                                type="text"
                                className={styles.input}
                                value={member.image}
                                onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                                placeholder="URL da foto"
                            />
                            <input
                                type="text"
                                className={styles.input}
                                value={member.name}
                                onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                placeholder="Nome"
                            />
                            <input
                                type="text"
                                className={styles.input}
                                value={member.role}
                                onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                                placeholder="Cargo"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
