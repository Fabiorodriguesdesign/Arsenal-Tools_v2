
import React, { useState, useMemo } from 'react';
import BaseModal from '../../../../BaseModal';
import { BackgroundSettings, GradientSettings, PatternSettings } from './types';
import { EditIcon } from '../../../../icons';

interface BackgroundEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: BackgroundSettings;
  onSave: (settings: BackgroundSettings) => void;
}

const BackgroundEditorModal: React.FC<BackgroundEditorModalProps> = ({ isOpen, onClose, initialSettings, onSave }) => {
    const [settings, setSettings] = useState(initialSettings);
    
    const handleSave = () => onSave(settings);

    const gradientPreview = useMemo(() => {
        const { from, to, angle } = settings.gradient;
        return `linear-gradient(${angle}deg, ${from}, ${to})`;
    }, [settings.gradient]);

    const patternPreviewStyle = useMemo(() => {
        const p = settings.pattern;
        const pCanvas = document.createElement('canvas');
        pCanvas.width = p.scale;
        pCanvas.height = p.scale;
        const pCtx = pCanvas.getContext('2d');
        if (!pCtx) return {};

        pCtx.fillStyle = p.color1;
        pCtx.fillRect(0, 0, p.scale, p.scale);
        pCtx.fillStyle = p.color2;
        if (p.type === 'checkerboard') {
            pCtx.fillRect(0, 0, p.scale / 2, p.scale / 2);
            pCtx.fillRect(p.scale / 2, p.scale / 2, p.scale / 2, p.scale / 2);
        } else if (p.type === 'stripes') {
            pCtx.fillRect(0, 0, p.scale, p.scale / 2);
        } else if (p.type === 'dots') {
            pCtx.beginPath();
            pCtx.arc(p.scale / 2, p.scale / 2, p.scale / 4, 0, 2 * Math.PI);
            pCtx.fill();
        }
        return {
            backgroundImage: `url(${pCanvas.toDataURL()})`,
            backgroundRepeat: 'repeat',
        };
    }, [settings.pattern]);

    const handlePatternChange = (key: keyof PatternSettings, value: any) => {
        setSettings(s => ({ ...s, pattern: { ...s.pattern, [key]: value } }));
    };

    if (!isOpen) return null;

    return (
        <BaseModal onClose={onClose} titleId="bg-editor-title" containerClassName="max-w-xl">
             <div className="p-6">
                <h2 id="bg-editor-title" className="text-2xl font-bold flex items-center gap-3 text-zinc-100">
                    <EditIcon className="w-6 h-6 text-[#ff0e00]"/>
                    Editor de Fundo
                </h2>
                
                <div className="flex bg-zinc-800/50 p-1 rounded-lg mt-6 mb-4">
                    {(['color', 'gradient', 'pattern'] as const).map(mode => (
                        <button 
                            key={mode} 
                            onClick={() => setSettings(s => ({ ...s, mode }))} 
                            className={`flex-1 text-sm font-bold py-2 rounded ${settings.mode === mode ? 'bg-[#ff0e00] text-white' : 'text-zinc-300'}`}
                        >
                            {mode === 'color' ? 'Cor Sólida' : mode === 'gradient' ? 'Gradiente' : 'Padrão'}
                        </button>
                    ))}
                </div>

                <div className="min-h-[250px]">
                    {/* Solid Color */}
                    {settings.mode === 'color' && (
                        <div className="space-y-4 animate-fade-in">
                            <h4 className="font-semibold">Cor Sólida</h4>
                            <div className="flex items-center gap-4">
                                <input type="color" value={settings.solidColor} onChange={e => setSettings(s => ({ ...s, solidColor: e.target.value }))} className="w-16 h-16 p-0 m-0 cursor-pointer rounded-md overflow-hidden bg-transparent border-none"/>
                                <input type="text" value={settings.solidColor} onChange={e => setSettings(s => ({ ...s, solidColor: e.target.value }))} className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-md px-3 py-2 uppercase font-mono"/>
                            </div>
                        </div>
                    )}
                    {/* Gradient */}
                    {settings.mode === 'gradient' && (
                        <div className="space-y-4 animate-fade-in">
                            <h4 className="font-semibold">Gradiente Personalizado</h4>
                            <div className="h-24 w-full rounded-md border border-zinc-700" style={{ background: gradientPreview }}></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400">Cor 1</label>
                                    <input type="color" value={settings.gradient.from} onChange={e => setSettings(s => ({ ...s, gradient: { ...s.gradient, from: e.target.value } }))} className="w-full h-10 p-0 m-0 cursor-pointer rounded-md overflow-hidden bg-transparent border-none"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400">Cor 2</label>
                                    <input type="color" value={settings.gradient.to} onChange={e => setSettings(s => ({ ...s, gradient: { ...s.gradient, to: e.target.value } }))} className="w-full h-10 p-0 m-0 cursor-pointer rounded-md overflow-hidden bg-transparent border-none"/>
                                </div>
                            </div>
                             <div>
                                <label className="text-xs font-bold text-zinc-400">Direção</label>
                                <select value={settings.gradient.angle} onChange={e => setSettings(s => ({...s, gradient: {...s.gradient, angle: Number(e.target.value)}}))} className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 mt-1">
                                    <option value="0">Vertical (↓)</option>
                                    <option value="90">Horizontal (→)</option>
                                    <option value="45">Diagonal (↘)</option>
                                    <option value="135">Diagonal (↙)</option>
                                </select>
                            </div>
                        </div>
                    )}
                     {/* Pattern */}
                    {settings.mode === 'pattern' && (
                        <div className="space-y-4 animate-fade-in">
                            <h4 className="font-semibold">Padrão de Fundo</h4>
                            <div className="h-24 w-full rounded-md border border-zinc-700 mb-4" style={patternPreviewStyle}></div>
                             <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => handlePatternChange('type', 'checkerboard')} className={`h-12 rounded ring-2 ${settings.pattern.type === 'checkerboard' ? 'ring-[#ff0e00]' : 'ring-transparent'}`} style={{background: 'conic-gradient(#ccc 25%, #eee 0 50%, #ccc 0 75%, #eee 0)', backgroundSize: '20px 20px'}}></button>
                                <button onClick={() => handlePatternChange('type', 'stripes')} className={`h-12 rounded ring-2 ${settings.pattern.type === 'stripes' ? 'ring-[#ff0e00]' : 'ring-transparent'}`} style={{background: 'repeating-linear-gradient(45deg, #ccc, #ccc 10px, #eee 10px, #eee 20px)'}}></button>
                                <button onClick={() => handlePatternChange('type', 'dots')} className={`h-12 rounded ring-2 ${settings.pattern.type === 'dots' ? 'ring-[#ff0e00]' : 'ring-transparent'}`} style={{background: 'radial-gradient(#ccc 20%, transparent 0)', backgroundSize: '15px 15px'}}></button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2"><label className="text-xs font-bold text-zinc-400">Cor 1</label><input type="color" value={settings.pattern.color1} onChange={e => handlePatternChange('color1', e.target.value)} className="w-full h-10 p-0 m-0 cursor-pointer rounded-md overflow-hidden bg-transparent border-none"/></div>
                               <div className="space-y-2"><label className="text-xs font-bold text-zinc-400">Cor 2</label><input type="color" value={settings.pattern.color2} onChange={e => handlePatternChange('color2', e.target.value)} className="w-full h-10 p-0 m-0 cursor-pointer rounded-md overflow-hidden bg-transparent border-none"/></div>
                            </div>
                             <div>
                                <label className="text-xs font-bold text-zinc-400">Escala ({settings.pattern.scale}px)</label>
                                <input type="range" min="5" max="100" value={settings.pattern.scale} onChange={e => handlePatternChange('scale', Number(e.target.value))} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff0e00]"/>
                            </div>
                        </div>
                    )}
                </div>
             </div>

             <div className="bg-zinc-800/50 px-6 py-4 flex flex-row-reverse rounded-b-xl border-t border-zinc-800">
                <button onClick={handleSave} className="bg-[#ff0e00] hover:bg-[#e00c00] text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Salvar
                </button>
                <button onClick={onClose} className="text-zinc-300 hover:text-white font-semibold py-2 px-6 rounded-lg mr-2">
                    Cancelar
                </button>
             </div>
        </BaseModal>
    );
};

export default BackgroundEditorModal;
