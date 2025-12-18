

export const ELEMENTOR_CROPP_WORKER_CODE = `
// Lógica de SEO e Limpeza de Nomes (Injetada no Worker)
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

const trimImage = (imageData) => {
    const { width, height, data } = imageData;
    let minX = width, minY = height, maxX = -1, maxY = -1;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    if (maxX === -1) return null; // Image is fully transparent

    return {
        x: minX,
        y: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1
    };
};

self.onmessage = async (event) => {
    const { files, settings } = event.data;
    const { width: targetW, height: targetH, padding, baseName, trim, resizeMode, renameMode, separator } = settings;
    // resizeMode: 'custom' | 'original' | 'fixed-width'
    // renameMode: 'base' (sequencial) | 'smart' (inteligente)
    
    // Check for JSZip
    if (!self.JSZip) {
        try {
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
        } catch (e) {
            self.postMessage({ status: 'error', error: 'Failed to load JSZip' });
            return;
        }
    }

    const zip = new self.JSZip();
    let processedCount = 0;
    const totalFiles = files.length;
    const errors = [];

    for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        try {
            const bitmap = await createImageBitmap(file);
            const { width: imgW, height: imgH } = bitmap;

            // 1. Scan for Trim
            let srcX = 0, srcY = 0, srcW = imgW, srcH = imgH;
            
            if (trim) {
                const scanCanvas = new OffscreenCanvas(imgW, imgH);
                const scanCtx = scanCanvas.getContext('2d');
                scanCtx.drawImage(bitmap, 0, 0);
                const imageData = scanCtx.getImageData(0, 0, imgW, imgH);
                const trimRect = trimImage(imageData);
                
                if (trimRect) {
                    srcX = trimRect.x;
                    srcY = trimRect.y;
                    srcW = trimRect.width;
                    srcH = trimRect.height;
                }
            }

            // 2. Determine Final Dimensions based on Mode
            let finalW, finalH;

            if (resizeMode === 'original') {
                finalW = srcW + (padding * 2);
                finalH = srcH + (padding * 2);
            } else if (resizeMode === 'fixed-width') {
                finalW = targetW;
                const availableW = Math.max(1, finalW - (padding * 2));
                const scale = availableW / srcW;
                finalH = Math.round((srcH * scale) + (padding * 2));
            } else {
                finalW = targetW;
                finalH = targetH;
            }

            // 3. Setup Final Canvas
            const finalCanvas = new OffscreenCanvas(finalW, finalH);
            const ctx = finalCanvas.getContext('2d');
            
            // 4. Calculate Contain Logic (with Padding)
            const availableW = finalW - (padding * 2);
            const availableH = finalH - (padding * 2);
            
            const safeAvailW = Math.max(1, availableW);
            const safeAvailH = Math.max(1, availableH);

            const scale = Math.min(safeAvailW / srcW, safeAvailH / srcH);
            
            const drawW = srcW * scale;
            const drawH = srcH * scale;
            
            const drawX = (finalW - drawW) / 2;
            const drawY = (finalH - drawH) / 2;

            // 5. Draw Trimmed Image Centered
            ctx.drawImage(bitmap, srcX, srcY, srcW, srcH, drawX, drawY, drawW, drawH);
            bitmap.close();

            // 6. Convert to Blob
            const blob = await finalCanvas.convertToBlob({ type: 'image/png' });
            
            // 7. Naming Logic (Smart vs Sequential)
            let fileName;
            if (renameMode === 'smart') {
                 const smartName = getSmartName(file.name, separator);
                 fileName = \`\${smartName}.png\`;
            } else {
                 // Base (Sequencial)
                 const namePrefix = baseName ? baseName.trim() : "imagem";
                 fileName = \`\${namePrefix}-\${i + 1}.png\`;
            }
            
            // Ensure unique names in zip if duplicate (Correct Logic)
            let finalName = fileName;
            let counter = 1;
            const nameWithoutExt = fileName.replace(/\\.png$/i, ''); // Store base name once

            while(zip.file(finalName)) {
                finalName = \`\${nameWithoutExt}_\${counter}.png\`;
                counter++;
            }

            zip.file(finalName, blob);
            processedCount++;

            self.postMessage({ 
                status: 'progress', 
                progress: Math.round((processedCount / totalFiles) * 100),
                processedCount 
            });

        } catch (err) {
            console.error(\`Error processing \${file.name}\`, err);
            errors.push(file.name);
        }
    }

    if (processedCount > 0) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        self.postMessage({ status: 'complete', blob: zipBlob, errors });
    } else {
        self.postMessage({ status: 'error', error: 'No files processed successfully', errors });
    }
};
`;
