
import { useMemo } from 'react';

export type ProcessedFileItem = File[] | File;

const getFileBaseName = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf('.');
    // If there's no dot, or it's the first character (e.g., ".DS_Store"), return the whole name
    if (lastDotIndex < 1) {
        return fileName;
    }
    return fileName.substring(0, lastDotIndex);
};

export const useFileProcessor = (
    files: File[],
    sortOrder: 'asc' | 'desc',
    isGroupingEnabled: boolean
): ProcessedFileItem[] => {
    const processedItems = useMemo(() => {
        if (files.length === 0) return [];

        if (!isGroupingEnabled) {
            return [...files].sort((a, b) => {
                const compareOptions: Intl.CollatorOptions = { numeric: true, sensitivity: 'base' };
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name, undefined, compareOptions)
                    : b.name.localeCompare(a.name, undefined, compareOptions);
            }); // Returns File[]
        }

        // Grouping is enabled
        const groups: { [key: string]: File[] } = {};
        for (const file of files) {
            const fileBaseName = getFileBaseName(file.name);
            if (!groups[fileBaseName]) {
                groups[fileBaseName] = [];
            }
            groups[fileBaseName].push(file);
        }

        const sortedKeys = Object.keys(groups).sort((a, b) => {
            const compareOptions: Intl.CollatorOptions = { numeric: true, sensitivity: 'base' };
            return sortOrder === 'asc'
                ? a.localeCompare(b, undefined, compareOptions)
                : b.localeCompare(a, undefined, compareOptions);
        });

        return sortedKeys.map(key => groups[key]); // Returns File[][]
    }, [files, sortOrder, isGroupingEnabled]);

    return processedItems as ProcessedFileItem[];
};
