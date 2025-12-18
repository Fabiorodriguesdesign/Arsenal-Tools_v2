
import React from 'react';
import { Tool, SiteContent } from '../../types';
import AnimatedSection from '../AnimatedSection';
import ToolCard from '../ToolCard';
import { Icon } from '../icons';
import { useToolAccess } from '../../hooks/useToolAccess';

interface PremiumToolSectionProps {
    tools: Tool[];
    siteContent: SiteContent;
    isLoggedIn: boolean;
    onNavigate: (route: string) => void;
    onSelect: (tool: Tool) => void;
    onOpenModal: (modalType: 'upgrade' | 'adminLogin') => void;
}

const PremiumLockOverlay: React.FC<{ toolName: string, onRequestAccess: () => void }> = ({ toolName, onRequestAccess }) => {
    return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 dark:bg-neutral-950/60 backdrop-blur-md rounded-2xl border border-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100">
             <div className="bg-neutral-900/90 dark:bg-black/90 p-6 rounded-2xl text-center shadow-2xl border border-neutral-800 transform scale-95 group-hover:scale-100 transition-all duration-300 max-w-xs mx-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Icon name="lock" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Acesso Restrito</h3>
                <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                    Esta ferramenta faz parte do pacote <strong>Premium</strong>.
                </p>
                <button 
                    onClick={(e) => { e.stopPropagation(); onRequestAccess(); }}
                    className="w-full py-2 px-4 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors"
                >
                    Solicitar Acesso
                </button>
            </div>
        </div>
    );
}

const PremiumToolSection: React.FC<PremiumToolSectionProps> = ({ 
    tools, siteContent, isLoggedIn, onNavigate, onSelect, onOpenModal 
}) => {
    const { checkAccess } = useToolAccess();
    
    if (tools.length === 0) return null;

    return (
        <section id="premium-tools" className="relative py-20 bg-neutral-50 dark:bg-neutral-900/30 border-y border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"></div>
            <div className="container mx-auto px-4 md:px-8 lg:px-12 relative">
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-200 dark:border-purple-800">
                        <Icon name="sparkles" className="w-4 h-4" />
                        Starter & Pro
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-4">
                        {siteContent.premium_title}
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
                        {siteContent.premium_subtitle}
                    </p>
                </div>

                <AnimatedSection className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {tools.map(tool => {
                        const { isLocked } = checkAccess(tool);
                        
                        return (
                            <div key={tool.id} className="relative group">
                                {isLocked && (
                                    <PremiumLockOverlay 
                                        toolName={tool.name} 
                                        onRequestAccess={() => onSelect(tool)}
                                    />
                                )}
                                <div className={isLocked ? "filter blur-[3px] opacity-70 pointer-events-none transition-all duration-300 group-hover:blur-[5px]" : ""}>
                                    <ToolCard 
                                        tool={tool} 
                                        onNavigate={onNavigate} 
                                        onSelect={() => onSelect(tool)} 
                                    />
                                </div>
                            </div>
                        );
                    })}
                </AnimatedSection>
                
                {!isLoggedIn && (
                    <div className="mt-16 text-center">
                        <p className="text-sm text-neutral-500 mb-4">Já possui acesso liberado?</p>
                        <button 
                            onClick={() => onOpenModal('adminLogin')}
                            className="text-primary hover:text-primary-dark font-semibold text-sm underline decoration-2 underline-offset-2"
                        >
                            Fazer Login na Conta
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PremiumToolSection;