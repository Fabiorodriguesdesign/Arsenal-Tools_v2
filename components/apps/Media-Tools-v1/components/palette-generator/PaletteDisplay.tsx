

import React, { useCallback } from 'react';
import ColorCard from './ColorCard';
import { ImageIcon, FileCodeIcon, AdobeIcon, ClipboardIcon } from '../icons';
import { hexToRgb } from '../../services/colorService';
import { useToast } from '../../contexts/ToastContext';

interface PaletteDisplayProps {
    palette: string[];
    isLoading: boolean;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    onColorChange: (index: number, newColor: string) => void;
}

const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette, isLoading, t, onColorChange }) => {
    const { addToast } = useToast();

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadJpg = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx || palette.length === 0) return;
    
        const swatchHeight = 100;
        const textHeight = 30;
        const totalHeight = (swatchHeight + textHeight) * palette.length;
        const width = 300;
    
        canvas.width = width;
        canvas.height = totalHeight;
    
        ctx.fillStyle = '#18181b'; // zinc-900
        ctx.fillRect(0, 0, width, totalHeight);
        
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        
        palette.forEach((hex, index) => {
            const y = index * (swatchHeight + textHeight);
            ctx.fillStyle = hex;
            ctx.fillRect(0, y, width, swatchHeight);
    
            ctx.fillStyle = '#ffffff';
            ctx.fillText(hex, width / 2, y + swatchHeight + 20);
        });
    
        canvas.toBlob(blob => {
            if (blob) downloadBlob(blob, 'palette.jpg');
        }, 'image/jpeg', 0.95);
    };

    const handleDownloadCss = () => {
        const cssContent = `:root {\n${palette.map((hex, i) => `  --color-palette-${i + 1}: ${hex};`).join('\n')}\n}`;
        const blob = new Blob([cssContent], { type: 'text/css' });
        downloadBlob(blob, 'palette.css');
    };
    
    const handleDownloadAse = () => {
        const numColors = palette.length;
        const buffer = new ArrayBuffer(12 + 4 + (numColors * 100)); // Rough estimate
        const view = new DataView(buffer);
        let offset = 0;

        // Header
        view.setUint8(offset++, 'A'.charCodeAt(0));
        view.setUint8(offset++, 'S'.charCodeAt(0));
        view.setUint8(offset++, 'E'.charCodeAt(0));
        view.setUint8(offset++, 'F'.charCodeAt(0));
        view.setUint16(offset, 1); offset += 2; // Version major
        view.setUint16(offset, 0); offset += 2; // Version minor
        view.setUint32(offset, numColors); offset += 4; // Number of blocks

        palette.forEach((hex, index) => {
            const rgb = hexToRgb(hex);
            if (!rgb) return;

            const colorName = `Color ${index + 1} ${hex}`;
            
            // Start of color block
            view.setUint16(offset, 0xc001); offset += 2; 

            // Calculate block length: name length(2) + name (utf16) + terminator(2) + model(4) + values(12) + type(2)
            const nameLengthInBytes = (colorName.length + 1) * 2; // +1 for null terminator
            const blockLength = nameLengthInBytes + 4 + 12 + 2;
            view.setUint32(offset, blockLength); offset += 4;
            
            // Name
            view.setUint16(offset, colorName.length + 1); offset += 2;
            for (let i = 0; i < colorName.length; i++) {
                view.setUint16(offset, colorName.charCodeAt(i)); offset += 2;
            }
            view.setUint16(offset, 0); offset += 2; // Null terminator
            
            // Color Model 'RGB '
            view.setUint8(offset++, 'R'.charCodeAt(0));
            view.setUint8(offset++, 'G'.charCodeAt(0));
            view.setUint8(offset++, 'B'.charCodeAt(0));
            view.setUint8(offset++, ' '.charCodeAt(0));

            // Color values (as floats 0-1)
            view.setFloat32(offset, rgb.r / 255); offset += 4;
            view.setFloat32(offset, rgb.g / 255); offset += 4;
            view.setFloat32(offset, rgb.b / 255); offset += 4;
            
            // Color type: 0 = Global
            view.setUint16(offset, 0); offset += 2;
        });

        const blob = new Blob([new Uint8Array(buffer, 0, offset)], { type: 'application/octet-stream' });
        downloadBlob(blob, 'palette.ase');
    };

    const handleCopyAll = useCallback(() => {
        const textToCopy = palette.join(', ');
        navigator.clipboard.writeText(textToCopy).then(() => {
            addToast(t('allColorsCopied'), 'success');
        }, (err) => {
            console.error('Could not copy text: ', err);
            addToast('Failed to copy', 'error');
        });
    }, [palette, addToast, t]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center gap-2 text-zinc-400">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#ff0e00]"></div>
                {t('extractingColors')}
            </div>
        );
    }

    if (palette.length === 0) {
        return <p className="text-zinc-500 text-center">{t('noPaletteGenerated')}</p>;
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {palette.map((hex, index) => (
                    <ColorCard 
                        key={`${hex}-${index}`} 
                        hex={hex} 
                        onColorChange={(newColor) => onColorChange(index, newColor)} 
                    />
                ))}
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-800">
                <h4 className="text-md font-semibold text-zinc-200 mb-3">{t('downloadPalette')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <button onClick={handleDownloadJpg} className="flex items-center justify-center gap-2 bg-zinc-800 text-zinc-200 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors">
                        <ImageIcon className="w-5 h-5"/> JPG
                    </button>
                    <button onClick={handleDownloadCss} className="flex items-center justify-center gap-2 bg-zinc-800 text-zinc-200 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors">
                        <FileCodeIcon className="w-5 h-5"/> CSS
                    </button>
                    <button onClick={handleDownloadAse} className="flex items-center justify-center gap-2 bg-zinc-800 text-zinc-200 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors">
                        <AdobeIcon className="w-5 h-5"/> ASE
                    </button>
                    <button onClick={handleCopyAll} className="flex items-center justify-center gap-2 bg-zinc-800 text-zinc-200 font-semibold py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors">
                        <ClipboardIcon className="w-5 h-5"/> {t('copyAsPrompt')}
                    </button>
                </div>
            </div>
        </>
    );
};

export default PaletteDisplay;