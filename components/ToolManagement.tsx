
import React from 'react';
import { Tool } from '../types';
import { Icon } from './icons';
import IconRenderer from './IconRenderer';
import Pagination from './ui/Pagination';
import { useTableManager } from '../hooks/useTableManager';
import { useModal } from '../contexts/ModalContext';

interface ToolManagementProps {
  tools: Tool[];
  onAdd: () => void;
  onEdit: (tool: Tool) => void;
  onDelete: (toolId: string | number) => void;
}

const ITEMS_PER_PAGE = 10;

const ToolManagement: React.FC<ToolManagementProps> = ({ tools, onAdd, onEdit, onDelete }) => {
  const {
    paginatedData: paginatedTools,
    searchTerm,
    handleSearchChange,
    currentPage,
    setCurrentPage,
    totalPages,
    requestSort,
    getSortIcon,
    filteredDataCount
  } = useTableManager<Tool>({
    initialData: tools,
    itemsPerPage: ITEMS_PER_PAGE,
    initialSortConfig: { key: 'name', direction: 'ascending' },
    searchableKeys: ['name'],
  });

  const { openModal } = useModal();

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-300">Gerenciamento de Ferramentas ({filteredDataCount})</h2>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <label htmlFor="tool-search" className="sr-only">Buscar ferramenta</label>
            <input
              id="tool-search"
              type="text"
              placeholder="Buscar ferramenta..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-base text-neutral-800 dark:text-neutral-300 placeholder-neutral-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
          </div>
          <button
            onClick={onAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-sm font-semibold text-white rounded-lg hover:bg-primary-dark transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-neutral-950"
          >
            <Icon name="plus" className="w-4 h-4" />
            Adicionar Ferramenta
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* Desktop Table View */}
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-neutral-300">Ícone</th>
                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-neutral-300">
                  <button onClick={() => requestSort('name')} className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Nome {getSortIcon('name')}
                  </button>
                </th>
                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-neutral-300">
                  <button onClick={() => requestSort('type')} className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Tipo {getSortIcon('type')}
                  </button>
                </th>
                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-neutral-300 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {paginatedTools.map((tool) => (
                <tr key={tool.id}>
                  <td className="p-4">
                    <IconRenderer icon={tool.icon} className="w-8 h-8 text-primary" />
                  </td>
                  <td className="p-4 text-neutral-800 dark:text-neutral-200">{tool.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      tool.type === 'premium' 
                        ? 'bg-purple-500/10 text-purple-500 dark:text-purple-400' 
                        : 'bg-sky-500/10 text-sky-500 dark:text-sky-400'
                    }`}>
                      {tool.type}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(tool)} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-neutral-900" aria-label={`Editar ${tool.name}`}>
                        <Icon name="pencil" className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => openModal('confirmation', {
                            title: 'Confirmar Exclusão',
                            message: <>Tem certeza que deseja excluir a ferramenta <strong>{tool.name}</strong>? Esta ação não pode ser desfeita.</>,
                            confirmText: 'Excluir Ferramenta',
                            onConfirm: () => onDelete(tool.id)
                        })} 
                        className="text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-neutral-900" 
                        aria-label={`Excluir ${tool.name}`}
                      >
                        <Icon name="trash" className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {paginatedTools.length > 0 ? (
              <div className="p-4 space-y-4">
                  {paginatedTools.map((tool) => (
                      <div key={tool.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex items-center justify-between gap-4 shadow-sm">
                          <div className="flex items-center gap-3 overflow-hidden">
                              <div className="flex-shrink-0 p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                  <IconRenderer icon={tool.icon} className="w-8 h-8 text-primary" />
                              </div>
                              <div className="flex-grow overflow-hidden">
                                  <p className="text-neutral-800 dark:text-neutral-200 font-semibold truncate" title={tool.name}>{tool.name}</p>
                                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${
                                      tool.type === 'premium' 
                                      ? 'bg-purple-500/10 text-purple-500 dark:text-purple-400' 
                                      : 'bg-sky-500/10 text-sky-500 dark:text-sky-400'
                                  }`}>
                                      {tool.type}
                                  </span>
                              </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                              <button onClick={() => onEdit(tool)} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Editar ${tool.name}`}>
                                  <Icon name="pencil" className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => openModal('confirmation', {
                                    title: 'Confirmar Exclusão',
                                    message: <>Tem certeza que deseja excluir a ferramenta <strong>{tool.name}</strong>? Esta ação não pode ser desfeita.</>,
                                    confirmText: 'Excluir Ferramenta',
                                    onConfirm: () => onDelete(tool.id)
                                })} 
                                className="text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                                aria-label={`Excluir ${tool.name}`}
                              >
                                  <Icon name="trash" className="w-5 h-5" />
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
              <p className="text-center py-16 text-neutral-500">Nenhuma ferramenta encontrada.</p>
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

export default React.memo(ToolManagement);