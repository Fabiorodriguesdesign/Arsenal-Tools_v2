
import React from 'react';
import PositionSelector from './PositionSelector';
import Checkbox from '../Checkbox';
import { WatermarkSettings } from './types';

interface WatermarkSettingsPanelProps {
    settings: WatermarkSettings;
    setSettingsState: (newSettings: Partial<WatermarkSettings>) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}


const WatermarkSettingsPanel: React.FC<WatermarkSettingsPanelProps> = ({ settings, setSettingsState, t }) => {
    const { position, scale, opacity, margin, isRepeating, spacing, rotation, watermarkType } = settings;

    return (
        <>
            <div className="mb-4">
                 <Checkbox
                    id="repeat-watermark"
                    checked={isRepeating}
                    onChange={(e) => setSettingsState({ isRepeating: e.target.checked })}
                    label={
                        <div className="text-sm">
                            <span className="font-medium text-zinc-200">{t('repeatWatermark')}</span>
                            <p className="text-zinc-400 text-xs">{t('coversImageWithRepeatedWatermark')}</p>
                        </div>
                    }
                />
            </div>

            <div className={`grid ${!isRepeating ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                {!isRepeating ? (
                    <>
                        <div className="animate-fade-in">
                            <PositionSelector position={position} setPosition={(pos) => setSettingsState({ position: pos })} t={t} />
                        </div>
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label htmlFor="margin" className="block text-sm font-medium text-zinc-300 mb-1">{t('margin', { margin: margin })}</label>
                                <input type="range" id="margin" min="0" max="25" value={margin} onChange={e => setSettingsState({ margin: Number(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff0e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-900" aria-label={t('marginSlider')} aria-valuenow={margin} aria-valuemin={0} aria-valuemax={25} />
                            </div>
                            {watermarkType === 'image' &&
                                <div className="animate-fade-in">
                                    <label htmlFor="scale" className="block text-sm font-medium text-zinc-300 mb-1">{t('imageScale', { scale: scale })}</label>
                                    <input type="range" id="scale" min="1" max="100" value={scale} onChange={e => setSettingsState({ scale: Number(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff0e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-900" aria-label={t('imageScaleSlider')} aria-valuenow={scale} aria-valuemin={1} aria-valuemax={100} />
                                </div>
                            }
                            <div>
                                <label htmlFor="opacity" className="block text-sm font-medium text-zinc-300 mb-1">{t('opacity', { opacity: opacity })}</label>
                                <input type="range" id="opacity" min="0" max="100" value={opacity} onChange={e => setSettingsState({ opacity: Number(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff0e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-900" aria-label={t('opacitySlider')} aria-valuenow={opacity} aria-valuemin={0} aria-valuemax={100} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="animate-fade-in space-y-4">
                       <div>
                            <label htmlFor="spacing" className="block text-sm font-medium text-zinc-300 mb-1">{t('spacing', { spacing: spacing })}</label>
                            <input type="range" id="spacing" min="0" max="100" value={spacing} onChange={e => setSettingsState({ spacing: Number(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff0e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-900" aria-label={t('spacingSlider')} aria-valuenow={spacing} aria-valuemin={0} aria-valuemax={100} />
                        </div>
                         <div>
                            <label htmlFor="rotation" className="block text-sm font-medium text-zinc-300 mb-1">{t('rotation', { rotation: rotation })}</label>
                            <input type="range" id="rotation" min="-180" max="180" value={rotation} onChange={e => setSettingsState({ rotation: Number(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff0e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-900" aria-label={t('rotationSlider')} aria-valuenow={rotation} aria-valuemin={-180} aria-valuemax={180} />
                        </div>
                        {watermarkType === 'image' &&
                            <div className="animate-fade-in">
                                <label htmlFor="scale" className="block text-sm font-medium text-zinc-300 mb-1">{t('imageScale', { scale: scale })}</label>
                                <input type="range" id="scale" min="1" max="100" value={scale} onChange={e => setSettingsState({ scale: Number(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff0e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-900" aria-label={t('imageScaleSlider')} aria-valuenow={scale} aria-valuemin={1} aria-valuemax={100} />
                            </div>
                        }
                        <div>
                            <label htmlFor="opacity" className="block text-sm font-medium text-zinc-300 mb-1">{t('opacity', { opacity: opacity })}</label>
                            <input type="range" id="opacity" min="0" max="100" value={opacity} onChange={e => setSettingsState({ opacity: Number(e.target.value) })} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff0e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0e00] focus:ring-offset-zinc-900" aria-label={t('opacitySlider')} aria-valuenow={opacity} aria-valuemin={0} aria-valuemax={100} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
export default WatermarkSettingsPanel;
