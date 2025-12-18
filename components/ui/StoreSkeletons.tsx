
import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Image Placeholder */}
      <div className="relative aspect-[4/3] bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
      
      <div className="p-5 flex flex-col flex-grow space-y-3">
        {/* Title Placeholder */}
        <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4 animate-pulse"></div>
        
        {/* Description Placeholder */}
        <div className="space-y-2">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-full animate-pulse"></div>
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-2/3 animate-pulse"></div>
        </div>
        
        {/* Spacer */}
        <div className="flex-grow"></div>
        
        {/* Price & Action Placeholder */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-16 animate-pulse"></div>
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded-md w-24 animate-pulse"></div>
            </div>
            <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const StoreGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
