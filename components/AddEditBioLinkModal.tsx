
import React, { useState, useEffect, useRef } from 'react';
import { BioLink, NewBioLink } from '../types';
import BaseModal from './ui/BaseModal';
import LoadingSpinner from './ui/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { Icon } from './icons';
import { scrapeUrlMetadata } from '../utils/linkScraper';
import { useToast } from '../contexts/ToastContext';

interface AddEditBioLinkModalProps {
  linkToEdit: BioLink | null;
  onClose: () => void;
  onSave: (link: NewBioLink | BioLink) => void | Promise<void>;
}

const AddEditBioLinkModal: React.FC<AddEditBioLinkModalProps> = ({ linkToEdit, onClose, onSave }) => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [formData, setFormData] = useState<NewBioLink>({
    title: '',
    image_url: '',
    destination_url: '',
    category: 'design',
    order: 1,
    active: true,
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (linkToEdit) {
      setFormData({
        title: linkToEdit.title,
        image_url: linkToEdit.image_url,
        destination_url: linkToEdit.destination_url,
        category: linkToEdit.category,
        order: linkToEdit.order,
        active: linkToEdit.active,
        description: linkToEdit.description || '',
      });
    } else {
      setFormData({
        title: '',
        image_url: '',
        destination_url: '',
        category: 'design',
        order: 1,
        active: true,
        description: '',
      });
    }
  }, [linkToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : (name === 'order' ? parseInt(value) || 1 : value) 
    }));
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
            setFormData(prev => ({ ...prev, image_url: dataUrl }));
        }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleAutoFill = async () => {
      if (!formData.destination_url) {
          addToast("Insira um link de destino primeiro.", "warning");
          return;
      }
      
      setIsScraping(true);
      try {
          const data = await scrapeUrlMetadata(formData.destination_url);
          
          if (data) {
              setFormData(prev => ({
                  ...prev,
                  title: data.title || prev.title,
                  description: data.description ? data.description.substring(0, 150) + (data.description.length > 150 ? '...' : '') : prev.description,
                  image_url: data.image || prev.image_url
              }));
              addToast("Dados importados!", "success");
          } else {
              addToast("Não foi possível extrair dados.", "error");
          }
      } catch (error) {
          addToast("Erro ao buscar dados.", "error");
      } finally {
          setIsScraping(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
        if (linkToEdit) {
            await onSave({ ...linkToEdit, ...formData });
        } else {
            await onSave(formData);
        }
    } catch (error) {
        console.error("Falha ao salvar link:", error);
    } finally {
        setIsLoading(false);
    }
  };
  
  const isFormValid = formData.title.trim() !== '' && formData.image_url.trim() !== '' && formData.destination_url.trim() !== '';

  return (
    <BaseModal onClose={onClose} titleId="bio-link-modal-title" containerClassName="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="p-4 sm:p-6 md:p-8">
            <h2 id="bio-link-modal-title" className="font-bold text-2xl text-neutral-900 dark:text-white">
              {linkToEdit ? 'Editar Link' : 'Adicionar Novo Link'}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">Configure o banner para o seu link.</p>

            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Categoria</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                    </select>
                  </div>
                  <div>
                     <label htmlFor="order" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Ordem</label>
                     <input id="order" name="order" type="number" min="1" value={formData.order} onChange={handleChange} required className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
                  </div>
              </div>
              
              <div>
                <label htmlFor="destination_url" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">URL de Destino</label>
                <div className="flex gap-2">
                    <input id="destination_url" name="destination_url" type="url" value={formData.destination_url} onChange={handleChange} required className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="https://..." />
                    <button
                        type="button"
                        onClick={handleAutoFill}
                        disabled={isScraping || !formData.destination_url}
                        className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:bg-neutral-600"
                        title="Preencher dados automaticamente"
                    >
                        {isScraping ? <LoadingSpinner className="w-5 h-5 text-white" /> : <Icon name="download" className="w-5 h-5" />}
                    </button>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Título do Banner</label>
                <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Ex: Meu Portfólio" />
              </div>

               <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Descrição</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Descreva brevemente o que está no link..."></textarea>
              </div>

              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">URL do Ícone / Upload</label>
                <div className="flex gap-2">
                    <input 
                        id="image_url" 
                        name="image_url" 
                        type="text" 
                        value={formData.image_url} 
                        onChange={handleChange} 
                        placeholder="URL ou Upload"
                        className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <button type="button" onClick={handleUploadClick} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-950">Upload</button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-800/50 px-4 sm:px-8 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-2xl border-t border-neutral-200 dark:border-neutral-800">
            <button type="button" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm font-semibold rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-950">
              {t('cancelButton')}
            </button>
            <button type="submit" disabled={!isFormValid || isLoading} className="w-full sm:w-auto px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-neutral-400 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed flex items-center justify-center sm:min-w-[180px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-neutral-950">
              {isLoading ? <LoadingSpinner className="w-5 h-5 text-white" /> : (linkToEdit ? t('saveChangesButton') : 'Adicionar Link')}
            </button>
          </div>
        </form>
    </BaseModal>
  );
};

export default AddEditBioLinkModal;