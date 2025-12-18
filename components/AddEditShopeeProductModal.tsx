import React, { useState, useEffect, useRef } from 'react';
import { ShopeeProduct, NewShopeeProduct } from '../types';
import BaseModal from './ui/BaseModal';
import LoadingSpinner from './ui/LoadingSpinner';
import { Icon } from './icons';
import { scrapeUrlMetadata } from '../utils/linkScraper';
import { useToast } from '../contexts/ToastContext';

interface AddEditShopeeProductModalProps {
  productToEdit: ShopeeProduct | null;
  onClose: () => void;
  // FIX: Replaced non-existent NewProduct | Product types with NewShopeeProduct | ShopeeProduct.
  onSave: (product: NewShopeeProduct | ShopeeProduct) => void | Promise<void>;
}

const AddEditShopeeProductModal: React.FC<AddEditShopeeProductModalProps> = ({ productToEdit, onClose, onSave }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<NewShopeeProduct>({
    title: '',
    price: 0,
    originalPrice: undefined,
    imageUrl: '',
    affiliateLink: '',
    category: 'tech',
    rating: 4.8,
    soldCount: 0,
    discount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title,
        price: productToEdit.price,
        originalPrice: productToEdit.originalPrice,
        imageUrl: productToEdit.imageUrl,
        affiliateLink: productToEdit.affiliateLink,
        category: productToEdit.category,
        rating: productToEdit.rating,
        soldCount: productToEdit.soldCount,
        discount: productToEdit.discount
      });
    } else {
      setFormData({
        title: '',
        price: 0,
        imageUrl: '',
        affiliateLink: '',
        category: 'tech',
        rating: 4.8,
        soldCount: 100,
        discount: 0
      });
    }
  }, [productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: (name === 'price' || name === 'originalPrice' || name === 'soldCount' || name === 'rating' || name === 'discount') ? parseFloat(value) || 0 : value 
    }));
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
            setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
        }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAutoFill = async () => {
      if (!formData.affiliateLink) {
          addToast("Insira um link primeiro.", "warning");
          return;
      }
      
      setIsScraping(true);
      try {
          const data = await scrapeUrlMetadata(formData.affiliateLink);
          
          if (data) {
              setFormData(prev => ({
                  ...prev,
                  title: data.title || prev.title,
                  imageUrl: data.image || prev.imageUrl,
                  price: data.price && data.price > 0 ? data.price : prev.price
              }));
              addToast("Dados importados!", "success");
          }
      } catch (error: any) {
          addToast(error.message || "Erro ao buscar dados.", "error");
      } finally {
          setIsScraping(true); // Manter true ou falso dependendo do feedback
          setIsScraping(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
        if (productToEdit) {
            await onSave({ ...productToEdit, ...formData });
        } else {
            await onSave(formData);
        }
    } catch (error) {
        console.error("Falha ao salvar produto:", error);
    } finally {
        setIsLoading(false);
    }
  };
  
  const isFormValid = formData.title.trim() !== '' && formData.price >= 0 && formData.affiliateLink.trim() !== '';

  return (
    <BaseModal onClose={onClose} titleId="shopee-product-modal-title" containerClassName="max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="p-4 sm:p-6 md:p-8">
            <h2 id="shopee-product-modal-title" className="font-bold text-2xl text-neutral-900 dark:text-white flex items-center gap-2">
              <Icon name="shopping-cart" className="w-6 h-6 text-orange-500" />
              {productToEdit ? 'Editar Achadinho' : 'Adicionar Achadinho Shopee'}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1 text-sm">Configure os detalhes da oferta abaixo.</p>

            <div className="mt-8 space-y-6">
              
              <div>
                <label htmlFor="affiliateLink" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Link de Afiliado (Shopee)</label>
                <div className="flex gap-2">
                    <input id="affiliateLink" name="affiliateLink" type="url" value={formData.affiliateLink} onChange={handleChange} required className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="https://shope.ee/..." />
                    <button
                        type="button"
                        onClick={handleAutoFill}
                        disabled={isScraping || !formData.affiliateLink}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:bg-neutral-600"
                    >
                        {isScraping ? <LoadingSpinner className="w-5 h-5 text-white" /> : <Icon name="download" className="w-5 h-5" />}
                    </button>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1 italic">Nota: Alguns links protegidos podem falhar no preenchimento automático. Se falhar, insira os dados manualmente.</p>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Título do Produto</label>
                    <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ex: Fone Bluetooth" />
                  </div>
                   <div>
                    <label htmlFor="category" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Categoria</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="tech">Tecnologia</option>
                        <option value="home">Casa & Decoração</option>
                        <option value="fashion">Moda</option>
                        <option value="beauty">Beleza</option>
                        <option value="games">Games</option>
                        <option value="kitchen">Cozinha</option>
                    </select>
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div>
                    <label htmlFor="price" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Preço Atual (R$)</label>
                    <input id="price" name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} required className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                   <div>
                    <label htmlFor="originalPrice" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Preço Antigo</label>
                    <input id="originalPrice" name="originalPrice" type="number" step="0.01" min="0" value={formData.originalPrice || ''} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label htmlFor="discount" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">% Desconto</label>
                    <input id="discount" name="discount" type="number" step="1" min="0" max="100" value={formData.discount || ''} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                        <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Imagem (URL)</label>
                         <div className="flex gap-2">
                             <input id="imageUrl" name="imageUrl" type="text" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                             <button type="button" onClick={handleUploadClick} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-300">Upload</button>
                         </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label htmlFor="rating" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Nota (0-5)</label>
                             <input id="rating" name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                        <div>
                             <label htmlFor="soldCount" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Vendas</label>
                             <input id="soldCount" name="soldCount" type="number" min="0" value={formData.soldCount} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                   </div>
               </div>

            </div>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-800/50 px-4 sm:px-8 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-2xl border-t border-neutral-200 dark:border-neutral-800">
            <button type="button" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm font-semibold rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={!isFormValid || isLoading} className="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:bg-neutral-400 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed flex items-center justify-center sm:min-w-[180px]">
              {isLoading ? <LoadingSpinner className="w-5 h-5 text-white" /> : (productToEdit ? 'Salvar Alterações' : 'Adicionar Achadinho')}
            </button>
          </div>
        </form>
    </BaseModal>
  );
};

export default AddEditShopeeProductModal;