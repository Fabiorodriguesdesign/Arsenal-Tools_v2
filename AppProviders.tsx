
import React from 'react';
import { SiteContentProvider } from './contexts/SiteContentContext';
import { LeadProvider } from './contexts/LeadContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToolProvider } from './contexts/ToolContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModalProvider } from './contexts/ModalContext';
import { AuthProvider } from './contexts/AuthContext';
import { BioLinkProvider } from './contexts/BioLinkContext';
import { ToastProvider } from './contexts/ToastContext';
import { ZenModeProvider } from './contexts/ZenModeContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
            <SiteContentProvider>
            <LeadProvider>
                <ToolProvider>
                <BioLinkProvider>
                    <AuthProvider>
                    <ZenModeProvider>
                        <ModalProvider>
                            {children}
                        </ModalProvider>
                    </ZenModeProvider>
                    </AuthProvider>
                </BioLinkProvider>
                </ToolProvider>
            </LeadProvider>
            </SiteContentProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
