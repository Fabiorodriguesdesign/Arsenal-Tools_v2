
import React, { useMemo } from 'react';
import { Lead, Tool, LeadStatus, LEAD_STATUS_OPTIONS } from '../types';
import { Icon } from './icons';
import Pagination from './ui/Pagination';
import IconRenderer from './IconRenderer';
import { useTableManager } from '../hooks/useTableManager';
import { useLanguage } from '../contexts/LanguageContext';
import { getStatusClass, getOptionClass } from '../utils';

interface LeadManagementProps {
  leads: Lead[];
  tools: Tool[];
  onUpdateStatus: (leadId: number, newStatus: LeadStatus) => void;
  onViewDetails: (lead: Lead) => void;
  onDownloadCSV: () => void;
  isLeadPending: (leadId: number) => boolean;
}

const ITEMS_PER_PAGE = 10;

const LeadManagement: React.FC<LeadManagementProps> = ({ leads, tools, onUpdateStatus, onViewDetails, onDownloadCSV, isLeadPending }) => {
  const {
    paginatedData: paginatedLeads,
    searchTerm,
    handleSearchChange,
    currentPage,
    setCurrentPage,
    totalPages,
    requestSort,
    getSortIcon,
    selectedTool,
    handleToolFilter,
    filteredDataCount,
  } = useTableManager<Lead>({
    initialData: leads,
    itemsPerPage: ITEMS_PER_PAGE,
    initialSortConfig: { key: 'date', direction: 'descending' },
    searchableKeys: ['name', 'email'],
    toolFilterKey: 'toolOfInterest',
  });

  const premiumTools = useMemo(() => tools.filter(t => t.type === 'premium'), [tools]);
  const { t } = useLanguage();

  return (
    <section>
      <div className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-300 mb-4">Filtrar Leads por Ferramenta</h3>
         <div className="flex flex-wrap gap-4">
            <button 
                onClick={() => handleToolFilter(null)} 
                className={`flex flex-col items-center justify-center gap-2 p-2 rounded-lg transition-colors w-20 h-24 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-primary ${!selectedTool ? 'bg-primary' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                title="Ver Todos"
            >
                <div className="w-10 h-10 flex items-center justify-center">
                    <Icon name="grid" className="w-8 h-8 text-white" />
                </div>
                <span className={`text-xs truncate ${!selectedTool ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>Todos</span>
            </button>
          {premiumTools.map(tool => (
            <button 
                key={tool.id} 
                onClick={() => handleToolFilter(tool.name)}
                className={`flex flex-col items-center justify-center gap-2 p-2 rounded-lg transition-colors w-20 h-24 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-primary ${selectedTool === tool.name ? 'bg-primary' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                title={tool.name}
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <IconRenderer icon={tool.icon} className="w-8 h-8 text-primary" />
              </div>
              <span className={`text-xs break-all text-center leading-tight ${selectedTool === tool.name ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-300">
          {selectedTool ? `Leads de ${selectedTool}` : 'Todos os Leads'} ({filteredDataCount})
        </h2>
         <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
           <div className="relative w-full sm:w-64">
             <label htmlFor="lead-search" className="sr-only">Buscar por nome ou email</label>
             <input
              id="lead-search"
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-base text-neutral-800 dark:text-neutral-300 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
          </div>
          <button 
            onClick={onDownloadCSV}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 text-sm font-semibold text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex-shrink-0 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-primary"
          >
            <Icon name="download" className="w-4 h-4" />
            Baixar CSV
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* Desktop Table View */}
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                  <button onClick={() => requestSort('name')} className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Nome {getSortIcon('name')}
                  </button>
                </th>
                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">Contato</th>
                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                  <button onClick={() => requestSort('toolOfInterest')} className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Ferramenta {getSortIcon('toolOfInterest')}
                  </button>
                </th>
                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                  <button onClick={() => requestSort('date')} className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Data {getSortIcon('date')}
                  </button>
                </th>
                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                   <button onClick={() => requestSort('status')} className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Status {getSortIcon('status')}
                  </button>
                </th>
                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-neutral-300 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {paginatedLeads.map((lead: Lead) => (
                <tr 
                  key={lead.id} 
                  className={`transition-opacity duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${isLeadPending(lead.id) ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                >
                  <td className="p-4 text-neutral-800 dark:text-neutral-200 font-semibold">{lead.name}</td>
                  <td className="p-4 text-sm">
                    <div className="text-neutral-700 dark:text-neutral-300">{lead.email}</div>
                    {lead.whatsapp && <div className="text-neutral-500 dark:text-neutral-500 text-xs mt-0.5">{lead.whatsapp}</div>}
                  </td>
                  <td className="p-4 text-neutral-700 dark:text-neutral-300 font-medium">
                    {lead.toolOfInterest}
                  </td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400" title={new Date(lead.date).toLocaleString('pt-BR')}>
                    {new Date(lead.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                      className={`w-full max-w-[150px] p-2 text-xs font-semibold rounded-md capitalize border bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${getStatusClass(lead.status)}`}
                      aria-label={t('changeLeadStatus').replace('{leadName}', lead.name)}
                    >
                      {LEAD_STATUS_OPTIONS.map(option => (
                        <option key={option} value={option} className={`bg-white dark:bg-neutral-800 ${getOptionClass(option)}`}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => onViewDetails(lead)} className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-primary" aria-label={`Ver detalhes de ${lead.name}`}>
                        <Icon name="eye" className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
            {paginatedLeads.length > 0 ? (
                <div className="p-4 space-y-4">
                {paginatedLeads.map((lead: Lead) => (
                    <div key={lead.id} className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg space-y-4 shadow-sm transition-all duration-300 ${isLeadPending(lead.id) ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-neutral-800 dark:text-neutral-200">{lead.name}</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">{lead.email}</p>
                                {lead.whatsapp && <p className="text-sm text-neutral-600 dark:text-neutral-400">{lead.whatsapp}</p>}
                            </div>
                            <button onClick={() => onViewDetails(lead)} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex-shrink-0 ml-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-primary" aria-label={`Ver detalhes de ${lead.name}`}>
                                <Icon name="eye" className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm border-t border-neutral-200 dark:border-neutral-700/50 pt-3">
                            <div>
                                <p className="text-neutral-500 text-xs font-semibold uppercase">Ferramenta</p>
                                <p className="text-neutral-700 dark:text-neutral-300">{lead.toolOfInterest}</p>
                            </div>
                            <div>
                                <p className="text-neutral-500 text-xs font-semibold uppercase">Data</p>
                                <p className="text-neutral-600 dark:text-neutral-400">{new Date(lead.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                            </div>
                        </div>
                        <div>
                            <label htmlFor={`status-${lead.id}`} className="text-neutral-500 text-xs font-semibold uppercase mb-1 block">Status</label>
                             <select
                                id={`status-${lead.id}`}
                                value={lead.status}
                                onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                                className={`w-full p-2 text-xs font-semibold rounded-md capitalize border bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${getStatusClass(lead.status)}`}
                                aria-label={t('changeLeadStatus').replace('{leadName}', lead.name)}
                            >
                              {LEAD_STATUS_OPTIONS.map(option => (
                                <option key={option} value={option} className={`bg-white dark:bg-neutral-800 ${getOptionClass(option)}`}>
                                  {option}
                                </option>
                              ))}
                            </select>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-center py-16 text-neutral-500">Nenhum lead encontrado.</p>
            )}
        </div>
        
        {totalPages > 1 && (
           <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
        )}
      </div>
    </section>
  );
};

export default React.memo(LeadManagement);