
export const ZIPPER_WORKER_CODE = `
try {
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
} catch (e) {
    self.postMessage({ status: 'error', error: 'Could not load JSZip library.' });
}

// Replicando lógica de limpeza simples para o worker
const STOPWORDS = ['a','o','as','os','um','uma','uns','umas','de','do','da','dos','das','em','no','na','nos','nas','por','pelo','pela','para','pra','com','sem','sob','sobre','e','ou','nem','mas','que','se','v1','v2','v3','final','copy','copia','teste','temp','draft','img','image','imagem','dsc','pic','screen','shot','screenshot','whatsapp','image','unknown','untitled','sem','titulo'];

const toTitleCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const getSmartName = (fileName, separator) => {
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    const normalized = nameWithoutExt.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
    const withSpaces = normalized.replace(/[-_.]/g, ' ');
    const cleanString = withSpaces.replace(/[^a-zA-Z0-9\\s]/g, '');
    const words = cleanString.split(/\\s+/);
    const tags = words
        .filter(word => word.length > 1 && !STOPWORDS.includes(word.toLowerCase()) && !/^\\d+$/.test(word))
        .map(word => toTitleCase(word));
    return [...new Set(tags)].join(separator);
};

const getFileBaseName = (fileName) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex < 1) {
        return fileName;
    }
    return fileName.substring(0, lastDotIndex);
};

const handleZipTask = async (files, settings) => {
    const { baseName, sortOrder } = settings;

    const groups = {};
    for (const file of files) {
        const fileBaseName = getFileBaseName(file.name);
        if (!groups[fileBaseName]) {
            groups[fileBaseName] = [];
        }
        groups[fileBaseName].push(file);
    }

    const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
        const compareOptions = { numeric: true, sensitivity: 'base' };
        return sortOrder === 'asc' 
            ? a.localeCompare(b, undefined, compareOptions) 
            : b.localeCompare(a, undefined, compareOptions);
    });
    
    const masterZip = new self.JSZip();
    let processedCount = 0;
    const totalGroups = sortedGroupKeys.length;

    for (let i = 0; i < totalGroups; i++) {
        const groupKey = sortedGroupKeys[i];
        const group = groups[groupKey];
        const individualZip = new self.JSZip();
        
        for (const file of group) {
            // Check for duplicates inside individual zip
            let fileName = file.name;
            let counter = 1;
            while(individualZip.file(fileName)) {
                const parts = file.name.split('.');
                const ext = parts.length > 1 ? parts.pop() : '';
                const base = parts.join('.');
                fileName = \`\${base}_\${counter}.\${ext}\`;
                counter++;
            }
            individualZip.file(fileName, file);
        }

        const individualZipBlob = await individualZip.generateAsync({ type: 'blob' });
        
        let zipFileName = baseName.trim()
            ? \`\${baseName.trim()}\${i + 1}.zip\`
            : \`\${groupKey}.zip\`;
            
        // Check for duplicates in master zip
        let counter = 1;
        while(masterZip.file(zipFileName)) {
            zipFileName = zipFileName.replace('.zip', \`_\${counter}.zip\`);
            counter++;
        }

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
    const { baseName, sortOrder, isGroupingEnabled, renameMode, separator } = settings;
    // renameMode: 'base' (sequencial) | 'smart' (individual)

    let itemsToProcess;
    
    if (!isGroupingEnabled || renameMode === 'smart') {
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

    const zip = new self.JSZip();
    let processedCount = 0;
    const totalItems = itemsToProcess.length;
    let globalCounter = 1; // Used for sequential naming across all files in smart mode if collisions occur heavily

    for (let i = 0; i < totalItems; i++) {
        const sequenceNumber = i + 1;

        if (renameMode === 'smart') {
             const file = itemsToProcess[i]; // file is File
             const fileParts = file.name.split('.');
             const extension = fileParts.length > 1 ? fileParts.pop() : '';
             
             let smartName = getSmartName(file.name, separator || ' ');
             let newFileName = extension ? \`\${smartName}.\${extension}\` : smartName;
             
             // Collision Check
             let counter = 1;
             while(zip.file(newFileName)) {
                 newFileName = extension ? \`\${smartName}_\${counter}.\${extension}\` : \`\${smartName}_\${counter}\`;
                 counter++;
             }
             
             zip.file(newFileName, file);

        } else {
            // SEQUENTIAL MODE
            if (isGroupingEnabled) {
                const group = itemsToProcess[i]; 
                for (let j = 0; j < group.length; j++) {
                    const file = group[j];
                    const fileParts = file.name.split('.');
                    const extension = fileParts.length > 1 ? fileParts.pop() : '';
                    
                    // Group suffix if multiple files in group
                    const groupSuffix = group.length > 1 ? \`_\${j+1}\` : '';
                    let newFileName = extension 
                        ? \`\${baseName.trim()}\${sequenceNumber}\${groupSuffix}.\${extension}\` 
                        : \`\${baseName.trim()}\${sequenceNumber}\${groupSuffix}\`;
                    
                    // Safety Collision Check
                    let counter = 1;
                    while(zip.file(newFileName)) {
                         newFileName = newFileName.replace(\`.\${extension}\`, \`_\${counter}.\${extension}\`);
                         counter++;
                    }

                    zip.file(newFileName, file);
                }
            } else {
                const file = itemsToProcess[i]; 
                const fileParts = file.name.split('.');
                const extension = fileParts.length > 1 ? fileParts.pop() : '';
                let newFileName = extension ? \`\${baseName.trim()}\${sequenceNumber}.\${extension}\` : \`\${baseName.trim()}\${sequenceNumber}\`;
                
                // Safety Collision Check
                let counter = 1;
                while(zip.file(newFileName)) {
                    newFileName = extension ? \`\${baseName.trim()}\${sequenceNumber}_\${counter}.\${extension}\` : \`\${baseName.trim()}\${sequenceNumber}_\${counter}\`;
                    counter++;
                }

                zip.file(newFileName, file);
            }
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
            throw new Error(\`Unknown task: \${task}\`);
        }
    } catch (e) {
        self.postMessage({ status: 'error', error: e.message });
    }
};
`;
