
import React, { Suspense, lazy, useEffect } from 'react';
import HomePage from './components/HomePage';
import ModalManager from './components/ModalManager';
import { useSiteContent } from './contexts/SiteContentContext';
import { useAuth } from './contexts/AuthContext';
import { Loading } from './components/ui/Loading';
import { BioLinkCategory } from './types';
import { useRoute } from './hooks/useRoute';
import { useSimpleAnalytics } from './hooks/useSimpleAnalytics';
import { SHORTCUT_ROUTES } from './constants';
import { useRecentTools } from './hooks/useRecentTools';
import GlobalSearch from './components/GlobalSearch';
import ZenModeFloat from './components/ZenModeFloat';
import FeedbackWidget from './components/FeedbackWidget';
import WhatsAppFloat from './components/WhatsAppFloat';
import AppErrorBoundary from './components/AppErrorBoundary'; // New import

// Lazy Load Micro-Apps and Admin
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const KitFreelancerEntry = lazy(() => import('./components/apps/kit-freelancer_v1/Entry'));
const MediaToolsEntry = lazy(() => import('./components/apps/Media-Tools-v1/Entry'));
const ShopeeFinderEntry = lazy(() => import('./components/apps/shopee-finder/Entry'));
const StorePage = lazy(() => import('./components/StorePage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const DashboardPage = lazy(() => import('./components/DashboardPage')); 

const App: React.FC = () => {
  const { siteContent } = useSiteContent();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  
  // Custom Hooks
  const { currentHash } = useRoute();
  useSimpleAnalytics();
  const { addRecentTool } = useRecentTools();

  // Rastreamento de Histórico e Redirecionamento Admin
  useEffect(() => {
    // Admin Check
    if (currentHash.startsWith('#/admindash') && !isAuthLoading && !isLoggedIn) {
        window.location.hash = '';
        return;
    }

    // Histórico Tracker
    if (currentHash.includes('?tool=')) {
        const params = new URLSearchParams(currentHash.split('?')[1]);
        const toolId = params.get('tool');
        
        if (toolId) {
            if (currentHash.startsWith('#/app/kit-freelancer')) {
                addRecentTool(toolId, 'kit-freelancer');
            } else if (currentHash.startsWith('#/app/media-tools')) {
                addRecentTool(toolId, 'media-tools');
            }
        }
    } else if (currentHash.startsWith('#/app/shopee-finder')) {
         // Shopee é um app único, tratamos como ferramenta
         addRecentTool('shopee-finder', 'shopee-finder');
    }

  }, [currentHash, isAuthLoading, isLoggedIn, addRecentTool]);

  // Roteamento
  const renderContent = () => {
    // 0. Shortcut Routes (Atalhos)
    const shortcut = SHORTCUT_ROUTES[currentHash];
    if (shortcut) {
        if (shortcut.app === 'media-tools') {
            return (
                <AppErrorBoundary appName="Media Tools">
                    <Suspense fallback={<Loading fullScreen text="Carregando Ferramenta..." />}>
                        <MediaToolsEntry initialTool={shortcut.tool as any} />
                    </Suspense>
                </AppErrorBoundary>
            );
        }
        if (shortcut.app === 'kit-freelancer') {
            return (
                <AppErrorBoundary appName="Kit Freelancer">
                    <Suspense fallback={<Loading fullScreen text="Carregando Ferramenta..." />}>
                        <KitFreelancerEntry initialTool={shortcut.tool as any} />
                    </Suspense>
                </AppErrorBoundary>
            );
        }
    }

    // 1. Rota: Painel Administrativo (Protegida)
    if (currentHash.startsWith('#/admindash')) {
        if (isAuthLoading) {
            return <Loading fullScreen text="Verificando acesso..." />;
        }
        
        if (isLoggedIn) {
            return (
                <AppErrorBoundary appName="Painel Admin">
                    <Suspense fallback={<Loading fullScreen text="Carregando Painel..." />}>
                        <AdminDashboard />
                    </Suspense>
                </AppErrorBoundary>
            );
        }
    }

    // 2. Micro-Apps
    if (currentHash.startsWith('#/app/kit-freelancer')) {
        return (
            <AppErrorBoundary appName="Kit Freelancer">
                <Suspense fallback={<Loading fullScreen text="Carregando Kit Freelancer..." />}>
                    <KitFreelancerEntry />
                </Suspense>
            </AppErrorBoundary>
        );
    }

    if (currentHash.startsWith('#/app/media-tools')) {
        return (
            <AppErrorBoundary appName="Media Tools">
                <Suspense fallback={<Loading fullScreen text="Carregando Media Tools..." />}>
                    <MediaToolsEntry />
                </Suspense>
            </AppErrorBoundary>
        );
    }
    
    // Nova Rota para Shopee Finder
    if (currentHash.startsWith('#/app/shopee-finder')) {
        return (
            <AppErrorBoundary appName="Shopee Finder">
                <Suspense fallback={<Loading fullScreen text="Carregando Shopee Achados..." />}>
                    <ShopeeFinderEntry />
                </Suspense>
            </AppErrorBoundary>
        );
    }

    // Nova Rota para Store
    if (currentHash.startsWith('#/store')) {
        return (
            <AppErrorBoundary appName="Loja">
                <Suspense fallback={<Loading fullScreen text="Carregando Loja..." />}>
                    <StorePage />
                </Suspense>
            </AppErrorBoundary>
        );
    }

    // Nova Rota para Sobre
    if (currentHash.startsWith('#/sobre')) {
        return (
            <AppErrorBoundary appName="Sobre">
                <Suspense fallback={<Loading fullScreen text="Carregando História..." />}>
                    <AboutPage />
                </Suspense>
            </AppErrorBoundary>
        );
    }

    // Nova Rota para Dashboard Pessoal
    if (currentHash.startsWith('#/dashboard')) {
        return (
            <AppErrorBoundary appName="Dashboard Pessoal">
                <Suspense fallback={<Loading fullScreen text="Carregando Meu Espaço..." />}>
                    <DashboardPage />
                </Suspense>
            </AppErrorBoundary>
        );
    }
    
    // 3. Home Page (Pública - Default)
    let initialCategory: BioLinkCategory = 'design';
    
    if (currentHash === '#/fabiodicastop') {
        initialCategory = 'marketing';
    } else if (currentHash === '#/fabiorodriguesdsgn') {
        initialCategory = 'design';
    }

    return (
        <HomePage 
            logo={siteContent.logo_svg} 
            siteContent={siteContent} 
            initialCategory={initialCategory} 
        />
    );
  };

  return (
    <>
      <GlobalSearch />
      <ZenModeFloat />
      <WhatsAppFloat />
      <FeedbackWidget />
      {renderContent()}
      <ModalManager />
    </>
  );
};

export default App;
