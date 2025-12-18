import React from 'react';
import { CheckCircleIcon } from '../icons';

type RenameMode = 'base' | 'smart';
type SeparatorType = '-' | '_' | ' ' | '.';

interface OutputSettingsPanelProps {
    renameMode: RenameMode;
    setRenameMode: (mode: RenameMode) => void;
    baseName: string;
    setBaseName: (name: string) => void;
    separator: SeparatorType;
    setSeparator: (sep: SeparatorType) => void;
    t: (key: string) => string;
}

const OutputSettingsPanel: React.FC<OutputSettingsPanelProps> = ({
    renameMode,
    setRenameMode,
    baseName,
    setBaseName,
    separator,
    setSeparator,
    t
}) => {
    return (
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-zinc-400 uppercase mb-3">Nome do Arquivo de Saída</h4>
            
            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                    onClick={() => setRenameMode('smart')}
                    className={`px-2 py-2 rounded text-xs font-bold transition-colors border ${
                        renameMode === 'smart' 
                        ? 'bg-primary text-white border-primary shadow-sm' 
                        : 'bg-light-bg dark:bg-zinc-800 text-light-muted dark:text-zinc-400 border-light-border dark:border-zinc-700 hover:border-primary/50'
                    }`}
                >
                    Modo Inteligente (SEO)
                </button>
                <button
                    onClick={() => setRenameMode('base')}
                    className={`px-2 py-2 rounded text-xs font-bold transition-colors border ${
                        renameMode === 'base' 
                        ? 'bg-primary text-white border-primary shadow-sm' 
                        : 'bg-light-bg dark:bg-zinc-800 text-light-muted dark:text-zinc-400 border-light-border dark:border-zinc-700 hover:border-primary/50'
                    }`}
                >
                    Modo Sequencial
                </button>
            </div>

            {/* Content based on Mode */}
            {renameMode === 'base' ? (
                <div className="relative animate-fade-in">
                    <input 
                        type="text" 
                        value={baseName}
                        onChange={(e) => setBaseName(e.target.value)}
                        placeholder="Ex: Foto-Otimizada"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:ring-[#ff0e00] focus:border-[#ff0e00] transition-all"
                    />
                    {baseName && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                            <CheckCircleIcon className="w-5 h-5" />
                        </div>
                    )}
                    <p className="text-[10px] text-zinc-500 mt-1">
                        Resultado: {baseName || 'nome-original'}-1.ext <br/>
                        <span className="opacity-70 italic">(Deixe vazio para usar o nome original)</span>
                    </p>
                </div>
            ) : (
                <div className="animate-fade-in">
                     <label className="block text-xs text-zinc-500 mb-2">Separador de palavras:</label>
                     <div className="flex gap-2">
                        {[' ', '-', '_', '.'].map((sep) => (
                            <button
                                key={sep}
                                onClick={() => setSeparator(sep as any)}
                                className={`flex-1 py-2 text-xs font-bold rounded border transition-colors ${
                                    separator === sep 
                                    ? 'bg-[#ff0e00] border-[#ff0e00] text-white' 
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                                }`}
                            >
                                {sep === ' ' ? 'Espaço' : sep}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutputSettingsPanel;