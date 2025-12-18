self.onmessage = async (event) => {
    const { files, settings } = event.data;
    const { quality, maxWidth, maxHeight, isResizingEnabled } = settings;

    let processedCount = 0;
    const totalFiles = files.length;

    for (const file of files) {
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