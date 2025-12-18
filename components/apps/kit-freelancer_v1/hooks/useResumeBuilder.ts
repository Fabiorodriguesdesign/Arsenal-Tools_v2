import { useState, useCallback } from 'react';
import { useFormPersistence } from './useFormPersistence';
import { ResumeData } from '../types/resume';
import { generateResumePDF } from '../utils/resumePdfGenerator';
import { useTranslation } from './useTranslation';

const INITIAL_STATE: ResumeData = {
    personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', summary: '', website: '', linkedin: '' },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    templateId: 'modern',
    primaryColor: '#1a1a1a',
    lang: 'pt',
};

const TOTAL_STEPS = 6;

export const useResumeBuilder = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resumeData, setResumeData] = useFormPersistence<ResumeData>('resumeBuilderData', INITIAL_STATE);

    const nextStep = useCallback(() => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS)), []);
    const prevStep = useCallback(() => setStep((prev) => Math.max(prev - 1, 1)), []);

    const updateData = useCallback((newData: Partial<ResumeData>) => {
        setResumeData(prev => ({ ...prev, ...newData }));
    }, [setResumeData]);
    
    const handleReset = useCallback(() => {
        if (confirm(t('common.confirmReset'))) {
            setResumeData(INITIAL_STATE);
            setStep(1);
        }
    }, [t, setResumeData]);

    const handleDownload = useCallback(async () => {
        setIsGenerating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            await generateResumePDF(resumeData);
        } catch (error) {
            console.error("Error generating PDF", error);
            alert("Erro ao gerar PDF. Tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    }, [resumeData]);

    return {
        step,
        isGenerating,
        resumeData,
        nextStep,
        prevStep,
        updateData,
        handleReset,
        handleDownload,
    };
};