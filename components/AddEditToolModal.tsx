
import React, { useState, useEffect, useRef } from 'react';
import { Tool, NewTool } from '../types';
import IconRenderer from './IconRenderer';
import BaseModal from './ui/BaseModal';
import LoadingSpinner from './ui/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

interface AddEditToolModalProps {
  toolToEdit: Tool | null;
  onClose: () => void;
  onSave: (tool: NewTool | Tool) => void | Promise<void>;
}

const AddEditToolModal: React.FC<AddEditToolModalProps> = ({ toolToEdit, onClose, onSave }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<NewTool>({
    name: '',
    type: 'freemium' as 'freemium' | 'premium',
    icon: '',
    learnMoreUrl: '',
    description: '',
    benefits: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (toolToEdit) {
      setFormData({
        name: toolToEdit.name,
        type: toolToEdit.type,
        icon: toolToEdit.icon,
        learnMoreUrl: toolToEdit.learnMoreUrl || '',
        description: toolToEdit.description || '',
        benefits: toolToEdit.benefits || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'freemium',
        icon: '',
        learnMoreUrl: '',
        description: '',
        benefits: '',
      });
    }
  }, [toolToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
    const isImage = file.type.startsWith('image/') && !isSvg;

    if (isSvg) {
        reader.onload = (e) => {
            const svgContent = e.target?.result as string;
            if (svgContent) {
                setFormData(prev => ({ ...prev, icon: svgContent }));
            }
        };
        reader.readAsText(file);
    } else if (isImage) {
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            if (dataUrl) {
                setFormData(prev => ({ ...prev, icon: dataUrl }));
            }
        };
        reader.readAsDataURL(file);
    } else {
        alert('Formato de arquivo não suportado. Use SVG, PNG, ou JPG.');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
        const dataToSave = { ...formData };
        if (dataToSave.type === 'freemium') {
          dataToSave.description = '';
          dataToSave.benefits = '';
        }
        
        if (toolToEdit) {
            await onSave({ ...toolToEdit, ...dataToSave });
        } else {
            await onSave(dataToSave);
        }
    } catch (error) {
        console.error("Falha ao salvar a ferramenta:", error);
    } finally {
        setIsLoading(false);
    }
  };
  
  const isFormValid = formData.name.trim() !== '' && formData.icon.trim() !== '';

  return (
    <BaseModal onClose={onClose} titleId="tool-modal-title" containerClassName="max-w-2xl">
        <form id="tool-form" onSubmit={handleSubmit}>
            <div className="px-6 pt-6 pb-2">
                <h2 id="tool-modal-title" className="font-bold text-2xl text-neutral-900 dark:text-white">
                {toolToEdit ? t('editToolTitle') : t('addToolTitle')}
                </h2>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-2">{t('toolNameLabel')}</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-neutral-400 mb-2">{t('toolTypeLabel')}</label>
                    <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <option value="freemium">Freemium</option>
                    <option value="premium">Premium</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="learnMoreUrl" className="block text-sm font-medium text-neutral-400 mb-2">{t('toolUrlLabel')}</label>
                    <input id="learnMoreUrl" name="learnMoreUrl" type="text" value={formData.learnMoreUrl} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder={t('toolUrlPlaceholder')} />
                    <p className="text-xs text-neutral-500 mt-2">
                    {t('toolUrlHint')}
                    </p>
                </div>

                {formData.type === 'premium' && (
                    <>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-neutral-400 mb-2">{t('toolDescriptionLabel')}</label>
                        <textarea 
                            id="description" 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            rows={3} 
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                            placeholder={t('toolDescriptionPlaceholder')} 
                        />
                    </div>
                    <div>
                        <label htmlFor="benefits" className="block text-sm font-medium text-neutral-400 mb-2">{t('toolBenefitsLabel')}</label>
                        <textarea 
                            id="benefits" 
                            name="benefits" 
                            value={formData.benefits} 
                            onChange={handleChange} 
                            rows={4} 
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                            placeholder={t('toolBenefitsPlaceholder')}
                        />
                        <p className="text-xs text-neutral-500 mt-2">
                            {t('toolBenefitsHint')}
                        </p>
                    </div>
                    </>
                )}
                <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-neutral-400 mb-2">{t('toolIconLabel')}</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center p-2 border border-neutral-700 flex-shrink-0">
                        {formData.icon ? (
                        <IconRenderer icon={formData.icon} className="w-full h-full text-primary" />
                        ) : (
                        <span className="text-xs text-neutral-500">{t('iconPreview')}</span>
                        )}
                    </div>
                    <div className="w-full">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/svg+xml, image/png, image/jpeg"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={handleUploadClick}
                            className="w-full font-bold py-3 px-4 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-neutral-900"
                        >
                            {t('uploadIconButton')}
                        </button>
                        <p className="text-xs text-neutral-500 mt-2">
                            {t('uploadIconHint')}
                        </p>
                    </div>
                    </div>
                </div>
            </div>

            <div className="bg-neutral-800/50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-2xl border-t border-neutral-800">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2 border border-neutral-700 text-sm font-semibold rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-900"
                >
                    {t('cancelButton')}
                </button>
                <button
                    type="submit"
                    form="tool-form"
                    disabled={!isFormValid || isLoading}
                    className="w-full sm:w-auto px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed flex items-center justify-center sm:min-w-[180px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-neutral-900"
                >
                    {isLoading ? (
                        <LoadingSpinner className="w-5 h-5 text-white" />
                    ) : (
                        toolToEdit ? t('saveChangesButton') : t('addToolButton')
                    )}
                </button>
            </div>
        </form>
    </BaseModal>
  );
};

export default AddEditToolModal;