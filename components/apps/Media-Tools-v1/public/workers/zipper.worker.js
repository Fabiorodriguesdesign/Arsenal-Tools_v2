// public/workers/zipper.worker.js

// Carrega a biblioteca JSZip a partir da CDN.
try {
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
} catch (e) {
    self.postMessage({ status: 'error', error: 'Could not load JSZip library.' });
}

// Utilitário para obter o nome base do arquivo, replicado de utils.ts
const getFileBaseName = (fileName) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex < 1) {
        return fileName;
    }
    return fileName.substring(0, lastDotIndex);
};

const handleZipTask = async (files, settings) => {
    const { baseName, sortOrder } = settings;

    // 1. Agrupar arquivos
    const groups = {};
    for (const file of files) {
        const fileBaseName = getFileBaseName(file.name);
        if (!groups[fileBaseName]) {
            groups[fileBaseName] = [];
        }
        groups[fileBaseName].push(file);
    }

    // 2. Ordenar grupos
    const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
        const compareOptions = { numeric: true, sensitivity: 'base' };
        return sortOrder === 'asc' 
            ? a.localeCompare(b, undefined, compareOptions) 
            : b.localeCompare(a, undefined, compareOptions);
    });
    
    // 3. Criar ZIPs
    const masterZip = new self.JSZip();
    let processedCount = 0;
    const totalGroups = sortedGroupKeys.length;

    for (let i = 0; i < totalGroups; i++) {
        const groupKey = sortedGroupKeys[i];
        const group = groups[groupKey];
        const individualZip = new self.JSZip();
        
        for (const file of group) {
            individualZip.file(file.name, file);
        }

        const individualZipBlob = await individualZip.generateAsync({ type: 'blob' });
        
        const zipFileName = baseName.trim()
            ? `${baseName.trim()}${i + 1}.zip`
            : `${groupKey}.zip`;

        masterZip.file(zipFileName, individualZipBlob);

        processedCount++;
        self.postMessage({ 
            status: 'progress', 
            value: Math.round((processedCount / totalGroups) * 100),
            processedCount,
            totalFiles: totalGroups
        });
    }

    const masterZipBlob = await masterZip.generateAsync({ type: 'blob' });
    self.postMessage({ status: 'complete', blob: masterZipBlob });
};

const handleRenameTask = async (files, settings) => {
    const { baseName, sortOrder, isGroupingEnabled } = settings;

    // 1. Processar e ordenar itens
    let itemsToProcess;
    if (!isGroupingEnabled) {
        itemsToProcess = [...files].sort((a, b) => {
             const compareOptions = { numeric: true, sensitivity: 'base' };
             return sortOrder === 'asc'
                ? a.name.localeCompare(b.name, undefined, compareOptions)
                : b.name.localeCompare(a.name, undefined, compareOptions);
        });
    } else {
        const groups = {};
        for (const file of files) {
            const fileName = getFileBaseName(file.name);
            if (!groups[fileName]) groups[fileName] = [];
            groups[fileName].push(file);
        }
        const sortedKeys = Object.keys(groups).sort((a, b) => {
            const compareOptions = { numeric: true, sensitivity: 'base' };
            return sortOrder === 'asc' 
                ? a.localeCompare(b, undefined, compareOptions) 
                : b.localeCompare(a, undefined, compareOptions);
        });
        itemsToProcess = sortedKeys.map(key => groups[key]);
    }

    // 2. Criar o ZIP com arquivos renomeados
    const zip = new self.JSZip();
    let processedCount = 0;
    const totalItems = itemsToProcess.length;

    for (let i = 0; i < totalItems; i++) {
        const sequenceNumber = i + 1;

        if (isGroupingEnabled) {
            const group = itemsToProcess[i]; // group is File[]
            for (const file of group) {
                const fileParts = file.name.split('.');
                const extension = fileParts.length > 1 ? fileParts.pop() : '';
                const newFileName = extension ? `${baseName.trim()}${sequenceNumber}.${extension}` : `${baseName.trim()}${sequenceNumber}`;
                zip.file(newFileName, file);
            }
        } else {
            const file = itemsToProcess[i]; // file is File
            const fileParts = file.name.split('.');
            const extension = fileParts.length > 1 ? fileParts.pop() : '';
            const newFileName = extension ? `${baseName.trim()}${sequenceNumber}.${extension}` : `${baseName.trim()}${sequenceNumber}`;
            zip.file(newFileName, file);
        }
        
        processedCount++;
        self.postMessage({ 
            status: 'progress', 
            value: Math.round((processedCount / totalItems) * 100),
            processedCount,
            totalFiles: totalItems
        });
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    self.postMessage({ status: 'complete', blob: zipBlob });
};

self.onmessage = async (event) => {
    const { task, files, settings } = event.data;

    try {
        if (!self.JSZip) {
             throw new Error("JSZip library not loaded.");
        }

        if (task === 'zip') {
            await handleZipTask(files, settings);
        } else if (task === 'rename') {
            await handleRenameTask(files, settings);
        } else {
            throw new Error(`Unknown task: ${task}`);
        }
    } catch (e) {
        self.postMessage({ status: 'error', error: e.message });
    }
};