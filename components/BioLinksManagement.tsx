
import React, { useState } from 'react';
import { BioLink, NewBioLink, BioLinkCategory } from '../types';
import { useBioLinks } from '../contexts/BioLinkContext';
import { Icon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from './ui/LoadingSpinner';
import { useModal } from '../contexts/ModalContext';

const BioLinksManagement: React.FC = () => {
  const { t } = useLanguage();
  const { links, isLoading, handleAddBioLink, handleUpdateBioLink, handleDeleteBioLink } = useBioLinks();
  const { openModal } = useModal();
  
  const [activeCategory, setActiveCategory] = useState<BioLinkCategory>('design');

  const filteredLinks = links
    .filter(link => link.category === activeCategory)
    .sort((a, b) => a.order - b.order);

  const handleSave = async (linkData: NewBioLink | BioLink) => {
      if ('id' in linkData) {
          await handleUpdateBioLink(linkData as BioLink);
      } else {
          await handleAddBioLink(linkData as NewBioLink);
      }
  };

  const handleOpenAddModal = () => {
    openModal('addEditBioLink', { 
        linkToEdit: null, 
        onSaveBioLink: handleSave 
    });
  };

  const handleOpenEditModal = (link: BioLink) => {
    openModal('addEditBioLink', { 
        linkToEdit: link, 
        onSaveBioLink: handleSave 
    });
  };

  const handleDelete = async (link: BioLink) => {
    openModal('confirmation', {
        title: 'Confirmar Exclusão',
        message: <>Tem certeza que deseja excluir o link <strong>{link.title}</strong>?</>,
        confirmText: 'Excluir Link',
        onConfirm: () => handleDeleteBioLink(link.id),
    });
  };

  return (
    <section className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Gerenciador de Bio Links</h1>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">Edite os banners de link que aparecem na home page.</p>
        </div>
        <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-sm font-semibold text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
        >
            <Icon name="plus" className="w-4 h-4" />
            Adicionar Novo Link
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 mb-8 max-w-md">
        {(['design', 'marketing'] as BioLinkCategory[]).map((category) => (
            <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 focus:outline-none focus-visible:ring-2 ring-primary ring-opacity-60
                ${activeCategory === category 
                    ? 'bg-white dark:bg-neutral-700 text-primary shadow' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-white/[0.5] dark:hover:bg-neutral-700/[0.5]'
                }`}
            >
                {category === 'design' ? 'Design & Criação' : 'MKT & Estratégia'}
            </button>
        ))}
      </div>

      {/* Grid de Links */}
      {isLoading ? (
          <div className="flex justify-center py-20">
              <LoadingSpinner className="w-10 h-10"/>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                    <div key={link.id} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm group hover:shadow-lg dark:hover:shadow-black/50 transition-shadow duration-300">
                        <div className="relative bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700/50 p-4 flex items-center justify-center h-24">
                             <img src={link.image_url} alt={link.title} className="max-w-full max-h-16 object-contain" />
                             <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white font-mono" title="Ordem de exibição">
                                 #{link.order}
                             </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-neutral-900 dark:text-white truncate" title={link.title}>{link.title}</h3>
                            <p className="text-xs text-neutral-500 mt-1 h-8 line-clamp-2">{link.description}</p>
                            <a href={link.destination_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block mt-1">
                                {link.destination_url}
                            </a>
                            <div className="mt-4 flex justify-end gap-2">
                                <button 
                                    onClick={() => handleOpenEditModal(link)}
                                    className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                                    aria-label="Editar"
                                >
                                    <Icon name="pencil" className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(link)}
                                    className="p-2 text-neutral-500 hover:text-red-600 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                    aria-label="Excluir"
                                >
                                    <Icon name="trash" className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full py-20 text-center bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
                    <Icon name="globe" className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-600 dark:text-neutral-400 font-semibold">Nenhum link cadastrado.</p>
                    <p className="text-sm text-neutral-500">Clique em "Adicionar Novo Link" para começar.</p>
                </div>
            )}
          </div>
      )}
    </section>
  );
};

export default BioLinksManagement;