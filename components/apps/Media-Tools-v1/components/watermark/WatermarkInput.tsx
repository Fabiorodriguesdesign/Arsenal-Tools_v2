
import React from 'react';
import FileUpload from '../FileUpload';
import Checkbox from '../Checkbox';
import { ShieldCheckIcon } from '../icons';
import { WatermarkSettings, WatermarkType } from './types';

const GOOGLE_FONTS = ['Poppins', 'Inter', 'Montserrat', 'Roboto', 'Open Sans'];

type TextSettings = Pick<WatermarkSettings, 'text' | 'fontFamily' | 'fontSize' | 'textColor' | 'isStrokeEnabled' | 'strokeColor' | 'strokeWidth'>;

interface WatermarkInputProps {
    watermarkType: WatermarkType;
    watermarkImageFile: File | null;
    textSettings: TextSettings;
    textError: string | null;
    setSettingsState: (newSettings: Partial<WatermarkSettings>) => void;
    handleWatermarkAdd: (files: File[]) => void;
    handleWatermarkClear: () => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const WatermarkInput: React.FC<WatermarkInputProps> = ({
    watermarkType, watermarkImageFile, textSettings, textError,
    setSettingsState, handleWatermarkAdd, handleWatermarkClear, t
}) => {
    const { text, fontFamily, fontSize, textColor, isStrokeEnabled, strokeColor, strokeWidth } = textSettings;
    return (
         <div>
            <fieldset>
                <legend className="block text-sm font-medium text-zinc-300 mb-2">{t('watermarkType')}</legend>
                <div className="flex space-x-2 bg-zinc-800/50 p-1 rounded-lg shadow-sm w-full mb-4">
                    <label className={`w-full py-2 text-sm font-semibold rounded-md transition-colors text-center cursor-pointer ${watermarkType === 'image' ? 'bg-[#ff0e00] text-white shadow' : 'text-zinc-200 hover:bg-zinc-700/50'}`}>
                        <input 
                            type="radio" 
                            name="watermark-type" 
                            value="image" 
                            checked={watermarkType === 'image'}
                            onChange={() => setSettingsState({ watermarkType: 'image' })}
                            className="sr-only"
                        />
                        {t('image')}
                    </label>
                    <label className={`w-full py-2 text-sm font-semibold rounded-md transition-colors text-center cursor-pointer ${watermarkType === 'text' ? 'bg-[#ff0e00] text-white shadow' : 'text-zinc-200 hover:bg-zinc-700/50'}`}>
                        <input 
                            type="radio" 
                            name="watermark-type" 
                            value="text" 
                            checked={watermarkType === 'text'}
                            onChange={() => setSettingsState({ watermarkType: 'text' })}
                            className="sr-only"
                        />
                        {t('watermarkTypeText')}
                    </label>
                </div>
            </fieldset>
            
            {watermarkType === 'image' ? (
                <FileUpload
                    title={t('selectWatermarkImageUploadTitle')}
                    description={t('transparentPngsOnly')}
                    onFilesAdd={handleWatermarkAdd}
                    onFileRemove={() => {}}
                    onFilesClear={handleWatermarkClear}
                    acceptedFormats="image/png"
                    isMultiple={false}
                    uploadedFile={watermarkImageFile}
                    icon={<ShieldCheckIcon className="w-10 h-10 text-zinc-600" />}
                />
            ) : (
                <div className="space-y-4 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800 animate-fade-in">
                    <div>
                        <label htmlFor="watermark-text" className="block text-sm font-medium text-zinc-300 mb-1">{t('watermarkTextInputLabel')}</label>
                        <input
                            type="text"
                            id="watermark-text"
                            value={text}
                            onChange={e => setSettingsState({ text: e.target.value })}
                            className={`w-full p-2 border rounded-md shadow-sm bg-zinc-950 text-zinc-100 ${textError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-zinc-700 focus:ring-[#ff0e00] focus:border-[#ff0e00]'}`}
                            aria-label={t('enterWatermarkText')}
                            aria-invalid={!!textError}
                            aria-describedby={textError ? "text-error" : undefined}
                        />
                        {textError && (
                            <p id="text-error" className="mt-2 text-sm text-red-500" role="alert">
                                {textError}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="font-family" className="block text-sm font-medium text-zinc-300 mb-1">{t('font')}</label>
                            <select
                                id="font-family"
                                value={fontFamily}
                                onChange={e => setSettingsState({ fontFamily: e.target.value })}
                                className="w-full p-2 border border-zinc-700 rounded-md shadow-sm focus:ring-[#ff0e00] focus:border-[#ff0e00] bg-zinc-950 text-zinc-100"
                                aria-label={t('fontFamilySelector')}
                            >
                                {GOOGLE_FONTS.map(font => <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <label htmlFor="text-color" className="block text-sm font-medium text-zinc-300">{t('color')}</label>
                            <input
                                type="color"
                                id="text-color"
                                value={textColor}
                                onChange={e => setSettingsState({ textColor: e.target.value.toUpperCase() })}
                                className="w-10 h-10 p-0 border-none rounded-md cursor-pointer bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-950"
                                aria-label={t('textColorPicker')}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="fontSize" className="block text-sm font-medium text-zinc-300 mb-1">{t('fontSize', { fontSize: fontSize })}</label>
                        <input type="range" id="fontSize" min="10" max="200" value={fontSize} onChange={e => setSettingsState({ fontSize: Number(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff0e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-900" aria-label={t('fontSizeSlider')} aria-valuenow={fontSize} aria-valuemin={10} aria-valuemax={200} />
                    </div>
                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                        <Checkbox
                            id="enable-stroke"
                            checked={isStrokeEnabled}
                            onChange={(e) => setSettingsState({ isStrokeEnabled: e.target.checked })}
                            label={
                                <div className="text-sm">
                                    <span className="font-medium text-zinc-200">{t('addStroke')}</span>
                                    <p className="text-zinc-400 text-xs">{t('improvesLegibility')}</p>
                                </div>
                            }
                        />

                        {isStrokeEnabled && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                                 <div className="flex items-end gap-2">
                                    <label htmlFor="stroke-color" className="block text-sm font-medium text-zinc-300">{t('strokeColor')}</label>
                                    <input
                                        type="color"
                                        id="stroke-color"
                                        value={strokeColor}
                                        onChange={e => setSettingsState({ strokeColor: e.target.value.toUpperCase() })}
                                        className="w-10 h-10 p-0 border-none rounded-md cursor-pointer bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-950"
                                        aria-label={t('strokeColorPicker')}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="strokeWidth" className="block text-sm font-medium text-zinc-300 mb-1">{t('strokeWidth', { strokeWidth: strokeWidth })}</label>
                                    <input type="range" id="strokeWidth" min="1" max="50" value={strokeWidth} onChange={e => setSettingsState({ strokeWidth: Number(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff0e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-900" aria-label={t('strokeWidthSlider')} aria-valuenow={strokeWidth} aria-valuemin={1} aria-valuemax={50} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
export default WatermarkInput;
