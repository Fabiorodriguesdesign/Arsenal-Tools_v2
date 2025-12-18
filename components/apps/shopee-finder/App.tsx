import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/icons';
import { ShopeeProduct, ShopeeCategory } from './types';
import { SupabaseService } from '@/services/supabaseService';
import { Loading } from '@/components/ui/Loading';

// Mock Data for Categories (Static for now)
const MOCK_CATEGORIES: ShopeeCategory[] = [
    { id: 'tech', name: 'Tecnologia' },
    { id: 'home', name: 'Casa & Decoração' },
    { id: 'fashion', name: 'Moda' },
    { id: 'beauty', name: 'Beleza' },
    { id: 'games', name: 'Games' },
    { id: 'kitchen', name: 'Cozinha' },
];

const App: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [products, setProducts] = useState<ShopeeProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const data = await SupabaseService.getShopeeProducts();
                setProducts(data as any); 
            } catch (error) {
                console.error("Failed to fetch shopee products", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleBackToArsenal = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.hash = '#/'; 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
                              
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    if (isLoading) {
        return <Loading fullScreen text="Carregando ofertas..." />;
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-zinc-200 font-sans pb-20 selection:bg-[#ee4d2d] selection:text-white">
            <header className="relative bg-gradient-to-b from-[#ee4d2d] to-[#c93214] pb-24 pt-8 px-4 shadow-xl overflow-hidden" role="banner">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" aria-hidden="true"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex justify-between items-center mb-12">
                        <div 
                            className="flex items-center gap-3 text-white group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1" 
                            onClick={() => window.location.reload()}
                            role="button"
                            tabIndex={0}
                            aria-label="Shopee Finder Home - Recarregar"
                        >
                            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-lg group-hover:bg-white/30 transition-all duration-300">
                                <Icon name="shopping-cart" className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight leading-none">Shopee Finder</h1>
                                <span className="text-xs text-orange-100 font-medium tracking-wider uppercase opacity-80">Achadinhos VIP</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleBackToArsenal}
                            className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 backdrop-blur-md border border-white/10 hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <Icon name="arrow-left" className="w-4 h-4" />
                            Voltar ao Arsenal
                        </button>
                    </div>

                    <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
                         <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest border border-white/20 mb-2 backdrop-blur-sm shadow-sm" aria-label="Destaque">
                            🔥 As Melhores Ofertas do Dia
                        </div>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
                            Economize Muito nos <br/>
                            <span className="text-orange-100 relative">
                                Seus Achadinhos
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-300 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </h2>
                        
                        <div className="relative group max-w-xl mx-auto transform transition-all duration-300 focus-within:scale-105">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500 group-focus-within:opacity-100"></div>
                            <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                                <div className="pl-6 text-gray-400" aria-hidden="true">
                                    <Icon name="search" className="w-6 h-6" />
                                </div>
                                <label htmlFor="shopee-search" className="sr-only">Buscar produtos na Shopee</label>
                                <input
                                    id="shopee-search"
                                    type="text"
                                    className="block w-full px-4 py-5 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-lg font-medium"
                                    placeholder="O que você está procurando hoje?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="mr-2 bg-[#ee4d2d] text-white px-8 py-3 rounded-full font-bold hover:bg-[#d03e1e] transition-colors shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600">
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 space-y-12" role="main">
                <nav className="flex overflow-x-auto pb-4 gap-3 md:justify-center no-scrollbar mask-gradient-x" aria-label="Categorias de produtos">
                    <button 
                        onClick={() => setActiveCategory('all')}
                        className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg border backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${activeCategory === 'all' ? 'bg-white text-[#ee4d2d] border-transparent scale-105 ring-4 ring-orange-500/20' : 'bg-neutral-900/80 text-zinc-400 border-zinc-700 hover:bg-neutral-800 hover:text-white hover:border-zinc-500'}`}
                        aria-current={activeCategory === 'all' ? 'page' : undefined}
                    >
                        Todos
                    </button>
                    {MOCK_CATEGORIES.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg border backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${activeCategory === cat.id ? 'bg-white text-[#ee4d2d] border-transparent scale-105 ring-4 ring-orange-500/20' : 'bg-neutral-900/80 text-zinc-400 border-zinc-700 hover:bg-neutral-800 hover:text-white hover:border-zinc-500'}`}
                            aria-current={activeCategory === cat.id ? 'page' : undefined}
                        >
                            {cat.name}
                        </button>
                    ))}
                </nav>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6" aria-live="polite">
                    {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                        <a 
                            key={product.id} 
                            href={product.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-neutral-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-lg hover:shadow-2xl hover:shadow-orange-900/20 hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col h-full relative focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                            aria-label={`Ver oferta de ${product.title}. Preço: ${formatCurrency(product.price)}`}
                        >
                             {product.discount && (
                                <div className="absolute top-3 left-3 z-10 bg-[#ee4d2d] text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md shadow-lg" aria-label={`Desconto de ${product.discount} por cento`}>
                                    {product.discount}% OFF
                                </div>
                            )}

                            <div className="relative aspect-[4/5] overflow-hidden bg-white">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100" aria-hidden="true">
                                    <Icon name="image" className="w-12 h-12 opacity-20" />
                                </div>
                                <img 
                                    src={product.imageUrl} 
                                    alt="" 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                     <span className="text-white font-bold text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                                        Ver Oferta
                                     </span>
                                </div>
                            </div>
                            
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-sm font-medium text-zinc-100 line-clamp-2 mb-2 leading-snug group-hover:text-[#ee4d2d] transition-colors">
                                    {product.title}
                                </h3>
                                
                                <div className="mt-auto space-y-3">
                                    <div className="flex items-center gap-1.5" aria-label={`Avaliação de ${product.rating} estrelas`}>
                                        <div className="flex text-yellow-400 text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-700 fill-current'}`} viewBox="0 0 20 20" aria-hidden="true">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-zinc-500 font-medium px-1.5 py-0.5 bg-zinc-800 rounded">{product.soldCount} vendidos</span>
                                    </div>

                                    <div className="flex items-end justify-between border-t border-zinc-800 pt-3">
                                        <div className="flex flex-col">
                                            {product.originalPrice && (
                                                <span className="text-xs text-zinc-500 line-through mb-0.5" aria-label="Preço original">
                                                    {formatCurrency(product.originalPrice)}
                                                </span>
                                            )}
                                            <span className="text-lg font-bold text-[#ee4d2d]" aria-label="Preço atual">
                                                {formatCurrency(product.price)}
                                            </span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-[#ee4d2d] flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform" aria-hidden="true">
                                            <Icon name="arrow-right" className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    )) : (
                        <div className="col-span-full py-20 text-center text-zinc-500" role="status">
                             <p className="text-lg">Nenhum produto encontrado para "{searchTerm}".</p>
                        </div>
                    )}
                </div>

                <div className="text-center pt-8 pb-12">
                    <button className="bg-neutral-800 text-zinc-300 px-8 py-3 rounded-xl hover:bg-neutral-700 hover:text-white transition-all font-semibold shadow-lg border border-zinc-700 hover:border-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                        Carregar Mais Ofertas
                    </button>
                </div>
            </main>
            
            <footer className="border-t border-zinc-800 mt-12 py-8 text-center text-zinc-500 text-sm" role="contentinfo">
                <p>&copy; {new Date().getFullYear()} Shopee Finder. As melhores ofertas selecionadas.</p>
            </footer>
        </div>
    );
};

export default App;