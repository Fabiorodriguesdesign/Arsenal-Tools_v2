
import { trimImage, getFileBaseName, drawImageCover } from '../utils';

interface GeneratePsdOptions {
    foregroundFile: File;
    backgroundFile?: File | null;
    backgroundColor?: string; // Hex color
    padding: number;
    canvasWidth: number;
    canvasHeight: number;
    customFileName?: string;
    trim: boolean;
}

const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Generates a PSD file using dynamic import for the 'ag-psd' library.
 * Part of Phase 54.4: Code Splitting & Bundle Optimization.
 */
export const generatePsd = async ({
    foregroundFile,
    backgroundFile,
    backgroundColor,
    padding,
    canvasWidth,
    canvasHeight,
    customFileName,
    trim
}: GeneratePsdOptions): Promise<{ psdBlob: Blob; previewBlob: Blob; filename: string }> => {
    
    // Dynamic Import to avoid including ag-psd in the main bundle
    // @ts-ignore
    const { writePsd } = await import('ag-psd');

    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = canvasWidth;
    compositeCanvas.height = canvasHeight;
    const ctx = compositeCanvas.getContext('2d');

    if (!ctx) throw new Error("Could not create canvas context");

    const safeBackgroundColor = backgroundColor || '#FFFFFF';
    ctx.fillStyle = safeBackgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (backgroundFile) {
        const bgImg = await loadImage(backgroundFile);
        drawImageCover(ctx, bgImg);
    }

    const fgImg = await loadImage(foregroundFile);
    const imageToProcess: HTMLImageElement | HTMLCanvasElement = trim ? trimImage(fgImg) : fgImg;
    
    let fgWidth = imageToProcess.width;
    let fgHeight = imageToProcess.height;
    
    const paddingX = padding;
    const paddingY = padding;
    const availableWidth = canvasWidth - 2 * paddingX;
    const availableHeight = canvasHeight - 2 * paddingY;
    
    const canvasRatio = availableWidth / availableHeight;
    const imgRatio = fgWidth / fgHeight;
    
    let finalWidth, finalHeight;

    if (imgRatio > canvasRatio) { 
        finalWidth = availableWidth;
        finalHeight = finalWidth / imgRatio;
    } else { 
        finalHeight = availableHeight;
        finalWidth = finalHeight * imgRatio;
    }
    
    const left = Math.round(paddingX + (availableWidth - finalWidth) / 2);
    const top = Math.round(paddingY + (availableHeight - finalHeight) / 2);
    
    ctx.drawImage(imageToProcess, left, top, finalWidth, finalHeight);

    const previewBlob = await new Promise<Blob>((resolve) => {
        compositeCanvas.toBlob((blob) => {
            resolve(blob!);
        }, 'image/jpeg', 0.9);
    });

    const children: any[] = [];

    // 1. Group "BG"
    const solidColorCanvas = document.createElement('canvas');
    solidColorCanvas.width = canvasWidth;
    solidColorCanvas.height = canvasHeight;
    const solidCtx = solidColorCanvas.getContext('2d');
    if (solidCtx) {
        solidCtx.fillStyle = safeBackgroundColor;
        solidCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    children.push({
        name: 'BG',
        opened: false,
        children: [
            {
                name: 'Cor Sólida',
                canvas: solidColorCanvas
            }
        ]
    });

    // 2. Group "IMG BG"
    if (backgroundFile) {
        const bgLayerCanvas = document.createElement('canvas');
        bgLayerCanvas.width = canvasWidth;
        bgLayerCanvas.height = canvasHeight;
        const bgCtx = bgLayerCanvas.getContext('2d');
        if (bgCtx) {
             const bgImg = await loadImage(backgroundFile);
             drawImageCover(bgCtx, bgImg);
        }

        children.push({
            name: 'IMG BG',
            opened: false,
            children: [
                {
                    name: 'Background Image',
                    canvas: bgLayerCanvas
                }
            ]
        });
    }

    // 3. Group "IMG"
    const fgLayerCanvas = document.createElement('canvas');
    fgLayerCanvas.width = Math.round(finalWidth);
    fgLayerCanvas.height = Math.round(finalHeight);
    const fgCtx = fgLayerCanvas.getContext('2d');
    if (fgCtx) {
        fgCtx.drawImage(imageToProcess, 0, 0, fgLayerCanvas.width, fgLayerCanvas.height);
    }

    children.push({
        name: 'IMG',
        opened: false,
        children: [
            {
                name: 'Product',
                canvas: fgLayerCanvas,
                left: left,
                top: top
            }
        ]
    });

    const psdStructure = {
        width: canvasWidth,
        height: canvasHeight,
        children: children
    };

    const buffer = writePsd(psdStructure);
    const psdBlob = new Blob([buffer], { type: 'application/octet-stream' });
    
    let baseName = getFileBaseName(foregroundFile.name);
    if (customFileName && customFileName.trim() !== "") {
        baseName = customFileName.trim();
    }
    
    return {
        psdBlob,
        previewBlob,
        filename: baseName
    };
};
