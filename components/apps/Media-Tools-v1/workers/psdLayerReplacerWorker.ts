
export const PSD_LAYER_REPLACER_WORKER_CODE = `
// Worker Global Scope Stub
self.window = self;

const LIBRARIES = {
    agPsd: [
        'https://unpkg.com/ag-psd@15.0.1/dist/bundle.js',
        'https://cdn.jsdelivr.net/npm/ag-psd@15.0.1/dist/bundle.js'
    ],
    JSZip: [
        'https://unpkg.com/jszip@3.10.1/dist/jszip.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    ]
};

function loadLibrary(name, urls) {
    if (self[name] || (name === 'agPsd' && self.agPsd)) return true;
    let loaded = false;
    for (const url of urls) {
        try {
            importScripts(url);
            if (name === 'agPsd' && typeof self.agPsd !== 'undefined') { loaded = true; break; }
            if (name === 'JSZip' && typeof self.JSZip !== 'undefined') { loaded = true; break; }
        } catch (e) {
            console.warn("Failed to load " + name + " from " + url);
        }
    }
    return loaded;
}

self.onmessage = async (event) => {
    const agPsdLoaded = loadLibrary('agPsd', LIBRARIES.agPsd);
    const jsZipLoaded = loadLibrary('JSZip', LIBRARIES.JSZip);

    if (!agPsdLoaded || !jsZipLoaded) {
        self.postMessage({ status: 'error', error: 'CRITICAL: Libraries failed to load.' });
        return;
    }

    try {
        if (self.agPsd && typeof self.agPsd.initializeCanvas === 'function') {
            self.agPsd.initializeCanvas((width, height) => new OffscreenCanvas(width, height));
        }
    } catch (e) {}

    const { files, folderName, layerName, outputBaseName, checkerboardConfig } = event.data;

    try {
        const masterZip = new self.JSZip();
        let processedCount = 0;
        const totalFiles = files.length;
        const failedFiles = [];

        function createCheckerboard(width, height, squareSize, color1, color2) {
            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext('2d');
            if (!ctx) return canvas;
            ctx.fillStyle = color2;
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = color1;
            for (let x = 0; x < width; x += squareSize) {
                for (let y = 0; y < height; y += squareSize) {
                    if ((Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2 === 0) {
                        ctx.fillRect(x, y, squareSize, squareSize);
                    }
                }
            }
            return canvas;
        }

        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            try {
                const arrayBuffer = await file.arrayBuffer();
                // We read WITHOUT extra resources to minimize corruption chance during write back
                const psd = self.agPsd.readPsd(arrayBuffer, { skipThumbnail: true });
                
                if (!psd || !psd.children) throw new Error("Invalid PSD.");

                let found = false;

                const findAndReplace = (layers) => {
                    for (let j = 0; j < layers.length; j++) {
                        const layer = layers[j];
                        if (layer.name === folderName && layer.children) {
                            for (let k = 0; k < layer.children.length; k++) {
                                const child = layer.children[k];
                                if (child.name === layerName) {
                                    const w = child.width || psd.width;
                                    const h = child.height || psd.height;
                                    
                                    // RECONSTRUCT CLEAN PIXEL LAYER
                                    const cleanLayer = {
                                        name: child.name,
                                        top: child.top || 0,
                                        left: child.left || 0,
                                        opacity: child.opacity ?? 1,
                                        blendMode: child.blendMode || 'normal',
                                        canvas: createCheckerboard(w, h, checkerboardConfig.squareSize, checkerboardConfig.color1, checkerboardConfig.color2),
                                        type: 'layer'
                                    };
                                    
                                    layer.children[k] = cleanLayer;
                                    found = true;
                                    return true;
                                }
                            }
                        }
                        if (layer.children && findAndReplace(layer.children)) return true;
                    }
                    return false;
                };

                findAndReplace(psd.children);
                if (!found) throw new Error("Layer/Folder not found.");

                // Write PSD with generateThumbnail: false to improve compatibility
                const newPsdBuffer = self.agPsd.writePsd(psd, { generateThumbnail: false });
                const safeBase = (outputBaseName || 'modified').trim().replace('.zip', '');
                masterZip.file(safeBase + "-" + (i + 1) + ".psd", newPsdBuffer);
                
                processedCount++;
                self.postMessage({ status: 'progress', progress: Math.round((processedCount/totalFiles)*100), processedCount, totalFiles });
            } catch (e) {
                failedFiles.push(file.name + ": " + e.message);
                processedCount++;
                self.postMessage({ status: 'progress', progress: Math.round((processedCount/totalFiles)*100), processedCount, totalFiles, errors: failedFiles });
            }
        }

        const zipBlob = await masterZip.generateAsync({ type: 'blob' });
        self.postMessage({ status: 'complete', blob: zipBlob, processedCount, totalFiles, errors: failedFiles });

    } catch (e) {
        self.postMessage({ status: 'error', error: e.message });
    }
};
`;
