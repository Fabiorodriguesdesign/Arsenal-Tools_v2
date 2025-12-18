
import React, { useState, useEffect, useRef } from 'react';
import { Product, NewProduct } from '../types';
import BaseModal from './ui/BaseModal';
import LoadingSpinner from './ui/LoadingSpinner';
import { Icon } from './icons';
import { scrapeUrlMetadata } from '../utils/linkScraper';
import { useToast } from '../contexts/ToastContext';

interface AddEditProductModalProps {
  productToEdit: Product | null;
  onClose: () => void;
  onSave: (product: NewProduct | Product) => void | Promise<void>;
}

const AddEditProductModal: React.FC<AddEditProductModalProps> = ({ productToEdit, onClose, onSave }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<NewProduct>({
    title: '',
    description: '',
    price: 0,
    oldPrice: undefined,
    coverUrl: '',
    purchaseUrl: '',
    category: 'design',
    isFeatured: false,
    badge: '',
    active: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title,
        description: productToEdit.description,
        price: productToEdit.price,
        oldPrice: productToEdit.oldPrice,
        coverUrl: productToEdit.coverUrl,
        purchaseUrl: productToEdit.purchaseUrl,
        category: productToEdit.category,
        isFeatured: productToEdit.isFeatured || false,
        badge: productToEdit.badge || '',
        active: productToEdit.active
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        coverUrl: '',
        purchaseUrl: '',
        category: 'design',
        isFeatured: false,
        badge: '',
        active: true
      });
    }
  }, [productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'oldPrice' ? parseFloat(value) || 0 : value) 
    }));
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
            setFormData(prev => ({ ...prev, coverUrl: dataUrl }));
        }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAutoFill = async () => {
      if (!formData.purchaseUrl) {
          addToast("Insira um link primeiro para buscar os dados.", "warning");
          return;
      }
      
      setIsScraping(true);
      try {
          const data = await scrapeUrlMetadata(formData.purchaseUrl);
          
          if (data) {
              setFormData(prev => ({
                  ...prev,
                  title: data.title || prev.title,
                  description: data.description ? data.description.substring(0, 200) + (data.description.length > 200 ? '...' : '') : prev.description,
                  coverUrl: data.image || prev.coverUrl,
                  price: data.price && data.price > 0 ? data.price : prev.price
              }));
              
              const msg = data.price && data.price > 0 
                ? "Dados e preço importados com sucesso!" 
                : "Dados importados (Preço não detectado).";
                
              addToast(msg, "success");
          } else {
              addToast("Não foi possível extrair dados deste link. Tente preencher manualmente.", "error");
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
        // Normaliza a categoria para lowercase para evitar duplicidade de 'Design' e 'design'
        const productToSave = {
            ...formData,
            category: formData.category.toLowerCase()
        };

        if (productToEdit) {
            await onSave({ ...productToEdit, ...productToSave });
        } else {
            await onSave(productToSave);
        }
    } catch (error) {
        console.error("Falha ao salvar produto:", error);
    } finally {
        setIsLoading(false);
    }
  };
  
  const isFormValid = formData.title.trim() !== '' && formData.price >= 0 && formData.purchaseUrl.trim() !== '';

  return (
    <BaseModal onClose={onClose} titleId="product-modal-title" containerClassName="max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="p-4 sm:p-6 md:p-8">
            <h2 id="product-modal-title" className="font-bold text-2xl text-neutral-900 dark:text-white">
              {productToEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">Preencha os detalhes do produto para a loja.</p>

            <div className="mt-8 space-y-6">
              
              {/* Link First for Scraping */}
              <div>
                <label htmlFor="purchaseUrl" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Link de Compra / Afiliado (Shopee, Hotmart...)</label>
                <div className="flex gap-2">
                    <input id="purchaseUrl" name="purchaseUrl" type="url" value={formData.purchaseUrl} onChange={handleChange} required className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://..." />
                    <button
                        type="button"
                        onClick={handleAutoFill}
                        disabled={isScraping || !formData.purchaseUrl}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed"
                        title="Preencher dados automaticamente a partir do link"
                    >
                        {isScraping ? <LoadingSpinner className="w-5 h-5 text-white" /> : <Icon name="download" className="w-5 h-5" />}
                    </button>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">Cole o link e clique no botão azul para tentar preencher título e imagem automaticamente.</p>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Título do Produto</label>
                    <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ex: Fone Bluetooth" />
                  </div>
                   <div>
                    <label htmlFor="category" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Categoria</label>
                    <input 
                        id="category" 
                        name="category" 
                        list="category-options"
                        value={formData.category} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Ex: tecnologia"
                    />
                    <datalist id="category-options">
                        <option value="design" />
                        <option value="marketing" />
                        <option value="produtividade" />
                        <option value="tecnologia" />
                        <option value="casa" />
                        <option value="moda" />
                    </datalist>
                  </div>
              </div>

               <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Descrição Curta</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Descreva os benefícios do produto..."></textarea>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                    <label htmlFor="price" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Preço (R$)</label>
                    <input id="price" name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} required className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                   <div>
                    <label htmlFor="oldPrice" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Preço Antigo (Opcional)</label>
                    <input id="oldPrice" name="oldPrice" type="number" step="0.01" min="0" value={formData.oldPrice || ''} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" placeholder="0.00" />
                  </div>
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                        <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Imagem de Capa (URL)</label>
                         <div className="flex gap-2">
                             <input 
                                id="coverUrl" 
                                name="coverUrl" 
                                type="text" 
                                value={formData.coverUrl} 
                                onChange={handleChange} 
                                placeholder="https://..."
                                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
                             />
                             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                             <button type="button" onClick={handleUploadClick} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-300 dark:hover:bg-neutral-600">Upload</button>
                         </div>
                   </div>
                   <div>
                        <label htmlFor="badge" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Badge (Ex: Mais Vendido)</label>
                        <input id="badge" name="badge" type="text" value={formData.badge || ''} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary" />
                   </div>
               </div>

                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Ativo</span>
                    </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Destaque</span>
                    </label>
                </div>

            </div>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-800/50 px-4 sm:px-8 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-2xl border-t border-neutral-200 dark:border-neutral-800">
            <button type="button" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm font-semibold rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={!isFormValid || isLoading} className="w-full sm:w-auto px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-neutral-400 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed flex items-center justify-center sm:min-w-[180px]">
              {isLoading ? <LoadingSpinner className="w-5 h-5 text-white" /> : (productToEdit ? 'Salvar Alterações' : 'Adicionar Produto')}
            </button>
          </div>
        </form>
    </BaseModal>
  );
};

export default AddEditProductModal;
