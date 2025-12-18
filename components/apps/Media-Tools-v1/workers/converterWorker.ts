
export const CONVERTER_WORKER_CODE = `
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
    const { outputFormat, backgroundColor, keepTransparency, renameMode, baseName, separator } = settings;

    const mimeType = \`image/\${outputFormat}\`;
    const supportsTransparency = ['png', 'webp', 'avif', 'tiff'].includes(outputFormat);
    const needsBackground = !supportsTransparency || !keepTransparency;
    
    let processedCount = 0;
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        try {
            const imageBitmap = await createImageBitmap(file);
            const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Could not get OffscreenCanvas context.');
            }

            if (needsBackground) {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(imageBitmap, 0, 0);
            imageBitmap.close();

            const blob = await canvas.convertToBlob({ type: mimeType, quality: 0.9 });
            
            // Naming Logic
            let fileName;
            let extension = outputFormat;
            if (outputFormat === 'jpeg') extension = 'jpg';

            if (renameMode === 'smart') {
                 const smartName = getSmartName(file.name, separator);
                 fileName = \`\${smartName}.\${extension}\`;
            } else if (baseName && baseName.trim() !== '') {
                 fileName = \`\${baseName.trim()}-\${i + 1}.\${extension}\`;
            } else {
                 const originalBase = getFileBaseName(file.name);
                 fileName = \`\${originalBase}.\${extension}\`;
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
