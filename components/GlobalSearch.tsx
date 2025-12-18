
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icon } from './icons';
import { useTools } from '../contexts/ToolContext';
import IconRenderer from './IconRenderer';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecentTools } from '../hooks/useRecentTools';
import { Tool } from '../types';

const GlobalSearch: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const { allTools } = useTools();
    const { t, language } = useLanguage();
    const { addRecentTool } = useRecentTools();

    // Toggle with Keyboard Shortcut (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            setSearchTerm('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const filteredTools = useMemo(() => {
        if (!searchTerm) return [];
        
        // Filter by current language and search term
        const term = searchTerm.toLowerCase();
        return allTools
            .filter(tool => tool.lang === language)
            .filter(tool => 
                tool.name.toLowerCase().includes(term) || 
                (tool.description && tool.description.toLowerCase().includes(term))
            )
            .slice(0, 8); // Limit results
    }, [allTools, searchTerm, language]);

    const handleSelect = (tool: Tool) => {
        setIsOpen(false);
        
        if (tool.internalRoute) {
             // Handle Internal Navigation
             window.location.hash = tool.internalRoute.startsWith('#') ? tool.internalRoute : `#${tool.internalRoute}`;
             
             // Track history
             if (tool.internalRoute.includes('kit-freelancer')) {
                 addRecentTool(String(tool.id), 'kit-freelancer');
             } else if (tool.internalRoute.includes('media-tools')) {
                 addRecentTool(String(tool.id), 'media-tools');
             } else if (tool.internalRoute.includes('shopee-finder')) {
                 addRecentTool('shopee-finder', 'shopee-finder');
             }

        } else if (tool.learnMoreUrl) {
             // Handle External Link
             window.open(tool.learnMoreUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredTools.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredTools.length > 0) {
                handleSelect(filteredTools[selectedIndex]);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}></div>
            
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 animate-scale-in">
                <div className="flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800">
                    <Icon name="search" className="w-5 h-5 text-neutral-400" />
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('searchPlaceholder') || "Buscar ferramenta..."}
                        className="w-full py-4 px-3 bg-transparent text-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    <div className="hidden sm:flex items-center gap-1">
                        <span className="text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">ESC</span>
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {filteredTools.length > 0 ? (
                        <div className="space-y-1">
                            {filteredTools.map((tool, index) => (
                                <button
                                    key={tool.id}
                                    onClick={() => handleSelect(tool)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors focus:outline-none ${
                                        index === selectedIndex 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                    }`}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <div className={`p-2 rounded-lg ${index === selectedIndex ? 'bg-primary text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                                        <IconRenderer icon={tool.icon} className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="font-semibold text-sm">{tool.name}</div>
                                        <div className="text-xs opacity-70 truncate max-w-[400px]">{tool.description}</div>
                                    </div>
                                    {index === selectedIndex && (
                                        <Icon name="arrow-right" className="w-4 h-4 opacity-50" />
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : searchTerm ? (
                        <div className="py-12 text-center text-neutral-500">
                            <p>Nenhuma ferramenta encontrada para "{searchTerm}"</p>
                        </div>
                    ) : (
                        <div className="py-8 text-center text-neutral-400">
                             <div className="inline-flex items-center gap-2 mb-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-xs font-medium">
                                 <span className="font-bold">Dica:</span> Digite para buscar
                             </div>
                             <p className="text-xs">Navegue com as setas ↑ ↓ e Enter</p>
                        </div>
                    )}
                </div>
                
                <div className="bg-neutral-50 dark:bg-neutral-950 px-4 py-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs text-neutral-500">
                     <span>Arsenal Intelligence</span>
                     <div className="flex gap-2">
                        <span><strong>↑↓</strong> navegar</span>
                        <span><strong>↵</strong> selecionar</span>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;