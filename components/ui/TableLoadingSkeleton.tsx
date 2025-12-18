import React from 'react';

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse">
    <td className="p-4"><div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded"></div></td>
    <td className="p-4"><div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded"></div></td>
    <td className="p-4 hidden sm:table-cell"><div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded"></div></td>
    <td className="p-4 hidden md:table-cell"><div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded"></div></td>
    <td className="p-4 hidden lg:table-cell"><div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded"></div></td>
  </tr>
);

const TableLoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            <th className="p-4"><div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div></th>
            <th className="p-4"><div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700 rounded"></div></th>
            <th className="p-4 hidden sm:table-cell"><div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded"></div></th>
            <th className="p-4 hidden md:table-cell"><div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div></th>
            <th className="p-4 hidden lg:table-cell"><div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded"></div></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLoadingSkeleton;