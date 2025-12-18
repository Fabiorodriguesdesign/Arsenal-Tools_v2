
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { BioLink, BioLinkCategory, NewBioLink } from '../types';
import { SupabaseService } from '../services/supabaseService';
import { handleError } from '../utils/errorHandler';

interface BioLinkContextType {
  links: BioLink[];
  isLoading: boolean;
  error: Error | null;
  getLinksByCategory: (category: BioLinkCategory) => BioLink[];
  refetchLinks: () => Promise<void>;
  handleAddBioLink: (linkData: NewBioLink) => Promise<void>;
  handleUpdateBioLink: (linkData: BioLink) => Promise<void>;
  handleDeleteBioLink: (linkId: number) => Promise<void>;
}

const BioLinkContext = createContext<BioLinkContextType | undefined>(undefined);

export const BioLinkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [links, setLinks] = useState<BioLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetchLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const fetchedLinks = await SupabaseService.getBioLinks();
        setLinks(fetchedLinks);
    } catch (err) {
        console.error("Erro ao buscar Bio Links:", err);
        setError(err as Error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchLinks();
  }, [refetchLinks]);

  const getLinksByCategory = useCallback((category: BioLinkCategory) => {
    return links.filter(link => link.category === category && link.active).sort((a, b) => a.order - b.order);
  }, [links]);

  const handleAddBioLink = useCallback(async (linkData: NewBioLink) => {
    try {
        const addedLink = await SupabaseService.addBioLink(linkData);
        if(addedLink) {
           setLinks(prev => [...prev, addedLink]);
        }
    } catch (error) {
        handleError(error, 'Add Bio Link Context');
        throw error;
    }
  }, []);

  const handleUpdateBioLink = useCallback(async (linkData: BioLink) => {
    try {
        const updatedLink = await SupabaseService.updateBioLink(linkData);
        if(updatedLink) {
           setLinks(prev => prev.map(l => l.id === updatedLink.id ? updatedLink : l));
        }
    } catch (error) {
        handleError(error, 'Update Bio Link Context');
        throw error;
    }
  }, []);

  const handleDeleteBioLink = useCallback(async (linkId: number) => {
    try {
        await SupabaseService.deleteBioLink(linkId);
        setLinks(prev => prev.filter(l => l.id !== linkId));
    } catch (error) {
        handleError(error, 'Delete Bio Link Context');
        throw error;
    }
  }, []);

  const value = {
    links,
    isLoading,
    error,
    getLinksByCategory,
    refetchLinks,
    handleAddBioLink,
    handleUpdateBioLink,
    handleDeleteBioLink
  };

  return (
    <BioLinkContext.Provider value={value}>
      {children}
    </BioLinkContext.Provider>
  );
};

export const useBioLinks = (): BioLinkContextType => {
  const context = useContext(BioLinkContext);
  if (!context) {
    throw new Error('useBioLinks must be used within a BioLinkProvider');
  }
  return context;
};
