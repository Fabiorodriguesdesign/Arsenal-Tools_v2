import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => {
  return (
    <div className="group relative transform transition-transform duration-300 ease-out hover:-translate-y-1 bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-black/50">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full text-primary group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default React.memo(StatCard);