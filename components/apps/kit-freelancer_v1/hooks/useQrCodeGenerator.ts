

import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { useFormPersistence } from './useFormPersistence';
import { QrCodeFormData } from '../types/qrCode';
import { useToast } from '../../../../contexts/ToastContext';
import { useDebounce } from '../../../../hooks/useDebounce';

const INITIAL_STATE: QrCodeFormData = {
    text: 'https://kitfreelancer.com',
    darkColor: '#000000',
    lightColor: '#FFFFFF'
};

export const useQrCodeGenerator = () => {
    const [formData, setFormData] = useFormPersistence<QrCodeFormData>('qrCodeGeneratorData', INITIAL_STATE);
    const [isGenerating, setIsGenerating] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { addToast } = useToast();

    // Debounce inputs to prevent excessive re-rendering on typing
    const debouncedText = useDebounce(formData.text, 500);
    const debouncedDarkColor = useDebounce(formData.darkColor, 200);
    const debouncedLightColor = useDebounce(formData.lightColor, 200);

    const setText = useCallback((val: string) => setFormData(prev => ({ ...prev, text: val })), [setFormData]);
    const setDarkColor = useCallback((val: string) => setFormData(prev => ({ ...prev, darkColor: val })), [setFormData]);
    const setLightColor = useCallback((val: string) => setFormData(prev => ({ ...prev, lightColor: val })), [setFormData]);

    // Effect to draw QR Code on canvas whenever data changes (debounced)
    useEffect(() => {
        if (canvasRef.current && debouncedText) {
            const qrOptions = {
                width: 256,
                margin: 2,
                color: {
                    dark: debouncedDarkColor,
                    light: debouncedLightColor,
                },
            };
            QRCode.toCanvas(canvasRef.current, debouncedText, qrOptions, (error) => {
                if (error) console.error(error);
            });
        } else if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, [debouncedText, debouncedDarkColor, debouncedLightColor]);

    const generateHighResQrCodeDataUrl = async (): Promise<string> => {
        try {
            const dataUrl = await QRCode.toDataURL(formData.text, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                width: 1000,
                margin: 2,
                color: {
                    dark: formData.darkColor,
                    light: formData.lightColor,
                },
            });
            return dataUrl;
        } catch (err) {
            console.error(err);
            return '';
        }
    };

    const handleDownloadPng = async () => {
        if (!formData.text) return;
        setIsGenerating(true);
        const dataUrl = await generateHighResQrCodeDataUrl();
        if (dataUrl) {
            const link = document.createElement('a');
            link.download = 'qrcode-1000x1000.png';
            link.href = dataUrl;
            link.click();
        }
        setIsGenerating(false);
    };

    const handleDownloadPdf = async () => {
        if (!formData.text) return;
        setIsGenerating(true);
        try {
            const { default: jsPDF } = await import('jspdf');
            const dataUrl = await generateHighResQrCodeDataUrl();
            if (dataUrl) {
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                });
                const pageWidth = pdf.internal.pageSize.getWidth();
                const imageWidth = 100;
                const x = (pageWidth - imageWidth) / 2;
                const y = 40;
                pdf.addImage(dataUrl, 'PNG', x, y, imageWidth, imageWidth);
                pdf.save('qrcode.pdf');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        if (!formData.text) return;
        setIsGenerating(true);
        try {
             if (!navigator.share || !navigator.canShare) {
                addToast("Seu navegador não suporta compartilhamento.", "error");
                return;
            }

            const dataUrl = await generateHighResQrCodeDataUrl();
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], "qrcode.png", { type: "image/png" });

            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'QR Code',
                    text: formData.text,
                });
                addToast("Compartilhado com sucesso!", "success");
            } else {
                 addToast("Compartilhamento de imagem não suportado neste navegador.", "error");
            }

        } catch (error) {
            console.error("Erro ao compartilhar:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        formData,
        setText,
        setDarkColor,
        setLightColor,
        isGenerating,
        canvasRef,
        handleDownloadPng,
        handleDownloadPdf,
        handleShare
    };
};
