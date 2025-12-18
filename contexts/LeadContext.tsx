
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Lead, LeadStatus } from '../types';
import { LEADS_DATA } from '../data/leads';
import { SupabaseService } from '../services/supabaseService';
import { handleError } from '../utils/errorHandler';

interface LeadContextType {
  leads: Lead[];
  isLoading: boolean;
  error: Error | null;
  handleAddLead: (leadData: { name: string; email: string; whatsapp?: string; toolOfInterest: string }) => Promise<void>;
  handleUpdateLeadStatus: (leadId: number, newStatus: LeadStatus) => Promise<void>;
  handleUpdateLeadNotes: (leadId: number, notes: string) => Promise<void>;
  isLeadPending: (leadId: number) => boolean;
  refetchLeads: () => Promise<void>;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pendingLeadUpdates, setPendingLeadUpdates] = useState(new Set<number>());

  const refetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const leadsFromDb = await SupabaseService.getLeads();
        if (leadsFromDb) {
            setLeads(leadsFromDb);
        } else {
            setLeads(LEADS_DATA);
        }
    } catch (fetchError) {
        setError(fetchError as Error);
        setLeads(LEADS_DATA);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchLeads();
  }, [refetchLeads]);

  const handleAddLead = useCallback(async (leadData: { name: string; email: string; whatsapp?: string; toolOfInterest: string; }) => {
    try {
        const newLeadFromDB = await SupabaseService.addLead({
            ...leadData,
            sourcePlan: 'premium',
        });

        if (newLeadFromDB) {
            setLeads(prevLeads => [newLeadFromDB, ...prevLeads]);
        }
    } catch (error) {
        handleError(error, 'Add Lead Context');
        throw error;
    }
  }, []);

  const handleUpdateLeadStatus = useCallback(async (leadId: number, newStatus: LeadStatus) => {
    const originalLeads = [...leads];
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    setPendingLeadUpdates(prev => new Set(prev).add(leadId));

    try {
      await SupabaseService.updateLeadStatus(leadId, newStatus);
    } catch (error) {
      handleError(error, 'Update Lead Status Context');
      setLeads(originalLeads);
      throw error;
    } finally {
      setPendingLeadUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }
  }, [leads]);

  const handleUpdateLeadNotes = useCallback(async (leadId: number, notes: string) => {
    const originalLeads = [...leads];
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, notes } : lead
      )
    );

    try {
        await SupabaseService.updateLeadNotes(leadId, notes);
    } catch (error) {
        handleError(error, 'Update Lead Notes Context');
        setLeads(originalLeads);
        throw error;
    }
  }, [leads]);

  const isLeadPending = useCallback((leadId: number) => {
    return pendingLeadUpdates.has(leadId);
  }, [pendingLeadUpdates]);

  const value = {
    leads,
    isLoading,
    error,
    handleAddLead,
    handleUpdateLeadStatus,
    handleUpdateLeadNotes,
    isLeadPending,
    refetchLeads,
  };

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = (): LeadContextType => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads deve ser usado dentro de um LeadProvider');
  }
  return context;
};