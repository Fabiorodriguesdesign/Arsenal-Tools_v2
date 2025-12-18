
import React, { useState, useEffect, useRef } from 'react';
import { PortfolioItem, NewPortfolioItem } from '../types';
import { supabasePromise } from '../supabaseClient';
import { Icon } from './icons';
import LoadingSpinner from './ui/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';

const PortfolioManagement: React.FC = () => {
    const { addToast } = useToast();
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
    const [newItem, setNewItem] = useState<NewPortfolioItem>({
        title: '',
        imageUrl: '',
        category: 'Social Media',
        order: 1
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const supabase = await supabasePromise;
            const { data, error } = await supabase
                .from('portfolio_items')
                .select('*')
                .order('order', { ascending: true });
            
            if (error) throw error;
            setItems(data as PortfolioItem[]);
        } catch (error) {
            console.error("Failed to load portfolio items", error);
            addToast('Erro ao carregar portfólio.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const supabase = await supabasePromise;
            if (editingItem) {
                const { error } = await supabase
                    .from('portfolio_items')
                    .update(editingItem)
                    .eq('id', editingItem.id);
                if (error) throw error;
                addToast('Item atualizado com sucesso!', 'success');
            } else {
                const { error } = await supabase
                    .from('portfolio_items')
                    .insert([newItem]);
                if (error) throw error;
                addToast('Novo item adicionado!', 'success');
            }
            
            await fetchItems();
            setEditingItem(null);
            setNewItem({ title: '', imageUrl: '', category: 'Social Media', order: items.length + 1 });
        } catch (error) {
            console.error("Error saving portfolio item", error);
            addToast('Erro ao salvar item.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;
        try {
            const supabase = await supabasePromise;
            await supabase.from('portfolio_items').delete().eq('id', id);
            setItems(prev => prev.filter(i => i.id !== id));
            addToast('Item excluído.', 'success');
        } catch (error) {
            console.error(error);
            addToast('Erro ao excluir item.', 'error');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const result = ev.target?.result as string;
                if (editingItem) {
                    setEditingItem({ ...editingItem, imageUrl: result });
                } else {
                    setNewItem({ ...newItem, imageUrl: result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section className="animate-fade-in">
             <div className="mb-8">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Galeria de Portfólio</h1>
                <p className="text-neutral-600 dark:text-neutral-400">Gerencie as imagens exibidas na página Sobre.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm h-fit">
                    <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-white">
                        {editingItem ? 'Editar Item' : 'Novo Item'}
                    </h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Título</label>
                            <input 
                                type="text"
                                value={editingItem ? editingItem.title : newItem.title}
                                onChange={e => editingItem ? setEditingItem({...editingItem, title: e.target.value}) : setNewItem({...newItem, title: e.target.value})}
                                className="w-full p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Categoria</label>
                            <select
                                value={editingItem ? editingItem.category : newItem.category}
                                onChange={e => editingItem ? setEditingItem({...editingItem, category: e.target.value}) : setNewItem({...newItem, category: e.target.value})}
                                className="w-full p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                            >
                                <option value="Social Media">Social Media</option>
                                <option value="Identity">Identidade Visual</option>
                                <option value="Web">Web Design</option>
                                <option value="Print">Impresso</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Ordem</label>
                            <input 
                                type="number"
                                value={editingItem ? editingItem.order : newItem.order}
                                onChange={e => editingItem ? setEditingItem({...editingItem, order: parseInt(e.target.value)}) : setNewItem({...newItem, order: parseInt(e.target.value)})}
                                className="w-full p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Imagem</label>
                             <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={editingItem ? editingItem.imageUrl : newItem.imageUrl}
                                    onChange={e => editingItem ? setEditingItem({...editingItem, imageUrl: e.target.value}) : setNewItem({...newItem, imageUrl: e.target.value})}
                                    placeholder="URL da imagem"
                                    className="flex-1 p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                                />
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg text-xs font-bold">Upload</button>
                             </div>
                        </div>
                        
                        {(editingItem?.imageUrl || newItem.imageUrl) && (
                            <div className="w-full aspect-video rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                                <img src={editingItem ? editingItem.imageUrl : newItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                             {editingItem && (
                                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-sm text-neutral-500">Cancelar</button>
                             )}
                             <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2">
                                {isSaving && <LoadingSpinner className="w-4 h-4 text-white" />}
                                Salvar
                             </button>
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {items.map(item => (
                        <div key={item.id} className="group relative aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                                <span className="text-xs text-neutral-300 bg-white/10 px-2 py-0.5 rounded">{item.category}</span>
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => setEditingItem(item)} className="p-2 bg-white text-black rounded-full hover:bg-neutral-200"><Icon name="pencil" className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><Icon name="trash" className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">#{item.order}</div>
                        </div>
                    ))}
                    {items.length === 0 && !isLoading && (
                        <div className="col-span-full py-10 text-center text-neutral-500">Nenhum item na galeria.</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PortfolioManagement;
