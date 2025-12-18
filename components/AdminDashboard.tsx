
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ToolManagement from './ToolManagement';
import Settings from './Settings';
import LeadManagement from './LeadManagement';
import Overview from './Overview';
import BioLinksManagement from './BioLinksManagement';
import StoreManagement from './StoreManagement';
import PortfolioManagement from './PortfolioManagement';
import ShopeeManagement from './ShopeeManagement';
import { Tool, Lead, SiteContent, NewTool, LeadStatus } from '../types';
import { useTools } from '../contexts/ToolContext';
import { useLeads } from '../contexts/LeadContext';
import { useSiteContent } from '../contexts/SiteContentContext';
import { useModal } from '../contexts/ModalContext';
import { handleDownloadLeadsCSV } from '../utils';
import { useAuth } from '../contexts/AuthContext';
import TableLoadingSkeleton from './ui/TableLoadingSkeleton';
import SettingsLoadingSkeleton from './ui/SettingsLoadingSkeleton';
import { SupabaseService } from '../services/supabaseService';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

export type AdminView = 'overview' | 'tools' | 'settings' | 'leads' | 'bio-links' | 'store' | 'portfolio' | 'shopee';

const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const { t } = useLanguage();
  const { addToast } = useToast();
  
  const { allTools: tools, handleAddTool, handleUpdateTool, handleDeleteTool, error: toolsError, isLoading: isToolsLoading, refetchTools } = useTools();
  const { leads, isLeadPending, handleUpdateLeadStatus, handleUpdateLeadNotes, error: leadsError, isLoading: isLeadsLoading, refetchLeads } = useLeads();
  const { siteContent, updateSiteContent, error: siteContentError, isLoading: isSiteContentLoading, refetchSiteContent } = useSiteContent();
  
  const { openModal, closeModal } = useModal();
  const { logout } = useAuth();
  
  // Analytics State (Simple Mock)
  const [dailyVisits, setDailyVisits] = useState(0);

  useEffect(() => {
      const today = new Date().toISOString().split('T')[0];
      const visitsKey = `visits_${today}`;
      const visits = parseInt(localStorage.getItem(visitsKey) || '0');
      setDailyVisits(visits);
  }, []);

  const isOffline = !!toolsError || !!leadsError || !!siteContentError;

  const toolsForManagement = useMemo(() => {
    const excludedCategories = ['Kit Freelancer', 'Media Tools'];
    return tools.filter(tool => 
        (typeof tool.id === 'number') && (!tool.category || !excludedCategories.includes(tool.category))
    );
  }, [tools]);

  const onAddTool = useCallback(async (newToolData: NewTool) => {
    try {
      await handleAddTool(newToolData);
      addToast('Ferramenta adicionada com sucesso!', 'success');
    } catch {
      addToast('Erro ao adicionar ferramenta.', 'error');
    }
  }, [handleAddTool, addToast]);

  const onUpdateTool = useCallback(async (updatedTool: Tool) => {
    try {
      await handleUpdateTool(updatedTool);
      addToast('Ferramenta atualizada com sucesso!', 'success');
    } catch {
      addToast('Erro ao atualizar ferramenta.', 'error');
    }
  }, [handleUpdateTool, addToast]);

  const onDeleteTool = useCallback(async (toolId: string | number) => {
    try {
      if (typeof toolId === 'string') {
         addToast('Ferramentas internas não podem ser excluídas.', 'error');
         return;
      }
      await handleDeleteTool(toolId);
      addToast('Ferramenta excluída com sucesso!', 'success');
    } catch {
      addToast('Erro ao excluir ferramenta.', 'error');
    }
  }, [handleDeleteTool, addToast]);

  const onUpdateLeadStatus = useCallback(async (leadId: number, newStatus: LeadStatus) => {
    try {
      await handleUpdateLeadStatus(leadId, newStatus);
      addToast('Status do lead atualizado!', 'success');
    } catch (error) {
      addToast('Falha ao atualizar o status.', 'error');
    }
  }, [handleUpdateLeadStatus, addToast]);
  
  const onSaveLeadNotes = useCallback(async (leadId: number, notes: string) => {
    try {
      await handleUpdateLeadNotes(leadId, notes);
      addToast('Anotações salvas com sucesso!', 'success');
      closeModal();
    } catch (error) {
      addToast('Falha ao salvar anotações.', 'error');
    }
  }, [handleUpdateLeadNotes, closeModal, addToast]);

  const onUpdateSiteContent = useCallback(async (newContent: Partial<SiteContent>) => {
    try {
      await updateSiteContent(newContent);
      addToast('Conteúdo do site atualizado!', 'success');
    } catch {
      addToast('Erro ao atualizar o conteúdo.', 'error');
    }
  }, [updateSiteContent, addToast]);
  
  const handleSaveTool = useCallback(async (toolData: NewTool | Tool) => {
    if ('id' in toolData) {
      await onUpdateTool(toolData);
    } else {
      await onAddTool(toolData);
    }
    closeModal();
  }, [onAddTool, onUpdateTool, closeModal]);
  
  const handleOpenAddToolModal = useCallback(() => {
    openModal('addEditTool', { 
        toolToEdit: null, 
        onSave: handleSaveTool 
    });
  }, [openModal, handleSaveTool]);
  
  const handleOpenEditToolModal = useCallback((tool: Tool) => {
    openModal('addEditTool', { 
        toolToEdit: tool, 
        onSave: handleSaveTool 
    });
  }, [openModal, handleSaveTool]);

  const handleOpenLeadDetailModal = useCallback((lead: Lead) => {
    openModal('leadDetail', { lead, onSaveNotes: onSaveLeadNotes });
  }, [openModal, onSaveLeadNotes]);

  const handleSeedDatabase = useCallback(async () => {
    await SupabaseService.seedDatabase();
  }, []);

  const handleRefreshData = useCallback(async () => {
    try {
        await Promise.all([
            refetchSiteContent(),
            refetchTools(),
            refetchLeads()
        ]);
        addToast("Dados recarregados com sucesso.", 'success');
    } catch (error) {
        addToast('Erro ao atualizar a interface com os novos dados.', 'error');
    }
  }, [refetchSiteContent, refetchTools, refetchLeads, addToast]);

  const leadsByToolData = useMemo(() => {
    const premiumTools = tools.filter(t => t.type === 'premium');
    const data = premiumTools.map(tool => ({
        name: tool.name,
        value: leads.filter(lead => lead.toolOfInterest === tool.name).length,
    })).filter(item => item.value > 0).sort((a, b) => b.value - a.value);

    return data;
  }, [tools, leads]);

  return (
    <>
      <AdminLayout 
        logo={siteContent.logo_svg}
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={logout}
      >
        <div key={activeView} className="animate-fade-in w-full h-full">
            {isOffline && (
                <div className="bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 p-4 rounded-lg mb-6 border border-yellow-500/20 text-center text-sm">
                    <strong>Atenção:</strong> Não foi possível conectar ao banco de dados. O painel está operando em modo offline com dados locais. As alterações podem não ser salvas.
                </div>
            )}
            
            {activeView === 'overview' && (
                <Overview 
                    tools={tools} 
                    leads={leads} 
                    leadsByToolData={leadsByToolData} 
                    dailyVisits={dailyVisits}
                />
            )}
            
            {activeView === 'tools' && (isToolsLoading ? <TableLoadingSkeleton /> : <ToolManagement tools={toolsForManagement} onAdd={handleOpenAddToolModal} onEdit={handleOpenEditToolModal} onDelete={onDeleteTool} />)}
            {activeView === 'leads' && (isLeadsLoading ? <TableLoadingSkeleton /> : <LeadManagement leads={leads} tools={tools} onUpdateStatus={onUpdateLeadStatus} onViewDetails={handleOpenLeadDetailModal} onDownloadCSV={() => handleDownloadLeadsCSV(leads)} isLeadPending={isLeadPending} />)}
            {activeView === 'bio-links' && <BioLinksManagement />}
            {activeView === 'store' && <StoreManagement />}
            {activeView === 'portfolio' && <PortfolioManagement />}
            {activeView === 'shopee' && <ShopeeManagement />}
            {activeView === 'settings' && (isSiteContentLoading 
            ? <SettingsLoadingSkeleton /> 
            : <Settings 
                siteContent={siteContent}
                onUpdateSiteContent={onUpdateSiteContent}
                onSeedDatabase={handleSeedDatabase}
                onRefreshData={handleRefreshData}
                />
            )}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
