
import React, { useState, useEffect, useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Product } from '../types';
import { SupabaseService } from '../services/supabaseService';
import { Icon } from './icons';
import ProductCard from './ProductCard';
import { StoreGridSkeleton } from './ui/StoreSkeletons';
import { useLanguage } from '../contexts/LanguageContext';

const StorePage: React.FC = () => {
    const { siteContent } = useSiteContent();
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('todos');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            // Pequeno delay artificial para evitar flash de loading se for muito rápido,
            // mas mantendo a sensação de carregamento robusto
            const minLoadingTime = new Promise(resolve => setTimeout(resolve, 500));
            
            try {
                const [data] = await Promise.all([
                    SupabaseService.getProducts(),
                    minLoadingTime
                ]);
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Kaizen: Deep Linking Logic
    useEffect(() => {
        const hash = window.location.hash; // ex: #/store?search=biblia
        const queryIndex = hash.indexOf('?');
        
        if (queryIndex !== -1) {
            const queryString = hash.substring(queryIndex + 1);
            const params = new URLSearchParams(queryString);
            
            const searchParam = params.get('search');
            const categoryParam = params.get('category');

            if (searchParam) {
                setSearchQuery(decodeURIComponent(searchParam));
            }
            
            if (categoryParam) {
                setSelectedCategory(categoryParam);
            }
        }
    }, []);

    // Kaizen: Dynamic SEO Title
    useEffect(() => {
        const baseTitle = 'Arsenal Store';
        if (selectedCategory && selectedCategory !== 'todos') {
            const categoryName = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
            document.title = `${categoryName} | ${baseTitle}`;
        } else {
            document.title = `${t('store.title')} | Arsenal Tools`;
        }
    }, [selectedCategory, t]);

    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return ['todos', ...Array.from(cats)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
            const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col font-sans transition-colors duration-300">
            <Header logo={siteContent.logo_svg} />
            
            <main className="flex-grow pt-24 pb-20">
                {/* Hero Store */}
                <section className="container mx-auto px-4 md:px-8 mb-12">
                     <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-black dark:from-neutral-900 dark:via-black dark:to-neutral-900 rounded-[2rem] p-8 md:p-14 text-center text-white shadow-2xl shadow-neutral-500/20 dark:shadow-black/50 relative overflow-hidden">
                        {/* Background Decorativo */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6 animate-fade-in">
                                <Icon name="sparkles" className="w-4 h-4 text-yellow-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-white/90">{t('store.hero.tag')}</span>
                             </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight animate-slide-in-up">
                                {t('store.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">{t('store.titleSuffix')}</span>
                            </h1>
                            <p className="text-neutral-300 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                                {t('store.subtitle')}
                            </p>
                            
                             {/* Search Bar */}
                            <div className="mt-10 w-full max-w-lg relative group animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary transition-colors">
                                    <Icon name="search" className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('store.searchPlaceholder')}
                                    className="block w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 backdrop-blur-md transition-all shadow-lg"
                                />
                            </div>
                        </div>
                     </div>
                </section>

                {/* Filters */}
                <section className="container mx-auto px-4 md:px-8 mb-10 sticky top-20 z-20">
                     <div className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl py-4 -mx-4 px-4 md:mx-0 md:px-0 md:rounded-2xl md:border md:border-neutral-200 md:dark:border-neutral-800 md:shadow-sm">
                        <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar md:justify-center">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold capitalize transition-all whitespace-nowrap border ${
                                        selectedCategory === cat 
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25 transform scale-105' 
                                        : 'bg-transparent border-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                    }`}
                                >
                                    {cat === 'todos' ? t('store.filter.all') : cat}
                                </button>
                            ))}
                        </div>
                     </div>
                </section>

                {/* Products Grid */}
                <section className="container mx-auto px-4 md:px-8 min-h-[400px]">
                    {isLoading ? (
                        <StoreGridSkeleton />
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-24 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 animate-fade-in flex flex-col items-center justify-center">
                             <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                                <Icon name="shopping-cart" className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
                             </div>
                             <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{t('store.empty.title')}</h3>
                             <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">{t('store.empty.subtitle')}</p>
                             <button 
                                onClick={() => { setSearchQuery(''); setSelectedCategory('todos'); }} 
                                className="mt-8 px-6 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
                             >
                                {t('store.filter.clear')}
                             </button>
                         </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default StorePage;
