
export const OPTIMIZER_WORKER_CODE = `
// Lógica de SEO (Injetada)
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
    return [...new Set(tags)].join(separator || ' ');
};

const getFileBaseName = (fileName) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex < 1) return fileName;
    return fileName.substring(0, lastDotIndex);
};

self.onmessage = async (event) => {
    const { files, settings } = event.data;
    const { quality, maxWidth, maxHeight, isResizingEnabled, renameMode, baseName, separator } = settings;

    let processedCount = 0;
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        try {
            const imageBitmap = await createImageBitmap(file);

            let { width, height } = imageBitmap;
            if (isResizingEnabled && (width > maxWidth || height > maxHeight)) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }
            
            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error("Could not create OffscreenCanvas context");
            }
            ctx.drawImage(imageBitmap, 0, 0, width, height);
            imageBitmap.close();

            const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: quality / 100 });
            
            // Naming Logic
            let fileName;
            if (renameMode === 'smart') {
                 const smartName = getSmartName(file.name, separator);
                 fileName = \`\${smartName}.jpg\`;
            } else if (baseName && baseName.trim() !== '') {
                 fileName = \`\${baseName.trim()}-\${i + 1}.jpg\`;
            } else {
                 const originalBase = getFileBaseName(file.name);
                 fileName = \`\${originalBase}_optimized.jpg\`;
            }

            processedCount++;
            self.postMessage({
                status: 'progress',
                processedCount,
                totalFiles,
                blob,
                originalFileName: fileName
            });

        } catch (e) {
            processedCount++;
            self.postMessage({
                status: 'error',
                processedCount,
                totalFiles,
                originalFileName: file.name,
                error: e.message
            });
        }
    }
};
`;
