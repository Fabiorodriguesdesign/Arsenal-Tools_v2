import React from 'react';

const ToolCardSkeleton: React.FC = () => {
  return (
    <div 
      className="aspect-square rounded-2xl flex flex-col items-center justify-center p-6 text-center border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
    >
      <div className="animate-pulse flex flex-col items-center justify-center w-full h-full">
        <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-4"></div>
        <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-md mb-2"></div>
        <div className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
      </div>
    </div>
  );
};

export const ToolsGridSkeleton: React.FC = () => {
  return (
    <div className="pb-24">
        <section className={`py-12 md:py-16 bg-white dark:bg-neutral-950`}>
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="mb-8 md:mb-10 animate-pulse border-l-4 border-neutral-200 dark:border-neutral-800 pl-4 md:pl-6">
              <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
              <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded-md mt-3"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <ToolCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
    </div>
  );
};