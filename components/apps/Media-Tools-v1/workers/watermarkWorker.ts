
export const WATERMARK_WORKER_CODE = `
const drawWatermark = (ctx, mainImage, watermarkSource, settings) => {
    const {
        opacity, scale, isRepeating, spacing, rotation, margin, position,
        watermarkType, text, fontFamily, fontSize, textColor,
        isStrokeEnabled, strokeColor, strokeWidth
    } = settings;

    const { width: canvasWidth, height: canvasHeight } = ctx.canvas;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(mainImage, 0, 0, canvasWidth, canvasHeight);
    ctx.globalAlpha = opacity / 100;

    const drawTextWatermark = (x, y) => {
        const finalFontSize = canvasHeight * (fontSize / 1000);
        ctx.font = \`\${finalFontSize}px \${fontFamily}\`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (isStrokeEnabled && strokeWidth > 0) {
            const finalStrokeWidth = finalFontSize / 20 * (strokeWidth / 10);
            ctx.lineWidth = finalStrokeWidth;
            ctx.strokeStyle = strokeColor;
            ctx.strokeText(text, x, y);
        }
        ctx.fillText(text, x, y);
    };

    const getWatermarkDimensions = () => {
        if (watermarkType === 'image' && watermarkSource) {
            const wmWidth = canvasWidth * (scale / 100);
            const wmHeight = (watermarkSource.height / watermarkSource.width) * wmWidth;
            return { wmWidth, wmHeight };
        }
        const finalFontSize = canvasHeight * (fontSize / 1000);
        ctx.font = \`\${finalFontSize}px \${fontFamily}\`;
        const metrics = ctx.measureText(text);
        const wmHeight = finalFontSize * 1.2; 
        const wmWidth = metrics.width + (wmHeight * 0.2); 
        return { wmWidth, wmHeight };
    };

    const { wmWidth, wmHeight } = getWatermarkDimensions();

    if (isRepeating) {
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

        const effectiveSpacingX = wmWidth * (1 + (spacing / 100));
        const effectiveSpacingY = wmHeight * (1 + (spacing / 100));

        for (let y = -wmHeight; y < canvasHeight + wmHeight; y += effectiveSpacingY) {
            for (let x = -wmWidth; x < canvasWidth + wmWidth; x += effectiveSpacingX) {
                if (watermarkType === 'image' && watermarkSource) {
                    ctx.drawImage(watermarkSource, x, y, wmWidth, wmHeight);
                } else {
                    drawTextWatermark(x + wmWidth / 2, y + wmHeight / 2);
                }
            }
        }
        ctx.restore();
    } else {
        const marginPx = canvasWidth * (margin / 100);
        let x = 0, y = 0;
        const [vAlign, hAlign] = position.split('-');

        if (hAlign === 'left') x = marginPx;
        if (hAlign === 'center') x = (canvasWidth - wmWidth) / 2;
        if (hAlign === 'right') x = canvasWidth - wmWidth - marginPx;

        if (vAlign === 'top') y = marginPx;
        if (vAlign === 'center') y = (canvasHeight - wmHeight) / 2;
        if (vAlign === 'bottom') y = canvasHeight - wmHeight - marginPx;

        if (watermarkType === 'image' && watermarkSource) {
            ctx.drawImage(watermarkSource, x, y, wmWidth, wmHeight);
        } else {
            drawTextWatermark(x + wmWidth / 2, y + wmHeight / 2);
        }
    }
    ctx.globalAlpha = 1.0;
};


self.onmessage = async (event) => {
    const { images, watermarkImageFile, settings } = event.data;

    let watermarkBitmap = null;
    if (settings.watermarkType === 'image' && watermarkImageFile) {
        try {
            watermarkBitmap = await createImageBitmap(watermarkImageFile);
        } catch (e) {
            for (const file of images) {
                 self.postMessage({ 
                     status: 'error', 
                     originalFileName: file.name, 
                     error: 'Could not load watermark image.',
                     processedCount: images.indexOf(file) + 1,
                     totalFiles: images.length
                });
            }
            return;
        }
    }

    let processedCount = 0;
    const totalFiles = images.length;

    for (const file of images) {
        try {
            const mainImageBitmap = await createImageBitmap(file);

            const canvas = new OffscreenCanvas(mainImageBitmap.width, mainImageBitmap.height);
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Could not get OffscreenCanvas context.');
            }
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            drawWatermark(ctx, mainImageBitmap, watermarkBitmap, settings);

            const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 });

            processedCount++;
            self.postMessage({
                status: 'progress',
                blob,
                originalFileName: file.name,
                processedCount,
                totalFiles
            });
            mainImageBitmap.close();

        } catch (e) {
            processedCount++;
            self.postMessage({
                status: 'error',
                originalFileName: file.name,
                error: e.message,
                processedCount,
                totalFiles
            });
        }
    }
    
    if (watermarkBitmap) {
      watermarkBitmap.close();
    }
};
`;
