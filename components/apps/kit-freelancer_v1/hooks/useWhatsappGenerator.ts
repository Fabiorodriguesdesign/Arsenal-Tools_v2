

import { useState, useMemo, useCallback } from 'react';
import { useFormPersistence } from './useFormPersistence';
import { WhatsappFormData } from '../types/whatsapp';
import { useToast } from '../../../../contexts/ToastContext';
import { useTranslation } from './useTranslation';

const INITIAL_STATE: WhatsappFormData = {
    phone: '',
    message: ''
};

export const useWhatsappGenerator = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    
    const [formData, setFormData] = useFormPersistence<WhatsappFormData>('whatsappGeneratorData', INITIAL_STATE);
    const [isTouched, setIsTouched] = useState(false);

    const cleanPhone = useMemo(() => formData.phone.replace(/\D/g, ''), [formData.phone]);
    const isValidPhone = cleanPhone.length >= 10;

    const generatedLink = useMemo(() => {
        if (!isValidPhone) return '';
        const encodedMessage = encodeURIComponent(formData.message);
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    }, [cleanPhone, isValidPhone, formData.message]);

    const setPhone = useCallback((val: string) => {
        setFormData(prev => ({ ...prev, phone: val }));
        if (!isTouched) setIsTouched(true);
    }, [setFormData, isTouched]);

    const setMessage = useCallback((val: string) => {
        setFormData(prev => ({ ...prev, message: val }));
    }, [setFormData]);

    const handleCopy = useCallback(() => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            addToast(t('whatsapp.copiedSuccess'), 'success');
        }
    }, [generatedLink, addToast, t]);

    return {
        formData,
        isTouched,
        isValidPhone,
        generatedLink,
        setPhone,
        setMessage,
        setIsTouched,
        handleCopy
    };
};
