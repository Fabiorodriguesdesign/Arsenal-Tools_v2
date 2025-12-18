
import React from 'react';
import { Product } from '../types';
import { Icon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { t } = useLanguage();
    const { title, description, price, oldPrice, coverUrl, purchaseUrl, badge, isFeatured } = product;

    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    const formattedOldPrice = oldPrice ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(oldPrice) : null;
    
    // Calcula porcentagem de desconto se houver preço antigo
    const discountPercent = oldPrice && price < oldPrice 
        ? Math.round(((oldPrice - price) / oldPrice) * 100) 
        : null;

    return (
        <a 
            href={purchaseUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative"
        >
            {/* Badges Container */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 items-start">
                {(badge || isFeatured) && (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider ${isFeatured ? 'bg-primary text-white' : 'bg-neutral-800 text-white dark:bg-white dark:text-black'}`}>
                        {badge || t('store.badge.featured')}
                    </span>
                )}
                {discountPercent && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider bg-green-500 text-white">
                        {discountPercent}% OFF
                    </span>
                )}
            </div>

            {/* Image with Zoom Effect */}
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img 
                    src={coverUrl} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="text-white text-sm font-bold px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {t('store.product.viewDetails')}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 flex-grow">
                    {description}
                </p>
                
                {/* Price & Action */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex flex-col">
                        {formattedOldPrice && (
                            <span className="text-xs text-neutral-400 line-through font-medium">{formattedOldPrice}</span>
                        )}
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-neutral-900 dark:text-white">{formattedPrice}</span>
                            {price === 0 && <span className="text-xs font-bold text-green-500 uppercase">Grátis</span>}
                        </div>
                    </div>
                    <div 
                        className="inline-flex items-center justify-center w-10 h-10 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm"
                        aria-label={t('store.product.buyNow')}
                    >
                        <Icon name="shopping-cart" className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                    </div>
                </div>
            </div>
        </a>
    );
};

export default React.memo(ProductCard);
