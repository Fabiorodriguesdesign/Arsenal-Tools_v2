import React from 'react';

const SkeletonBlock: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-neutral-200 dark:bg-neutral-800 rounded ${className}`}></div>
);

const SettingsLoadingSkeleton: React.FC = () => (
  <section className="animate-pulse">
    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-300 mb-6">
      <SkeletonBlock className="h-7 w-64" />
    </h2>
    
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 max-w-3xl mb-8">
      <SkeletonBlock className="h-6 w-48 mb-2" />
      <SkeletonBlock className="h-4 w-full max-w-lg mb-6" />

      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <SkeletonBlock className="w-24 h-24 rounded-lg mx-auto" />
        </div>
        <div className="w-full">
          <SkeletonBlock className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 max-w-3xl mb-8">
      <SkeletonBlock className="h-6 w-56 mb-2" />
      <SkeletonBlock className="h-4 w-full max-w-lg mb-6" />
      <div className="space-y-6">
        <div>
          <SkeletonBlock className="h-4 w-32 mb-2" />
          <SkeletonBlock className="h-12 w-full rounded-lg" />
        </div>
        <div>
          <SkeletonBlock className="h-4 w-32 mb-2" />
          <SkeletonBlock className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </section>
);

export default SettingsLoadingSkeleton;
