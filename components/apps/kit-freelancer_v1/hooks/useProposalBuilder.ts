
import { useState, useEffect, useCallback } from 'react';
import { useFormPersistence } from './useFormPersistence';
import { ProposalData, ProposalItem } from '../types/proposal';
import { generateProposalPDF } from '../utils/proposalPdfGenerator';
import { useTranslation } from './useTranslation';
import { useToast } from '../../../../contexts/ToastContext';

const INITIAL_STATE: ProposalData = {
    providerName: '',
    providerEmail: '',
    providerPhone: '',
    providerCompany: '',
    providerDocument: '',
    providerAddress: '',
    providerLogo: undefined,
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientDocument: '',
    clientAddress: '',
    projectTitle: '',
    introduction: '',
    items: [],
    currency: 'BRL',
    issueDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    terms: '',
    templateId: 'modern',
    lang: 'pt',
};

const TOTAL_STEPS = 4;

export const useProposalBuilder = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [proposalData, setProposalData] = useFormPersistence<ProposalData>('proposalBuilderData', INITIAL_STATE);

    useEffect(() => {
        const pendingItemRaw = localStorage.getItem('pendingProposalItem');
        if (pendingItemRaw) {
            try {
                const pendingItem = JSON.parse(pendingItemRaw);
                setProposalData(prev => ({
                    ...prev,
                    items: [...prev.items, pendingItem]
                }));
                addToast(t('proposalBuilder.itemImportedSuccess'), 'success');
                localStorage.removeItem('pendingProposalItem');
            } catch (e) {
                console.error("Failed to parse pending proposal item", e);
                localStorage.removeItem('pendingProposalItem');
            }
        }
    }, [addToast, setProposalData, t]);

    const nextStep = useCallback(() => setStep(prev => Math.min(prev + 1, TOTAL_STEPS)), []);
    const prevStep = useCallback(() => setStep(prev => Math.max(prev - 1, 1)), []);

    const handleUpdateData = useCallback((newData: Partial<ProposalData>) => {
        setProposalData(prev => ({ ...prev, ...newData }));
    }, [setProposalData]);

    const handleUpdateItems = useCallback((newItems: ProposalItem[]) => {
        setProposalData(prev => ({ ...prev, items: newItems }));
    }, [setProposalData]);

    const handleReset = useCallback(() => {
        if (confirm(t('common.confirmReset'))) {
            setProposalData(INITIAL_STATE);
            setStep(1);
        }
    }, [t, setProposalData]);

    const handleDownload = useCallback(async () => {
        setIsGenerating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            await generateProposalPDF(proposalData);
        } catch (error) {
            console.error(error);
            // In a real app, you might show a toast notification for the error
        } finally {
            setIsGenerating(false);
        }
    }, [proposalData]);

    return {
        step,
        isGenerating,
        proposalData,
        steps: TOTAL_STEPS,
        nextStep,
        prevStep,
        handleUpdateData,
        handleUpdateItems,
        handleReset,
        handleDownload
    };
};
