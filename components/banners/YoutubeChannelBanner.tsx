
import React from 'react';

interface BannerProps {
    href: string;
    title: string;
    description: string;
    imageUrl?: string;
    handle: string;
}

const YoutubeChannelBanner: React.FC<BannerProps> = ({ href, title, description, imageUrl, handle }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative w-full max-w-sm mx-auto bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center gap-4 overflow-hidden transition-all duration-500 hover:border-red-500/30 dark:hover:border-red-500 hover:shadow-xl hover:shadow-red-500/10 active:scale-[0.99] text-center"
    >
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Avatar */}
        <div className="relative z-10">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-red-500 to-purple-600 group-hover:rotate-6 transition-transform duration-500">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-[#09090b] bg-zinc-100 dark:bg-zinc-800">
                     {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={title} 
                            className="w-full h-full object-cover" 
                            loading="lazy"
                            decoding="async"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📺</div>
                     )}
                </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-red-600 text-white p-1.5 rounded-full border-2 border-white dark:border-[#09090b] shadow-sm">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-grow flex flex-col items-center">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-red-600 transition-colors">
                {handle}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 mb-3 line-clamp-2 px-2">
                {description}
            </p>
             <div className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-6 rounded-full transition-colors shadow-lg shadow-red-500/30 flex items-center gap-2">
                INSCREVER-SE
             </div>
        </div>
    </a>
  );
};

export default YoutubeChannelBanner;