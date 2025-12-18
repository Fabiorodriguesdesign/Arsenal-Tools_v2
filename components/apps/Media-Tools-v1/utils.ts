
// Re-export worker scripts to maintain compatibility with existing imports
export {
    CONVERTER_WORKER_CODE,
    OPTIMIZER_WORKER_CODE,
    WEBP_WORKER_CODE,
    PALETTE_WORKER_CODE,
    WATERMARK_WORKER_CODE,
    ZIPPER_WORKER_CODE,
    ELEMENTOR_CROPP_WORKER_CODE
} from './workerScripts';

export const getFileBaseName = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf('.');
    // If there's no dot, or it's the first character (e.g., ".env"), return the whole name
    if (lastDotIndex < 1) {
        return fileName;
    }
    return fileName.substring(0, lastDotIndex);
};

export const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const canvas = ctx.canvas;
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let sx, sy, sWidth, sHeight;

    if (imgRatio > canvasRatio) { // image is wider than canvas
        sHeight = img.height;
        sWidth = sHeight * canvasRatio;
        sx = (img.width - sWidth) / 2;
        sy = 0;
    } else { // image is taller than canvas
        sWidth = img.width;
        sHeight = sWidth / canvasRatio;
        sy = (img.height - sHeight) / 2;
        sx = 0;
    }
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
};

export const drawImageContain = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | HTMLCanvasElement, padding: number = 0) => {
    const canvas = ctx.canvas;

    // Use absolute pixels for padding directly
    const paddingX = padding;
    const paddingY = padding;

    // Calculate available drawing area
    const availableWidth = canvas.width - 2 * paddingX;
    const availableHeight = canvas.height - 2 * paddingY;
    
    // Safety check: if padding is too large, fallback or draw nothing
    if (availableWidth <= 0 || availableHeight <= 0) {
        return; 
    }

    const canvasRatio = availableWidth / availableHeight;
    const imgRatio = img.width / img.height;
    let dWidth, dHeight, dx, dy;

    if (imgRatio > canvasRatio) { // image is wider than available area
        dWidth = availableWidth;
        dHeight = dWidth / imgRatio;
    } else { // image is taller than or same ratio as available area
        dHeight = availableHeight;
        dWidth = dHeight * imgRatio;
    }

    // Center the image within the available area and add the padding offset
    dx = paddingX + (availableWidth - dWidth) / 2;
    dy = paddingY + (availableHeight - dHeight) / 2;
    
    ctx.drawImage(img, dx, dy, dWidth, dHeight);
};

/**
 * Trims transparent pixels from an image.
 * @param img The source HTMLImageElement.
 * @returns A new HTMLCanvasElement containing the trimmed image.
 */
export const trimImage = (img: HTMLImageElement): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const alpha = data[(y * canvas.width + x) * 4 + 3];
            if (alpha > 0) { // Check for non-transparent pixels
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    if (maxX === -1) { // Image is fully transparent
        const emptyCanvas = document.createElement('canvas');
        emptyCanvas.width = 1;
        emptyCanvas.height = 1;
        return emptyCanvas;
    }

    const trimmedWidth = maxX - minX + 1;
    const trimmedHeight = maxY - minY + 1;
    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimmedWidth;
    trimmedCanvas.height = trimmedHeight;
    const trimmedCtx = trimmedCanvas.getContext('2d')!;
    trimmedCtx.drawImage(canvas, minX, minY, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);
    return trimmedCanvas;
};


// Salva o estado no localStorage com um prefixo
export const saveState = (key: string, state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(`mediaTools_${key}`, serializedState);
    } catch (error) {
        console.warn(`Error saving state for key "${key}":`, error);
    }
};

// Carrega o estado do localStorage
export const loadState = <T>(key: string, defaultState: T): T => {
    try {
        const serializedState = localStorage.getItem(`mediaTools_${key}`);
        if (serializedState === null) {
            return defaultState;
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.warn(`Error loading state for key "${key}":`, error);
        return defaultState;
    }
};

// --- Inline Workers Utility ---
export const createWorker = (workerCode: string) => {
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
};
