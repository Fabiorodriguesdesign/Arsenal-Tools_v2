
import React from 'react';
import { LogoIcon, Icon } from './icons';
import { useLanguage, Language } from '../contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';

interface HeaderProps {
  logo: string;
}

const Header: React.FC<HeaderProps> = ({ logo }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isLoggedIn, logout } = useAuth();
  const { openModal } = useModal();

  const toggleLanguage = () => {
    const nextLang: Record<Language, Language> = {
        'pt': 'en',
        'en': 'es',
        'es': 'pt'
    };
    setLanguage(nextLang[language]);
  };

  const handleLogoClick = () => {
    window.location.hash = ''; // Redireciona para a raiz
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header role="banner" className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Area */}
          <div 
            className="flex items-center flex-shrink-0 gap-3 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple rounded-lg p-1" 
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
            aria-label="Arsenal Tools - Ir para a página inicial"
          >
            <LogoIcon logo={logo} className="w-8 h-8 md:w-9 md:h-9 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline font-bold text-lg md:text-xl text-neutral-900 dark:text-white tracking-tight">Arsenal Tools</span>
          </div>
          
          {/* Actions Area */}
          <nav aria-label="Navegação Principal" className="flex items-center gap-1 sm:gap-2 justify-end flex-1">
             <button
                onClick={() => window.location.hash = '#/dashboard'}
                className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors mr-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple"
                title="Acessar Meu Espaço"
                aria-label="Ir para Meu Espaço"
            >
                Meu Espaço
            </button>


            <ThemeToggle />
            
            <button
                onClick={toggleLanguage}
                className="inline-flex items-center justify-center w-10 h-10 text-neutral-500 dark:text-neutral-400 text-xs md:text-sm font-bold rounded-full transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-accent-blue dark:hover:text-accent-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple active:scale-95"
                title={t('changeLanguage')}
                aria-label={`Mudar idioma. Idioma atual: ${language.toUpperCase()}`}
              >
                {language.toUpperCase()}
            </button>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-neutral-200 dark:border-neutral-800 mx-2 hidden sm:block" aria-hidden="true"></div>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                  <button
                    onClick={logout}
                    className="inline-flex items-center justify-center w-10 h-10 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-full transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    title={t('logout')}
                    aria-label="Sair da conta"
                  >
                    <Icon name="log-out" className="w-5 h-5" />
                  </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <a 
                  href="https://ko-fi.com/fabiorodriguesdsgn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center justify-center p-2.5 text-primary hover:bg-primary/10 rounded-full transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple"
                  title={t('buyMeACoffee')}
                  aria-label="Apoiar o projeto (Buy me a Coffee)"
                >
                  <Icon name="coffee" className="w-5 h-5" />
                </a>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
