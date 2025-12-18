
import { getFileBaseName, drawImageCover, drawImageContain, trimImage } from '../utils';
import { OutputFormat } from '../types';
import { generateSmartName } from '../utils/seo';

declare var JSZip: any;

interface ProcessingSettings {
    width: number;
    height: number;
    outputFormat: OutputFormat;
    padding: number;
    renameMode?: 'base' | 'smart';
    baseName?: string;
    separator?: string;
    trim?: boolean;
    keepOriginalName?: boolean; // Nova propriedade
}

// Helper to load an image and return it, or null if it fails
const loadImage = (file: File): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
        const image = new Image();
        const url = URL.createObjectURL(file);
        image.src = url;
        image.onload = () => {
            URL.revokeObjectURL(url);
            resolve(image);
        };
        image.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(null);
        };
    });
};

export const generateSingleImageWithBackground = async (
    backgroundFile: File,
    foregroundFile: File,
    settings: ProcessingSettings,
    onProgress: (p: number) => void
): Promise<{ blob: Blob | null; fileName: string; extension: string }> => {
    onProgress(0);

    const bgImage = await loadImage(backgroundFile);
    if (!bgImage) {
        throw new Error("errorLoadingBackground");
    }
    onProgress(25);

    const fgImage = await loadImage(foregroundFile);
    if (!fgImage) {
        return { blob: null, fileName: foregroundFile.name, extension: '' };
    }
    onProgress(50);

    const canvas = document.createElement('canvas');
    canvas.width = settings.width;
    canvas.height = settings.height;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, settings.width, settings.height);
    drawImageCover(ctx, bgImage);
    
    // Lógica condicional de Trim
    let imageSource: HTMLImageElement | HTMLCanvasElement = fgImage;
    if (settings.trim !== false) { // Default true
        const trimmed = trimImage(fgImage);
        if (trimmed) imageSource = trimmed;
    }

    drawImageContain(ctx, imageSource, settings.padding);
    onProgress(75);

    let fileName;
    if (settings.renameMode === 'smart') {
        fileName = generateSmartName(foregroundFile.name, settings.separator || ' ');
    } else if (settings.keepOriginalName) {
        // Prioridade para manter nome original
        fileName = getFileBaseName(foregroundFile.name);
    } else if (settings.baseName) {
        fileName = settings.baseName;
    } else {
        fileName = getFileBaseName(foregroundFile.name);
    }

    const mimeType = `image/${settings.outputFormat === 'png' ? 'png' : 'jpeg'}`;
    const quality = mimeType === 'image/jpeg' ? 0.9 : undefined;
    const extension = settings.outputFormat === 'png' ? 'png' : 'jpg';

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, mimeType, quality));
    onProgress(100);

    return { blob, fileName, extension };
};


export const generateBatchImagesWithBackground = async (
    backgroundFile: File,
    foregroundFiles: File[],
    settings: ProcessingSettings,
    onProgress: (p: number, processedCount: number, totalFiles: number) => void,
    onFileError: (fileName: string) => void
): Promise<Blob | null> => {
    onProgress(0, 0, foregroundFiles.length);
    const zip = new JSZip();

    const bgImage = await loadImage(backgroundFile);
    if (!bgImage) {
        throw new Error("errorLoadingBackground");
    }

    let totalProcessed = 0;
    const CHUNK_SIZE = 5;
    let generatedFileCount = 0;
    const totalFilesToProcess = foregroundFiles.length;

    for (let i = 0; i < foregroundFiles.length; i += CHUNK_SIZE) {
        const chunk = foregroundFiles.slice(i, i + CHUNK_SIZE);
        const chunkProcessingPromises = chunk.map(async (file, idxInChunk) => {
            const globalIndex = i + idxInChunk;
            const fgImage = await loadImage(file);
            if (!fgImage) {
                onFileError(file.name);
                return null;
            }

            const canvas = document.createElement('canvas');
            canvas.width = settings.width;
            canvas.height = settings.height;
            const ctx = canvas.getContext('2d')!;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.clearRect(0, 0, settings.width, settings.height);
            drawImageCover(ctx, bgImage);

            // Lógica condicional de Trim
            let imageSource: HTMLImageElement | HTMLCanvasElement = fgImage;
            if (settings.trim !== false) {
                 const trimmed = trimImage(fgImage);
                 if (trimmed) imageSource = trimmed;
            }

            drawImageContain(ctx, imageSource, settings.padding);

            // Naming Logic for Batch
            let fileName;
            if (settings.renameMode === 'smart') {
                 fileName = generateSmartName(file.name, settings.separator || ' ');
            } else if (settings.keepOriginalName) {
                 // Mantém nome original
                 fileName = getFileBaseName(file.name);
            } else if (settings.baseName) {
                 fileName = `${settings.baseName}-${globalIndex + 1}`;
            } else {
                 fileName = getFileBaseName(file.name);
            }

            const mimeType = `image/${settings.outputFormat === 'jpeg' || settings.outputFormat === 'zip' ? 'jpeg' : 'png'}`;
            const quality = mimeType === 'image/jpeg' ? 0.9 : undefined;
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, mimeType, quality));

            return {
                blob,
                fileName,
                originalFile: file,
                extension: settings.outputFormat === 'jpeg' || settings.outputFormat === 'zip' ? 'jpg' : 'png',
            };
        });

        const chunkResults = (await Promise.all(chunkProcessingPromises)).filter((result): result is NonNullable<typeof result> => result !== null);

        for (const result of chunkResults) {
            if (result.blob) {
                generatedFileCount++;
                
                // Duplicate check
                let finalName = `${result.fileName}.${result.extension}`;
                if (zip.file(finalName)) {
                     finalName = `${result.fileName}-${generatedFileCount}.${result.extension}`;
                }

                zip.file(finalName, result.blob);
                if (settings.outputFormat === 'zip') {
                    zip.file(result.originalFile.name, result.originalFile);
                }
            }
        }

        totalProcessed += chunk.length;
        onProgress(Math.round((totalProcessed / totalFilesToProcess) * 100), totalProcessed, totalFilesToProcess);
    }

    if (generatedFileCount > 0) {
        return zip.generateAsync({ type: 'blob' });
    }

    return null;
};
