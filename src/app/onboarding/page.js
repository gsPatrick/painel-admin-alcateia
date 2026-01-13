'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

// Steps
import StepStoreInfo from './steps/StoreInfo';
import StepBranding from './steps/Branding';
import StepSocialMedia from './steps/SocialMedia';
import StepAboutPage from './steps/AboutPage';
import StepThemeSelection from './steps/ThemeSelection';

const STEPS = [
    { id: 1, title: 'Dados da Loja', description: 'Nome e descrição' },
    { id: 2, title: 'Identidade Visual', description: 'Logo e cores' },
    { id: 3, title: 'Redes Sociais', description: 'Links e contato' },
    { id: 4, title: 'Página Sobre', description: 'Textos e fotos' },
    { id: 5, title: 'Escolher Tema', description: 'Layout da loja' },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1 - Store Info
        storeName: '',
        storeSlug: '',
        storeDescription: '',
        storeEmail: '',
        storePhone: '',

        // Step 2 - Branding
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#000000',
        secondaryColor: '#666666',
        accentColor: '#0066CC',
        backgroundColor: '#FFFFFF',
        textColor: '#1A1A1A',

        // Step 3 - Social Media
        instagram: '',
        facebook: '',
        whatsapp: '',
        tiktok: '',
        youtube: '',

        // Step 4 - About Page
        aboutTitle: 'Sobre Nós',
        aboutHeroImage: '',
        aboutSections: [
            { title: 'Nossa História', content: '', image: '' },
            { title: 'Nossa Missão', content: '', image: '' },
        ],
        teamMembers: [],

        // Step 5 - Theme
        selectedThemeId: null,
        selectedThemeSlug: 'clean',
    });

    const updateFormData = (updates) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            // Save store customizations
            const response = await fetch(`${API_URL}/api/themes/me/setup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    themeId: formData.selectedThemeId,
                    customizations: {
                        storeName: formData.storeName,
                        storeSlug: formData.storeSlug,
                        storeDescription: formData.storeDescription,
                        storeEmail: formData.storeEmail,
                        storePhone: formData.storePhone,
                        logo: { url: formData.logoUrl },
                        favicon: { url: formData.faviconUrl },
                        colors: {
                            primary: formData.primaryColor,
                            secondary: formData.secondaryColor,
                            accent: formData.accentColor,
                            background: formData.backgroundColor,
                            text: formData.textColor,
                        },
                        footer: {
                            instagram: formData.instagram,
                            facebook: formData.facebook,
                            whatsapp: formData.whatsapp,
                            tiktok: formData.tiktok,
                            youtube: formData.youtube,
                        },
                        about: {
                            title: formData.aboutTitle,
                            heroImage: formData.aboutHeroImage,
                            sections: formData.aboutSections,
                            team: formData.teamMembers,
                        },
                    },
                }),
            });

            const data = await response.json();

            if (data.success) {
                router.push('/dashboard');
            } else {
                alert(data.message || 'Erro ao salvar configurações');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao salvar configurações');
        } finally {
            setSaving(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepStoreInfo data={formData} updateData={updateFormData} />;
            case 2:
                return <StepBranding data={formData} updateData={updateFormData} />;
            case 3:
                return <StepSocialMedia data={formData} updateData={updateFormData} />;
            case 4:
                return <StepAboutPage data={formData} updateData={updateFormData} />;
            case 5:
                return <StepThemeSelection data={formData} updateData={updateFormData} />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.headerTitle}>Configure sua Loja</h1>
                    <p className={styles.headerSubtitle}>Preencha as informações para personalizar seu e-commerce</p>
                </div>
            </header>

            {/* Progress */}
            <div className={styles.progress}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                    />
                </div>
                <div className={styles.steps}>
                    {STEPS.map((step) => (
                        <div
                            key={step.id}
                            className={`${styles.stepItem} ${currentStep >= step.id ? styles.active : ''} ${currentStep === step.id ? styles.current : ''}`}
                        >
                            <div className={styles.stepNumber}>{step.id}</div>
                            <div className={styles.stepInfo}>
                                <span className={styles.stepTitle}>{step.title}</span>
                                <span className={styles.stepDesc}>{step.description}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className={styles.main}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className={styles.stepContent}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    {currentStep > 1 && (
                        <button
                            className={styles.backBtn}
                            onClick={prevStep}
                        >
                            Voltar
                        </button>
                    )}
                    <div className={styles.footerRight}>
                        <span className={styles.stepCounter}>
                            Passo {currentStep} de {STEPS.length}
                        </span>
                        {currentStep < STEPS.length ? (
                            <button
                                className={styles.nextBtn}
                                onClick={nextStep}
                            >
                                Continuar
                            </button>
                        ) : (
                            <button
                                className={styles.completeBtn}
                                onClick={handleComplete}
                                disabled={saving}
                            >
                                {saving ? 'Salvando...' : 'Finalizar Configuração'}
                            </button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
