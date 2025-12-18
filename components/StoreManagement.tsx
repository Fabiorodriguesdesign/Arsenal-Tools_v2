
import React, { useState, useEffect, useMemo } from 'react';
import { Product, NewProduct } from '../types';
import { SupabaseService } from '../services/supabaseService';
import { Icon } from './icons';
import LoadingSpinner from './ui/LoadingSpinner';
import { useModal } from '../contexts/ModalContext';
import { useToast } from '../contexts/ToastContext';
import AddEditProductModal from './AddEditProductModal';

const StoreManagement: React.FC = () => {
    const { addToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await SupabaseService.getProducts();
            setProducts(data); 
        } catch (error) {
            console.error("Failed to load products", error);
            addToast('Erro ao carregar produtos.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleSave = async (productData: NewProduct | Product) => {
        try {
            if ('id' in productData) {
                await SupabaseService.updateProduct(productData as Product);
                addToast('Produto atualizado com sucesso!', 'success');
            } else {
                await SupabaseService.addProduct(productData as NewProduct);
                addToast('Produto criado com sucesso!', 'success');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            addToast('Erro ao salvar produto.', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await SupabaseService.deleteProduct(id);
                setProducts(prev => prev.filter(p => p.id !== id));
                addToast('Produto excluído.', 'success');
            } catch (error) {
                console.error(error);
                addToast('Erro ao excluir produto.', 'error');
            }
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    return (
        <section className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Gerenciador da Loja</h1>
                    <p className="mt-1 text-neutral-600 dark:text-neutral-400">Adicione e edite produtos digitais e afiliados.</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                         <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <Icon name="search" className="w-4 h-4" />
                        </div>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-sm font-semibold text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 whitespace-nowrap"
                    >
                        <Icon name="plus" className="w-4 h-4" />
                        Novo Produto
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner className="w-10 h-10"/>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div key={product.id} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm group hover:shadow-lg dark:hover:shadow-black/50 transition-all duration-300">
                                <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800">
                                    <img src={product.coverUrl} alt={product.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        {product.isFeatured && <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">DESTAQUE</span>}
                                        {!product.active && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">INATIVO</span>}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{product.category}</span>
                                        <span className="text-sm font-bold text-neutral-900 dark:text-white">R$ {product.price.toFixed(2)}</span>
                                    </div>
                                    <h3 className="font-bold text-neutral-900 dark:text-white mb-1 line-clamp-1" title={product.title}>{product.title}</h3>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 h-8">{product.description}</p>
                                    
                                    <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                         <button 
                                            onClick={() => openEditModal(product)}
                                            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Icon name="pencil" className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-neutral-500 hover:text-red-600 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                                            title="Excluir"
                                        >
                                            <Icon name="trash" className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="col-span-full py-20 text-center bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
                            <Icon name="shopping-cart" className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                            <p className="text-neutral-600 dark:text-neutral-400 font-semibold">Nenhum produto encontrado.</p>
                            <p className="text-sm text-neutral-500">Adicione produtos para começar a vender.</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <AddEditProductModal 
                    productToEdit={editingProduct} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSave} 
                />
            )}
        </section>
    );
};

export default StoreManagement;
