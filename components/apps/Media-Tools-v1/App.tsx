
import React, { useState, useEffect, lazy, Suspense } from 'react';
import LandingPage from './components/LandingPage';
import ToolContainer from './components/ToolContainer';
import { MenuIcon, ArrowLeftIcon } from './components/icons';
import { useLanguage } from './contexts/LanguageContext';
import { TABS } from './components/constants';
import { Tab } from './types';
import DesktopNav from './components/layout/DesktopNav';
import MobileMenu from './components/layout/MobileMenu';
import { Loading } from '../../ui/Loading';
import { useMediaRouter } from './hooks/useMediaRouter';
import { useZenMode } from '../../../contexts/ZenModeContext';
import { Icon } from '@/components/icons';
import ThemeToggle from '../../ThemeToggle';

// Lazy Loading
const BackgroundMaster = lazy(() => import('./components/background-master/BackgroundMaster'));
const ZipperTool = lazy(() => import('./components/zipper/ZipperTool'));
const RenamerTool = lazy(() => import('./components/renamer/RenamerTool'));
const ImageOptimizer = lazy(() => import('./components/optimizer/ImageOptimizer'));
const ImageConverter = lazy(() => import('./components/converter/ImageConverter'));
const WatermarkTool = lazy(() => import('./components/watermark/WatermarkTool'));
const PaletteGenerator = lazy(() => import('./components/palette-generator/PaletteGenerator'));
const PsdGenerator = lazy(() => import('./components/psd-generator/PsdGenerator'));
const SvgToCode = lazy(() => import('./components/svg-to-code/SvgToCode'));
const ImgToSvg = lazy(() => import('./components/img-to-svg/ImgToSvg'));
const ImgToWebp = lazy(() => import('./components/img-to-webp/ImgToWebp'));
const ElementorCropp = lazy(() => import('./components/elementor-cropp/ElementorCropp'));
const AudioConverter = lazy(() => import('./components/audio-converter/AudioConverter'));

interface AppProps {
    initialTool?: Tab;
}

const App: React.FC<AppProps> = ({ initialTool }) => {
    const { currentView, activeTab, handleNavigateToTool, setActiveTab } = useMediaRouter({ initialTool });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t, language, toggleLanguage } = useLanguage();
    const { isZenMode, toggleZenMode } = useZenMode();

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isMobileMenuOpen]);

    const renderTabContent = () => {
        return (
            <Suspense fallback={<Loading text="Carregando módulo..." />}>
                {(() => {
                    switch (activeTab) {
                        case 'elementor-cropp': return <ElementorCropp />;
                        case 'background': return <BackgroundMaster />;
                        case 'zipper': return <ZipperTool />;
                        case 'renamer': return <RenamerTool />;
                        case 'optimizer': return <ImageOptimizer />;
                        case 'converter': return <ImageConverter />;
                        case 'watermark': return <WatermarkTool />;
                        case 'palette': return <PaletteGenerator />;
                        case 'psd-generator': return <PsdGenerator />;
                        case 'svg-to-code': return <SvgToCode />;
                        case 'img-to-svg': return <ImgToSvg />;
                        case 'img-to-webp': return <ImgToWebp />;
                        case 'audio-converter': return <AudioConverter />;
                        default: return null;
                    }
                })()}
            </Suspense>
        );
    };
    
    const handleTabChange = (tabId: Tab) => {
        setActiveTab(tabId);
        setIsMobileMenuOpen(false);
    }

    const currentTabInfo = TABS.find(t => t.id === activeTab);
    const translatedLabel = currentTabInfo ? t(`${currentTabInfo.id}Label`) : '';
    const translatedDescription = currentTabInfo ? t(`${currentTabInfo.id}ToolDesc`) : '';

    const handleBackToArsenal = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.hash = ''; 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (currentView === 'landing') {
        return <LandingPage onNavigateToTool={handleNavigateToTool} />;
    }

    return (
        <div className="min-h-screen bg-light-bg dark:bg-zinc-950 text-light-text dark:text-zinc-200">
            {!isZenMode && (
                <header className="fixed top-0 left-0 right-0 z-40 bg-light-card/80 dark:bg-zinc-950/80 backdrop-blur-sm shadow-sm border-b border-light-border dark:border-zinc-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between h-16 md:h-20">
                            <button onClick={handleBackToArsenal} className="flex items-center gap-2 text-sm font-semibold text-light-muted dark:text-zinc-400 hover:text-primary transition-colors group">
                                <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <ArrowLeftIcon className="w-5 h-5 text-primary" />
                                </div>
                                <span className="font-bold text-lg text-light-text dark:text-zinc-200 group-hover:text-primary dark:group-hover:text-white transition-colors">{t('siteTitleShort')}</span>
                            </button>
                            <div className="flex items-center gap-1 md:gap-3">
                                <div className="hidden md:flex items-center gap-1">
                                    <button onClick={toggleZenMode} className="p-2 rounded-full text-light-muted dark:text-zinc-400 hover:text-primary transition-colors" title="Modo Zen">
                                        <Icon name="maximize" className="w-5 h-5" />
                                    </button>
                                    <ThemeToggle />
                                    <button
                                      onClick={toggleLanguage}
                                      className="inline-flex items-center justify-center w-10 h-10 text-light-muted dark:text-zinc-400 text-xs font-bold rounded-full transition-all duration-200 hover:bg-light-border dark:hover:bg-zinc-800 hover:text-accent-blue dark:hover:text-accent-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                                      title={t('changeLanguage')}
                                    >
                                        {language.toUpperCase()}
                                    </button>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-md text-light-text dark:text-zinc-200 hover:bg-light-border dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary">
                                    <MenuIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <DesktopNav activeTab={activeTab} setActiveTab={handleTabChange} />
                </header>
            )}
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} activeTab={activeTab} setActiveTab={handleTabChange} language={language} toggleLanguage={toggleLanguage} />
            <div className={`${isZenMode ? 'pt-8' : 'pt-40 md:pt-48'}`}>
                <ToolContainer title={translatedLabel} description={translatedDescription}>
                    {renderTabContent()}
                </ToolContainer>
            </div>
        </div>
    );
};

export default App;