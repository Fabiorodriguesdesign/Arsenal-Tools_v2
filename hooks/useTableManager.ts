
import React, { useState, useMemo, useEffect, ReactNode } from 'react';
import { useDebounce } from './useDebounce'; // Importa o novo hook useDebounce

export type SortDirection = 'ascending' | 'descending';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

// A generic data item type
type DataItem = {
    [key: string]: any;
};

interface UseTableManagerProps<T extends DataItem> {
  initialData: T[];
  itemsPerPage: number;
  initialSortConfig: SortConfig<T>;
  searchableKeys: (keyof T)[];
  toolFilterKey?: keyof T; // Optional key for tool filtering
}

/**
 * @description A generic hook for managing table state including sorting, searching, filtering, and pagination.
 * @template T - The type of data items in the table.
 * @param {UseTableManagerProps<T>} props - Configuration for the table manager.
 * @param {T[]} props.initialData - The raw data to be displayed.
 * @param {number} props.itemsPerPage - Number of items per page for pagination.
 * @param {SortConfig<T>} props.initialSortConfig - The initial sorting configuration.
 * @param {(keyof T)[]} props.searchableKeys - Keys in the data object to search against.
 * @param {keyof T} [props.toolFilterKey] - Optional key for filtering data by a specific value (e.g., tool name).
 * @returns {object} An object containing state and handlers for the table.
 * @property {T[]} paginatedData - The data sliced for the current page.
 * @property {string} searchTerm - The current search term.
 * @property {(term: string) => void} handleSearchChange - Function to update the search term.
 * @property {number} currentPage - The current page number.
 * @property {(page: number) => void} setCurrentPage - Function to set the current page.
 * @property {number} totalPages - The total number of pages.
 * @property {(key: keyof T) => void} requestSort - Function to request sorting by a key.
 * @property {(key: keyof T) => React.ReactNode} getSortIcon - Function to get the sort direction icon for a column.
 * @property {number} filteredDataCount - The total count of items after filtering.
 * @property {string | null} selectedTool - The current filter value for the toolFilterKey.
 * @property {(toolName: string | null) => void} handleToolFilter - Function to set the tool filter.
 */
export const useTableManager = <T extends DataItem>({
  initialData,
  itemsPerPage,
  initialSortConfig,
  searchableKeys,
  toolFilterKey,
}: UseTableManagerProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(initialSortConfig);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Aplica debounce ao searchTerm
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms de debounce

  const sortedAndFilteredData = useMemo(() => {
    let filteredItems = [...initialData];

    // Filter by debounced search term
    if (debouncedSearchTerm && searchableKeys.length > 0) {
      const lowercasedSearchTerm = debouncedSearchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        searchableKeys.some(key =>
          item[key]?.toString().toLowerCase().includes(lowercasedSearchTerm)
        )
      );
    }
    
    // Filter by selected tool if key is provided
    if (selectedTool && toolFilterKey) {
      filteredItems = filteredItems.filter(item => item[toolFilterKey] === selectedTool);
    }
    
    // Sort items
    filteredItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;

        let comparison = 0;
        // Special handling for date strings to make it robust
        if (sortConfig.key === 'date') {
            const timeA = new Date(aValue as string).getTime();
            const timeB = new Date(bValue as string).getTime();
            
            if (isNaN(timeA) && isNaN(timeB)) {
                comparison = 0; // Both are invalid, treat as equal
            } else if (isNaN(timeA)) {
                comparison = 1; // Invalid dates go to the bottom
            } else if (isNaN(timeB)) {
                comparison = -1; // Invalid dates go to the bottom
            } else {
                comparison = timeA - timeB; // Both are valid, compare them
            }
        } else {
            comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true });
        }
        
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });

    return filteredItems;
  }, [initialData, debouncedSearchTerm, searchableKeys, selectedTool, toolFilterKey, sortConfig]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    return sortedAndFilteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedAndFilteredData, currentPage, itemsPerPage]);

  const requestSort = (key: keyof T) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  
  const getSortIcon = (key: keyof T): ReactNode => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };
  
  const handleSearchChange = (term: string) => {
      setSearchTerm(term);
      setCurrentPage(1);
  };
  
  const handleToolFilter = (toolName: string | null) => {
      setSelectedTool(toolName);
      setCurrentPage(1);
  };

  // Effect to reset page if it becomes invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
        setCurrentPage(1);
    }
  }, [currentPage, totalPages]);


  return {
    paginatedData,
    searchTerm, // Retorna o searchTerm sem debounce para o input
    handleSearchChange,
    currentPage,
    setCurrentPage,
    totalPages,
    requestSort,
    getSortIcon,
    filteredDataCount: sortedAndFilteredData.length,
    selectedTool,
    handleToolFilter,
  };
};