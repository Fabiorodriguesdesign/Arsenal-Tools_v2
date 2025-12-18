
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { SiteContent } from '../types';
import { SITE_CONTENT_DATA_PT, SITE_CONTENT_DATA_EN } from '../data/siteContent';
import { useLanguage } from './LanguageContext';
import { SupabaseService } from '../services/supabaseService';
import { useToast } from './ToastContext';

interface SiteContentContextType {
  siteContent: SiteContent;
  isLoading: boolean;
  error: Error | null;
  updateSiteContent: (newContent: Partial<SiteContent>) => Promise<void>;
  refetchSiteContent: () => Promise<void>; // Nova função exposta
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteContent, setSiteContent] = useState<SiteContent>(SITE_CONTENT_DATA_PT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { language } = useLanguage();
  const { addToast } = useToast();

  // Lógica de busca movida para um useCallback para ser reutilizável
  const refetchSiteContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    // SupabaseService only supports 'pt' or 'en' for site content.
    // If language is 'es' (or other future languages), fallback to 'en'.
    const dbLang = language === 'pt' ? 'pt' : 'en';
    
    try {
        const contentFromDB = await SupabaseService.getSiteContent(dbLang);
        if (contentFromDB) {
            setSiteContent(contentFromDB);
        } else {
            const fallbackData = language === 'pt' ? SITE_CONTENT_DATA_PT : SITE_CONTENT_DATA_EN;
            setSiteContent(fallbackData);
        }
    } catch (fetchError) {
        setError(fetchError as Error);
        const fallbackData = language === 'pt' ? SITE_CONTENT_DATA_PT : SITE_CONTENT_DATA_EN;
        setSiteContent(fallbackData);
        
        // Notifica apenas se for um erro crítico, não um 404 esperado na primeira carga
        if (process.env.NODE_ENV === 'development') {
             addToast('Usando conteúdo local (Offline/Erro)', 'warning');
        }
    } finally {
        setIsLoading(false);
    }
  }, [language, addToast]);

  // O useEffect agora apenas chama a função refetch
  useEffect(() => {
    refetchSiteContent();
  }, [refetchSiteContent]);

  const updateSiteContent = useCallback(async (newContent: Partial<SiteContent>) => {
    const originalContent = siteContent;
    const updatedContent = { ...originalContent, ...newContent };
    
    // Optimistic update
    setSiteContent(updatedContent as SiteContent);
    
    const dbLang = language === 'pt' ? 'pt' : 'en';

    try {
        await SupabaseService.updateSiteContent(dbLang, updatedContent as SiteContent);
    } catch (error) {
        // Revert on error
        setSiteContent(originalContent);
        throw error;
    }
  }, [siteContent, language]);

  return (
    <SiteContentContext.Provider value={{ siteContent, isLoading, error, updateSiteContent, refetchSiteContent }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = (): SiteContentContextType => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent deve ser usado dentro de um SiteContentProvider');
  }
  return context;
};
