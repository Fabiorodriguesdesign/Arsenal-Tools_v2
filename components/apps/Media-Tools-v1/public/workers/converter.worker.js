self.onmessage = async (event) => {
    const { files, settings } = event.data;
    const { outputFormat, backgroundColor, keepTransparency } = settings;

    const mimeType = `image/${outputFormat}`;
    const supportsTransparency = ['png', 'webp', 'avif', 'tiff'].includes(outputFormat);
    const needsBackground = !supportsTransparency || !keepTransparency;
    
    let processedCount = 0;
    const totalFiles = files.length;

    for (const file of files) {
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
            
            processedCount++;
            self.postMessage({
                status: 'progress',
                processedCount,
                totalFiles,
                blob,
                originalFileName: file.name
            });

        } catch (e) {
            processedCount++; // Still increment count even on error
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