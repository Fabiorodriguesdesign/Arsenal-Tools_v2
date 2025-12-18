
import React, { useEffect, useState, useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Icon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/shared';
import { useRecentTools } from '../hooks/useRecentTools';
import { useTools } from '../contexts/ToolContext';
import { Tool } from '../types';
import RecentToolsWidget from './home/RecentToolsWidget';
import { useModal } from '../contexts/ModalContext';
import { useLeads } from '../contexts/LeadContext';
import { useToolAccess } from '../hooks/useToolAccess';

// Interface para estrutura de dados locais
interface LocalData {
    monthlySalary: string;
    hoursPerDay: string;
    smartGoalS: string;
    lastProposalClient: string;
    lastProposalDate: string;
}

const DashboardPage: React.FC = () => {
    const { siteContent } = useSiteContent();
    const { t } = useLanguage();
    const [localData, setLocalData] = useState<LocalData>({
        monthlySalary: '',
        hoursPerDay: '',
        smartGoalS: '',
        lastProposalClient: '',
        lastProposalDate: ''
    });

    const { recentTools, clearHistory } = useRecentTools();
    const { tools: allTools } = useTools();
    const { openModal } = useModal();
    const { handleAddLead } = useLeads();
    const { checkAccess } = useToolAccess();

    useEffect(() => {
        try {
            const priceData = localStorage.getItem('servicePriceCalculatorForm');
            const goalsData = localStorage.getItem('smartGoalsData');
            const proposalData = localStorage.getItem('proposalBuilderData');

            const parsedPrice = priceData ? JSON.parse(priceData) : {};
            const parsedGoals = goalsData ? JSON.parse(goalsData) : {};
            const parsedProposal = proposalData ? JSON.parse(proposalData) : {};

            setLocalData({
                monthlySalary: parsedPrice.monthlySalary || '',
                hoursPerDay: parsedPrice.hoursPerDay || '',
                smartGoalS: parsedGoals.S || '',
                lastProposalClient: parsedProposal.clientName || '',
                lastProposalDate: parsedProposal.issueDate || ''
            });
        } catch (e) {
            console.error("Erro ao ler dados locais para o dashboard", e);
        }
    }, []);

    const recentToolsData = useMemo(() => {
      return recentTools.map(item => {
          if (item.appId === 'shopee-finder') {
               return {
                   id: 'shopee-finder',
                   name: 'Shopee Finder',
                   icon: 'shopping-cart',
                   type: 'freemium',
                   internalRoute: '/app/shopee-finder',
                   description: 'Curadoria de ofertas'
               } as Tool;
          }
          return allTools.find(t => t.id === item.toolId || (String(t.id) === String(item.toolId)));
      }).filter(Boolean) as Tool[];
    }, [recentTools, allTools]);

    const handleToolInteraction = (tool: Tool) => {
      const { hasAccess } = checkAccess(tool);

      if (hasAccess) {
          if (tool.internalRoute) {
               window.location.hash = tool.internalRoute.startsWith('#') ? tool.internalRoute : `#${tool.internalRoute}`;
          } else if (tool.learnMoreUrl) {
               window.open(tool.learnMoreUrl, '_blank', 'noopener,noreferrer');
          } else {
               openModal('leadCapture', { tool, onAddLead: handleAddLead });
          }
      } else {
          openModal('leadCapture', { tool, onAddLead: handleAddLead });
      }
    };

    const shortcuts = [
        { name: 'Kit Freelancer', icon: 'toolbox', link: '#/app/kit-freelancer', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Mídia Tools', icon: 'image', link: '#/app/media-tools', color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { name: 'Premium Tools', icon: 'sparkles', link: '#premium-tools', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { name: 'Loja Arsenal', icon: 'shopping-cart', link: '#/store', color: 'text-green-500', bg: 'bg-green-500/10' },
    ];

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col font-sans transition-colors duration-300">
            <Header logo={siteContent.logo_svg} />
            
            <main id="main-content" className="flex-grow pt-24 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
                    
                    {/* Hero Welcome */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">
                                {greeting()}, Freelancer!
                            </h1>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                                Este é o seu espaço pessoal. Os dados abaixo são salvos apenas no seu navegador.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-full border border-yellow-200 dark:border-yellow-800">
                            <Icon name="lock" className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">Privacidade Total</span>
                        </div>
                    </div>

                    {/* Visto Recentemente Widget */}
                    <RecentToolsWidget 
                        tools={recentToolsData} 
                        onToolClick={handleToolInteraction} 
                        onClearHistory={clearHistory} 
                    />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card Financeiro */}
                        <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Icon name="currency-dollar" className="w-24 h-24" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4 relative z-10">Planejamento Financeiro</h3>
                            {localData.monthlySalary ? (
                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Meta Mensal</p>
                                        <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">
                                            {formatCurrency(parseFloat(localData.monthlySalary))}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Jornada Diária</p>
                                        <p className="text-xl font-bold text-neutral-800 dark:text-white">
                                            {localData.hoursPerDay}h <span className="text-sm font-normal text-neutral-500">/ dia</span>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <p className="text-sm text-neutral-500 mb-4">Defina suas metas financeiras na calculadora.</p>
                                    <button 
                                        onClick={() => window.location.hash = '#/app/kit-freelancer?tool=price-calculator'}
                                        className="text-sm font-bold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                                    >
                                        Configurar Agora &rarr;
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Card Metas */}
                        <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Icon name="goal" className="w-24 h-24" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4 relative z-10">Foco Principal (SMART)</h3>
                            {localData.smartGoalS ? (
                                <div className="relative z-10 h-full flex flex-col">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Objetivo Específico</p>
                                    <p className="text-base font-medium text-neutral-800 dark:text-zinc-200 italic leading-relaxed line-clamp-3">
                                        "{localData.smartGoalS}"
                                    </p>
                                    <div className="mt-auto pt-4">
                                        <button 
                                            onClick={() => window.location.hash = '#/app/kit-freelancer?tool=smart-goals'}
                                            className="text-xs font-bold bg-neutral-200 dark:bg-neutral-800 px-3 py-1.5 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        >
                                            Revisar Plano
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <p className="text-sm text-neutral-500 mb-4">Você ainda não definiu uma meta SMART.</p>
                                    <button 
                                        onClick={() => window.location.hash = '#/app/kit-freelancer?tool=smart-goals'}
                                        className="text-sm font-bold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                                    >
                                        Criar Meta &rarr;
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Card Última Atividade */}
                        <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Icon name="proposal-builder" className="w-24 h-24" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4 relative z-10">Último Orçamento</h3>
                            {localData.lastProposalClient ? (
                                <div className="relative z-10">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Cliente</p>
                                    <p className="text-xl font-bold text-neutral-800 dark:text-white mb-2">{localData.lastProposalClient}</p>
                                    <p className="text-xs text-neutral-400">
                                        Editado em: {localData.lastProposalDate ? new Date(localData.lastProposalDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                     <button 
                                        onClick={() => window.location.hash = '#/app/kit-freelancer?tool=proposal-builder'}
                                        className="mt-4 text-sm font-bold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                                    >
                                        Continuar Editando &rarr;
                                    </button>
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <p className="text-sm text-neutral-500 mb-4">Nenhum orçamento em andamento.</p>
                                    <button 
                                        onClick={() => window.location.hash = '#/app/kit-freelancer?tool=proposal-builder'}
                                        className="text-sm font-bold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                                    >
                                        Novo Orçamento &rarr;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Acesso Rápido</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {shortcuts.map((shortcut) => (
                                <a 
                                    key={shortcut.name}
                                    href={shortcut.link}
                                    className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-primary/50 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <div className={`p-4 rounded-xl ${shortcut.bg} ${shortcut.color} mb-4 transition-transform group-hover:scale-110 shadow-sm`}>
                                        <Icon name={shortcut.icon as any} className="w-8 h-8" />
                                    </div>
                                    <span className="font-bold text-neutral-800 dark:text-zinc-200 text-sm">{shortcut.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DashboardPage;