
export const WEBP_WORKER_CODE = `
self.onmessage = async (event) => {
    const { files, settings } = event.data;
    const { quality, width, height, isResizingEnabled, isDimensionsLinked } = settings;

    let processedCount = 0;
    const totalFiles = files.length;

    for (const file of files) {
        try {
            const imageBitmap = await createImageBitmap(file);

            let finalWidth = imageBitmap.width;
            let finalHeight = imageBitmap.height;

            if (isResizingEnabled) {
                // Se dimensões alvo não forem fornecidas, mantém original
                const targetW = width || finalWidth;
                const targetH = height || finalHeight;

                if (isDimensionsLinked) {
                    // Modo "Contain" (Linkado): Redimensiona para caber dentro da caixa WxH mantendo proporção
                    const scale = Math.min(targetW / finalWidth, targetH / finalHeight);
                    // Se a escala for > 1 (upscaling), podemos limitar ou permitir. Aqui permitimos.
                    finalWidth = Math.round(finalWidth * scale);
                    finalHeight = Math.round(finalHeight * scale);
                } else {
                    // Modo "Stretch" (Deslinkado): Força exatamente as dimensões fornecidas
                    finalWidth = targetW;
                    finalHeight = targetH;
                }
            }
            
            const canvas = new OffscreenCanvas(finalWidth, finalHeight);
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error("Could not create OffscreenCanvas context");
            }

            // Melhor qualidade de redimensionamento
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(imageBitmap, 0, 0, finalWidth, finalHeight);
            imageBitmap.close();

            const blob = await canvas.convertToBlob({ type: 'image/webp', quality: quality / 100 });
            
            processedCount++;
            self.postMessage({
                status: 'progress',
                processedCount,
                totalFiles,
                blob,
                originalFileName: file.name
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
