

import React from 'react';
// FIX: Update imports to use centralized UI components
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
// FIX: Use the generic Icon component from the root to resolve import issues.
import { Icon } from '@/components/icons';
import { isValidHex } from '../../utils/colorConverter';
import { useColorConverter } from '../../hooks/useColorConverter';

const ColorConverter: React.FC = () => {
    const { t } = useTranslation();
    const {
        formData,
        setFormData,
        imageUrl,
        setImageUrl,
        isExtracting,
        step,
        setStep,
        canvasRef,
        processImage,
        addColor,
        removeColor,
        updateColor,
        handleExport
    } = useColorConverter();

    const { paletteName, colors, newColor } = formData;

    const handleUrlSubmit = () => {
        if (imageUrl) processImage(imageUrl);
    };

    const StepIndicator = () => (
        <div className="flex justify-center items-center mb-6 max-w-2xl mx-auto">
            <div className="flex items-center text-primary">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold bg-primary text-white">1</div>
                <p className="ml-2 font-semibold hidden sm:block">{t('color.step1.nav')}</p>
            </div>
            <div className={`flex-auto border-t-2 transition-colors duration-500 mx-4 ${step >= 2 ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>2</div>
                <p className="ml-2 font-semibold hidden sm:block">{t('color.step2.nav')}</p>
            </div>
            <div className={`flex-auto border-t-2 transition-colors duration-500 mx-4 ${step >= 3 ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>3</div>
                <p className="ml-2 font-semibold hidden sm:block">{t('color.step3.nav')}</p>
            </div>
        </div>
    );
    
    const ControlsStep = (
        <Card title="color.step1.title" className="animate-fadeIn">
            <div className="space-y-6">
                <Input label="color.paletteName.label" value={paletteName} onChange={e => setFormData(prev => ({ ...prev, paletteName: e.target.value }))} />
                
                {/* Image Extraction */}
                <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                        {t('color.extractFromImage.title')}
                    </label>
                    <p className="text-xs text-light-muted dark:text-dark-muted mb-3">
                        {t('color.extractFromImage.orPaste')}
                    </p>
                    <div className="flex gap-2">
                        <Input 
                            placeholder={t('color.extractFromImage.urlPlaceholder')}
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                        />
                        <Button onClick={handleUrlSubmit} disabled={isExtracting || !imageUrl} isLoading={isExtracting}>
                            {isExtracting ? t('color.extractFromImage.extracting') : t('color.extractFromImage.button')}
                        </Button>
                    </div>
                    <p className="text-[10px] text-light-muted dark:text-dark-muted mt-2">
                        {t('color.extractFromImage.helper')}
                    </p>
                </div>

                {/* Manual Add */}
                <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('color.addColor.label')}</label>
                    <div className="flex gap-2">
                        <div className="relative w-12 h-10">
                            <input 
                                type="color" 
                                value={isValidHex(newColor) ? newColor : '#000000'}
                                onChange={e => setFormData(prev => ({ ...prev, newColor: e.target.value }))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div 
                                className="w-full h-full rounded-md border border-gray-300 dark:border-gray-600" 
                                style={{ backgroundColor: isValidHex(newColor) ? newColor : '#CCCCCC' }}
                            />
                        </div>
                        <Input 
                            value={newColor} 
                            onChange={e => setFormData(prev => ({ ...prev, newColor: e.target.value }))} 
                            className="w-full"
                            placeholder="#000000"
                        />
                    </div>
                    <Button onClick={addColor} disabled={colors.length >= 10 || !isValidHex(newColor)} className="w-full mt-2" variant="secondary">
                        {t('color.addColor.button')}
                    </Button>
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <Button onClick={() => setStep(2)}>{t('common.next')}</Button>
            </div>
        </Card>
    );

    const PaletteStep = (
        <Card title="color.step2.title" className="animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-center">{paletteName}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {colors.map((color, index) => (
                    <div key={index} className="space-y-2 group relative animate-fadeIn">
                        {/* Color Swatch / Picker */}
                        <div className="relative h-24 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gray-100 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary dark:focus-within:ring-offset-dark-card">
                            <input 
                                type="color" 
                                id={`color-picker-${index}`}
                                value={isValidHex(color) ? color : '#000000'}
                                onChange={(e) => updateColor(index, e.target.value)}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                                aria-label={`Edit color ${color}`}
                            />
                            <div 
                                className="w-full h-full transition-colors duration-200" 
                                style={{ backgroundColor: isValidHex(color) ? color : 'transparent' }}
                            >
                                {!isValidHex(color) && (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                        ?
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => removeColor(index)} 
                                className="absolute top-1 right-1 z-20 bg-white/20 hover:bg-red-500 hover:text-white text-black/50 backdrop-blur-sm rounded-full p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white shadow-sm"
                                aria-label={t('color.remove.ariaLabel', { color })}
                            >
                                <Icon name="x" className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Editable Hex Input */}
                        <div className="relative">
                            <input 
                                type="text" 
                                value={color}
                                onChange={e => updateColor(index, e.target.value)}
                                onFocus={(e) => e.target.select()}
                                maxLength={9}
                                className={`w-full text-center text-sm p-1.5 border rounded-md bg-light-input dark:bg-dark-input outline-none transition uppercase font-mono tracking-wide ${
                                    !isValidHex(color)
                                        ? 'border-danger text-danger focus:ring-1 focus:ring-danger'
                                        : 'border-light-border dark:border-dark-border focus:ring-1 focus:ring-primary focus:border-transparent text-light-text dark:text-dark-text'
                                }`}
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            {colors.length === 0 && (
                <div className="text-center py-8 text-light-muted dark:text-dark-muted bg-light-bg dark:bg-dark-bg rounded-lg border border-dashed border-light-border dark:border-dark-border">
                    <p>{t('color.emptyPalette')}</p>
                </div>
            )}
            
            <div className="flex justify-between mt-6">
                <Button onClick={() => setStep(1)} variant="secondary">{t('common.previous')}</Button>
                <Button onClick={() => setStep(3)}>{t('common.next')}</Button>
            </div>
        </Card>
    );

    const ExportStep = (
        <Card title="color.step3.title" className="animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                <Button variant="secondary" onClick={() => handleExport('png')} disabled={colors.length === 0}>PNG Image</Button>
                <Button variant="secondary" onClick={() => handleExport('css')} disabled={colors.length === 0}>CSS Variables</Button>
                <Button variant="secondary" onClick={() => handleExport('scss')} disabled={colors.length === 0}>SASS Variables</Button>
                <Button variant="secondary" onClick={() => handleExport('ase')} disabled={colors.length === 0}>{t('color.export.ase')}</Button>
            </div>
            <div className="flex justify-start mt-6">
                <Button onClick={() => setStep(2)} variant="secondary">{t('common.previous')}</Button>
            </div>
        </Card>
    );

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border">{t('color.title')}</h1>
            
            <StepIndicator />

            <div>
                {step === 1 && ControlsStep}
                {step === 2 && PaletteStep}
                {step === 3 && ExportStep}
            </div>

            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default ColorConverter;