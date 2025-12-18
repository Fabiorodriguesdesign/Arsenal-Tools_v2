
import React, { useState } from 'react';
import { Lead } from '../types';
import BaseModal from './ui/BaseModal';
import { Icon } from './icons';
import LoadingSpinner from './ui/LoadingSpinner';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onSaveNotes: (leadId: number, notes: string) => void | Promise<void>;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, onSaveNotes }) => {
  const [notes, setNotes] = useState(lead.notes || '');
  const [isLoading, setIsLoading] = useState(false);

  // Helper para formatar link do WhatsApp
  const getWhatsappLink = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
        await onSaveNotes(lead.id, notes);
        // O modal será fechado pelo componente pai em caso de sucesso
    } catch (error) {
        // A notificação de erro é tratada pelo componente pai
        console.error("Falha ao salvar anotações", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <BaseModal onClose={onClose} titleId="lead-detail-title" containerClassName="max-w-2xl">
      <div className="p-4 sm:p-6 md:p-8">
          <div className="flex justify-between items-start">
              <div>
                  <h2 id="lead-detail-title" className="font-bold text-2xl text-neutral-900 dark:text-white">Detalhes do Lead</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-1">Informações e anotações sobre {lead.name}.</p>
              </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-500 font-semibold mb-1">Nome</p>
                  <p className="text-neutral-900 dark:text-neutral-200 font-medium">{lead.name}</p>
              </div>
              
              <div className="bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-500 font-semibold mb-1">Email</p>
                  <a 
                    href={`mailto:${lead.email}`} 
                    className="text-primary hover:underline flex items-center gap-2 font-medium"
                  >
                    <Icon name="envelope" className="w-4 h-4" />
                    {lead.email}
                  </a>
              </div>
              
               <div className="bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-500 font-semibold mb-1">WhatsApp</p>
                  {lead.whatsapp ? (
                    <a 
                        href={getWhatsappLink(lead.whatsapp)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-2 font-medium"
                    >
                        <Icon name="whatsapp" className="w-4 h-4" />
                        {lead.whatsapp}
                    </a>
                  ) : (
                    <p className="text-neutral-500 italic">Não informado</p>
                  )}
              </div>

              <div className="bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-500 font-semibold mb-1">Ferramenta de Interesse</p>
                  <p className="text-neutral-900 dark:text-neutral-200 font-medium">{lead.toolOfInterest}</p>
              </div>
              
               <div className="bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-500 font-semibold mb-1">Data de Captura</p>
                  <p className="text-neutral-900 dark:text-neutral-200 font-medium">{new Date(lead.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
              </div>
              
               <div className="bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-500 font-semibold mb-1">Status</p>
                  <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full capitalize border bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200`}>
                    {lead.status}
                  </span>
              </div>
          </div>

           <div className="mt-6">
              <label htmlFor="notes" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Anotações Internas</label>
              <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  className="w-full p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
                  placeholder="Adicione anotações sobre o lead aqui..."
              />
          </div>
      </div>
      <div className="bg-neutral-100 dark:bg-neutral-800/50 px-4 sm:px-8 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-2xl border-t border-neutral-200 dark:border-neutral-800">
           <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 border border-neutral-300 dark:border-neutral-700 text-sm font-semibold rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-900"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center sm:min-w-[120px] disabled:bg-neutral-400 dark:disabled:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-neutral-900"
          >
            {isLoading ? <LoadingSpinner className="w-5 h-5" /> : 'Salvar'}
          </button>
      </div>
    </BaseModal>
  );
};

export default LeadDetailModal;