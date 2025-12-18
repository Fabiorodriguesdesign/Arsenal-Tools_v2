
import React, { useRef } from 'react';
import { SOCIAL_CHANNELS } from '../data/socialChannels';
import { Icon } from './icons';

const SocialChannelsCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust based on card width + gap
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Nossos Canais</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Siga para acompanhar conteúdos exclusivos</p>
        </div>

        <div className="relative max-w-5xl mx-auto group">
            {/* Navigation Buttons */}
            <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full shadow-md text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                aria-label="Scroll Left"
            >
                <Icon name="chevron-left" className="w-6 h-6" />
            </button>
            
            <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full shadow-md text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                aria-label="Scroll Right"
            >
                <Icon name="chevron-right" className="w-6 h-6" />
            </button>

            {/* Carousel Track */}
            <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4 items-center justify-start md:justify-center"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {SOCIAL_CHANNELS.map((channel) => (
                    <a
                        key={channel.id}
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-64 snap-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-xl group/card"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-orange-400 to-red-600 group-hover/card:rotate-6 transition-transform duration-500">
                                <img 
                                    src={channel.avatarUrl} 
                                    alt={channel.name} 
                                    className="w-full h-full rounded-full object-cover border-2 border-white dark:border-neutral-900" 
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-red-600 text-white p-1 rounded-full border-2 border-white dark:border-neutral-900 shadow-sm">
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <h3 className="font-bold text-neutral-900 dark:text-white truncate max-w-[200px]">{channel.name}</h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{channel.handle}</p>
                            <span className="inline-block mt-3 px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                {channel.category}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default SocialChannelsCarousel;
