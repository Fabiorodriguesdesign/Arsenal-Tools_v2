
import React, { useState, useRef, useEffect } from 'react';
import { LogoIcon, Icon } from './icons';
import { AdminView } from './AdminDashboard';
import { supabasePromise } from '../services/supabaseClient';

interface AdminLayoutProps {
  logo: string;
  children: React.ReactNode;
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  logo,
  children, 
  activeView, 
  setActiveView, 
  onLogout,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] = useState(true); // Desktop sidebar expand/collapse
  const mainContentRef = useRef<HTMLElement>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const checkDemoMode = async () => {
      const client = await supabasePromise;
      setIsDemoMode(client.isStub ?? false);
    };
    checkDemoMode();
  }, []);

  useEffect(() => {
    if (mainContentRef.current) {
      if (isSidebarOpen) {
        mainContentRef.current.setAttribute('inert', 'true');
      } else {
        mainContentRef.current.removeAttribute('inert');
      }
    }
  }, [isSidebarOpen]);

  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: <Icon name="home" className="w-5 h-5" /> },
    { id: 'leads', label: 'Leads', icon: <Icon name="lead" className="w-5 h-5" /> },
    { id: 'tools', label: 'Ferramentas', icon: <Icon name="toolbox" className="w-5 h-5" /> },
    { id: 'store', label: 'Loja', icon: <Icon name="shopping-cart" className="w-5 h-5" /> },
    { id: 'shopee', label: 'Shopee Finder', icon: <Icon name="shopping-cart" className="w-5 h-5 text-orange-500" /> }, // Novo item
    { id: 'portfolio', label: 'Portfólio', icon: <Icon name="image" className="w-5 h-5" /> },
    { id: 'bio-links', label: 'Bio Links', icon: <Icon name="globe" className="w-5 h-5" /> },
    { id: 'settings', label: 'Configurações', icon: <Icon name="settings" className="w-5 h-5" /> },
  ];
  
  const currentViewLabel = navItems.find(item => item.id === activeView)?.label || 'Dashboard';

  const handleNavClick = (view: AdminView) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  const SidebarContent = () => (
    <>
        <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
           <div className="flex items-center gap-2" style={{ opacity: isDesktopSidebarExpanded ? 1 : 0, transition: 'opacity 0.2s ease' }}>
             <LogoIcon logo={logo} className="w-8 h-8" />
             <span className="font-bold text-lg text-neutral-900 dark:text-white">Admin</span>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-primary" aria-label="Fechar menu">
              <Icon name="x" className="w-6 h-6" />
           </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar" aria-label="Menu administrativo">
          {isDesktopSidebarExpanded && (
             <p className="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Gerenciamento</p>
          )}
         
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id as AdminView)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-primary ${
                activeView === item.id
                  ? 'bg-primary text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {item.icon}
              {isDesktopSidebarExpanded && item.label}
            </button>
          ))}
          <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-800">
             {isDesktopSidebarExpanded && (
               <p className="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Navegação</p>
             )}
             <div className="space-y-2">
                <button
                    onClick={() => window.location.hash = ''}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-primary"
                >
                    <Icon name="external-link" className="w-5 h-5" />
                    {isDesktopSidebarExpanded && 'Voltar para o Site'}
                </button>
             </div>
          </div>
        </nav>
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 bg-white dark:bg-neutral-900">
           <div className="flex gap-2">
              <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-primary"
                >
                  <Icon name="log-out" className="w-5 h-5" />
                  {isDesktopSidebarExpanded && 'Sair'}
              </button>
           </div>
        </div>
    </>
  );

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      <aside className={`fixed top-0 left-0 h-full flex-shrink-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isDesktopSidebarExpanded ? 'w-72' : 'w-20'} md:translate-x-0`}>
        <SidebarContent />
      </aside>
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isDesktopSidebarExpanded ? 'md:ml-72' : 'md:ml-20'}`}>
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
            <button onClick={() => setIsSidebarOpen(true)} className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white p-2 rounded-lg active:bg-neutral-200 dark:active:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-primary" aria-label="Abrir menu">
                <Icon name="menu" className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white truncate">{currentViewLabel}</h1>
            <div className="w-10"></div>
        </header>
        <header className={`hidden md:flex sticky top-0 z-30 items-center h-16 px-6 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300`}>
            <button onClick={() => setIsDesktopSidebarExpanded(!isDesktopSidebarExpanded)} className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white p-2 rounded-lg active:bg-neutral-200 dark:active:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-primary" aria-label={isDesktopSidebarExpanded ? "Recolher menu lateral" : "Expandir menu lateral"}>
                <Icon name="menu" className="w-6 h-6" />
            </button>
            <h1 className="ml-4 text-xl font-bold text-neutral-900 dark:text-white truncate">{currentViewLabel}</h1>
        </header>
        {isDemoMode && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-center gap-2 text-center">
            <Icon name="info" className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-500">
              <span className="font-bold">MODO DEMONSTRAÇÃO:</span> Os dados estão sendo salvos temporariamente no seu navegador.
            </p>
          </div>
        )}
        <main ref={mainContentRef} role="main" className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto w-full" aria-hidden={isSidebarOpen}>
            {children}
        </main>
      </div>
    </div>
  );
};

export default React.memo(AdminLayout);