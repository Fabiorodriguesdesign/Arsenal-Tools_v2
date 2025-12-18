
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useSiteContent } from '../contexts/SiteContentContext';
import { CONTACT_PHOTO_URL } from '../constants';
import { Icon } from './icons';
import AnimatedSection from './AnimatedSection';
import DeveloperSection from './DeveloperSection';
import CommunitySection from './CommunitySection';
import { PortfolioItem } from '../types';
import { supabasePromise } from '../supabaseClient';
import LoadingSpinner from './ui/LoadingSpinner';
import { cn } from '../utils/shared';

const AboutPage: React.FC = () => {
  const { siteContent } = useSiteContent();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
        try {
            const supabase = await supabasePromise;
            const { data } = await supabase.from('portfolio_items').select('*').order('order', { ascending: true });
            if (data) setPortfolioItems(data as PortfolioItem[]);
        } catch (error) {
            console.error("Error fetching portfolio:", error);
        } finally {
            setLoadingPortfolio(false);
        }
    };
    fetchPortfolio();
  }, []);
  
  // Efeito para gerenciar o scroll e a tecla 'Escape' para o lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setZoomedImage(null);
        }
    };

    if (zoomedImage) {
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
    } else {
        document.body.style.overflow = 'auto';
    }

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'auto';
    };
  }, [zoomedImage]);

  const categories = ['Todos', ...Array.from(new Set(portfolioItems.map(item => item.category)))];
  const filteredItems = activeCategory === 'Todos' ? portfolioItems : portfolioItems.filter(item => item.category === activeCategory);

  const milestones = [
    { year: '2018', title: 'O Início', description: 'Iniciei minha jornada no design gráfico, apaixonado por criar identidades visuais e resolver problemas visuais.' },
    { year: '2020', title: 'Expansão', description: 'Fundei minha primeira agência, atendendo clientes em todo o Brasil e aprimorando processos criativos.' },
    { year: '2024', title: 'Automação', description: 'Comecei a desenvolver packs de design para plataformas e percebi o poder da escala e da automação.' },
    { year: '2025', title: 'Arsenal Tools', description: 'Lancei o Arsenal Tools para democratizar o acesso a ferramentas de produtividade de elite.' },
    { year: '2026', title: 'O Futuro', description: 'Construindo soluções e ferramentas inteligentes para ajudar profissionais a escalar seus negócios digitais.' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col font-sans transition-colors duration-300">
      <Header logo={siteContent.logo_svg} />
      
      <main className="flex-grow pt-32 md:pt-40 pb-20">
        
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-16">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                    <Icon name="sparkles" className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-orange-500">A Mente por trás do Arsenal</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight leading-tight mb-6">
                    Transformando <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Caos Criativo</span> <br/> em Resultados Digitais.
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                    Olá, sou Fabio Rodrigues. Designer, Desenvolvedor e Criador de Conteúdo. Minha missão é eliminar o trabalho braçal da sua rotina para que você possa focar no que realmente importa: criar.
                </p>
            </div>
        </section>

        {/* Profile & Stats */}
        <section className="container mx-auto px-6 mb-24">
            <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl p-8 md:p-12 border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
                <div className="flex-shrink-0 relative">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full p-2 bg-gradient-to-br from-primary to-purple-600 shadow-2xl">
                        <img 
                            src={CONTACT_PHOTO_URL} 
                            alt="Fabio Rodrigues" 
                            className="w-full h-full object-cover rounded-full border-4 border-white dark:border-neutral-900"
                            fetchPriority="high"
                            loading="eager"
                        />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-white dark:bg-neutral-800 p-3 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 flex items-center gap-2">
                         <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                         <span className="text-xs font-bold text-neutral-800 dark:text-white">Open to Work</span>
                    </div>
                </div>
                
                <div className="flex-grow space-y-8 text-center md:text-left">
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
                            <h3 className="text-3xl font-bold text-primary mb-1">8+</h3>
                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Anos de XP</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
                            <h3 className="text-3xl font-bold text-primary mb-1">270k+</h3>
                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Seguidores</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 col-span-2 md:col-span-1">
                            <h3 className="text-3xl font-bold text-primary mb-1">1k+</h3>
                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Clientes Atendidos</p>
                        </div>
                     </div>
                     <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                        Acredito que a tecnologia deve servir à criatividade, não o contrário. O Arsenal Tools nasceu da minha própria necessidade de otimizar processos repetitivos no Photoshop e na gestão de projetos. Hoje, compartilho essas soluções com milhares de profissionais.
                     </p>
                     
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <a href="https://www.instagram.com/fabiorodriguesdsgn/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-primary hover:border-primary transition-all shadow-sm hover:shadow-md group" title="@fabiorodriguesdsgn">
                            <Icon name="instagram" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </a>
                         <a href="https://www.instagram.com/fabiodicastop/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-primary hover:border-primary transition-all shadow-sm hover:shadow-md group" title="@fabiodicastop">
                            <Icon name="instagram" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://www.youtube.com/@fabiorodriguesdesign" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 text-red-600 hover:text-red-500 hover:border-red-500 transition-all shadow-sm hover:shadow-md group" title="YouTube">
                            <svg className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                        </a>
                     </div>
                </div>
            </div>
        </section>
        
        {/* Gallery Section */}
        <section className="container mx-auto px-6 mb-24">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Portfólio em Destaque</h2>
                <div className="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-lg' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loadingPortfolio ? (
                <div className="flex justify-center py-20"><LoadingSpinner /></div>
            ) : filteredItems.length > 0 ? (
                <div className="columns-2 md:columns-4 gap-4 space-y-4">
                    {filteredItems.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => setZoomedImage(item.imageUrl)}
                            className="group relative rounded-xl overflow-hidden cursor-pointer bg-neutral-100 dark:bg-neutral-800/50 break-inside-avoid"
                        >
                            <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <p className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</p>
                                <span className="text-xs text-neutral-300 uppercase tracking-wider">{item.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-neutral-500">Nenhum projeto encontrado nesta categoria.</div>
            )}
        </section>

        {/* Timeline Journey */}
        <section className="container mx-auto px-6 mb-24 max-w-4xl">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Minha Jornada</h2>
                <div className="w-20 h-1.5 bg-primary mx-auto mt-5 rounded-full"></div>
            </div>
            
            <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
                <div className="space-y-12">
                    {milestones.map((item, index) => {
                        const isLeft = index % 2 === 0;
                        return (
                            <AnimatedSection key={index} delay={index * 100}>
                                <div className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`w-[calc(50%-2rem)] relative ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1">
                                             <div className={`flex flex-col gap-2 mb-3 ${isLeft ? 'items-end' : 'items-start'}`}>
                                                <time className="font-mono text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">{item.year}</time>
                                                <div className="font-extrabold text-neutral-900 dark:text-white text-xl md:text-2xl">{item.title}</div>
                                            </div>
                                            <div className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg leading-relaxed">
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white dark:border-neutral-950 bg-primary shadow-lg z-10"></div>
                                </div>
                            </AnimatedSection>
                        );
                    })}
                </div>
            </div>
        </section>

        <div className="container mx-auto px-4 space-y-12">
            <DeveloperSection />
            <CommunitySection />
        </div>

      </main>

      <Footer />

      {/* Lightbox para imagem */}
      {zoomedImage && (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Imagem em tela cheia"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
            onClick={() => setZoomedImage(null)}
        >
            <div
                className="relative max-w-4xl max-h-[90vh] animate-scale-in"
                onClick={(e) => e.stopPropagation()} 
            >
                <img
                    src={zoomedImage}
                    alt="Portfolio item em destaque"
                    className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
                 <button
                    onClick={() => setZoomedImage(null)}
                    className="absolute -top-4 -right-4 bg-white dark:bg-neutral-800 text-black dark:text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Fechar imagem"
                >
                    <Icon name="x" className="w-6 h-6" />
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default AboutPage;