
// Declaração global para a biblioteca carregada via CDN
declare var ImageTracer: any;

interface VectorizationOptions {
    colors?: number;
    blur?: number;
    scale?: number;
    removeBackground?: boolean;
    trim?: boolean;
    ltres?: number;
    qtres?: number;
    pathomit?: number;
    colorquantcycles?: number;
}

const getCornerColorHex = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(null);
                    return;
                }
                ctx.drawImage(img, 0, 0, 1, 1);
                const pixelData = ctx.getImageData(0, 0, 1, 1).data;
                // Formata para #RRGGBB
                const hex = "#" + ("000000" + ((pixelData[0] << 16) | (pixelData[1] << 8) | pixelData[2]).toString(16)).slice(-6).toUpperCase();
                resolve(hex);
            };
            img.onerror = () => resolve(null);
            img.src = event.target?.result as string;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
};

// Função para recortar o canvas (remover transparência)
const trimCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    let minX = w, minY = h, maxX = -1, maxY = -1;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const alpha = data[(y * w + x) * 4 + 3];
            if (alpha > 0) { // Se não for transparente
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    if (maxX === -1) return canvas; // Imagem totalmente transparente

    const trimmedWidth = maxX - minX + 1;
    const trimmedHeight = maxY - minY + 1;

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimmedWidth;
    trimmedCanvas.height = trimmedHeight;
    const trimmedCtx = trimmedCanvas.getContext('2d');
    
    if (trimmedCtx) {
        trimmedCtx.drawImage(canvas, minX, minY, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);
    }
    
    return trimmedCanvas;
};


export const vectorizeImage = async (file: File, options?: VectorizationOptions): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        if (typeof ImageTracer === 'undefined') {
            reject(new Error("ImageTracer library not loaded."));
            return;
        }

        let backgroundColorToRemove: string | null = null;
        if (options?.removeBackground) {
            backgroundColorToRemove = await getCornerColorHex(file);
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                let processingCanvas = document.createElement('canvas');
                processingCanvas.width = img.width;
                processingCanvas.height = img.height;
                const ctx = processingCanvas.getContext('2d');
                
                if (!ctx) {
                     reject(new Error("Could not create canvas"));
                     return;
                }
                
                ctx.drawImage(img, 0, 0);

                // Aplica o TRIM físico se solicitado
                if (options?.trim) {
                    processingCanvas = trimCanvas(processingCanvas);
                }

                // Converte de volta para data URL para o ImageTracer
                const processedImgData = processingCanvas.toDataURL('image/png');
                
                const config = {
                    numberofcolors: options?.colors || 16,
                    blurradius: options?.blur || 0,
                    scale: options?.scale || 1,
                    strokewidth: 0,
                    viewbox: true, // Sempre usa viewbox para SVG responsivo
                    ltres: options?.ltres ?? 1,
                    qtres: options?.qtres ?? 1,
                    pathomit: options?.pathomit ?? 8,
                    colorquantcycles: options?.colorquantcycles ?? 4,
                };

                try {
                    ImageTracer.imageToSVG(processedImgData, (svgString: string) => {
                        let finalSvg = svgString;
                        if (backgroundColorToRemove) {
                            const regex = new RegExp(`<path[^>]*fill="${backgroundColorToRemove}"[^>]*\/>`, 'ig');
                            finalSvg = finalSvg.replace(regex, '');
                        }
                        resolve(finalSvg);
                    }, config);
                } catch (e) {
                    reject(e);
                }
            };
            img.src = event.target?.result as string;
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
};
