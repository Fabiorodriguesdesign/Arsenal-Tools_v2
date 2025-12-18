import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TrashIcon } from '../icons';

type Position = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type WatermarkType = 'image' | 'text';

interface WatermarkSettings {
    position: Position;
    scale: number;
    opacity: number;
    margin: number;
    isRepeating: boolean;
    spacing: number;
    rotation: number;
    watermarkType: WatermarkType;
    text: string;
    fontFamily: string;
    fontSize: number;
    textColor: string;
    isStrokeEnabled: boolean;
    strokeColor: string;
    strokeWidth: number;
}

interface WatermarkPreviewProps {
    mainImageFile: File;
    watermarkImageFile: File | null;
    settings: WatermarkSettings;
    t: (key: string) => string;
}

const WatermarkPreview: React.FC<WatermarkPreviewProps> = ({ mainImageFile, watermarkImageFile, settings, t }) => {
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const [mainImageBitmap, setMainImageBitmap] = useState<ImageBitmap | null>(null);
    const [watermarkImageBitmap, setWatermarkImageBitmap] = useState<ImageBitmap | null>(null);

    // Load ImageBitmaps from files
    useEffect(() => {
        let isCancelled = false;
        
        const loadImages = async () => {
            if (mainImageFile) {
                const mainBitmap = await createImageBitmap(mainImageFile);
                if (!isCancelled) setMainImageBitmap(mainBitmap);
            }
            if (watermarkImageFile && settings.watermarkType === 'image') {
                const watermarkBitmap = await createImageBitmap(watermarkImageFile);
                if (!isCancelled) setWatermarkImageBitmap(watermarkBitmap);
            } else {
                if (watermarkImageBitmap) watermarkImageBitmap.close();
                setWatermarkImageBitmap(null); // Clear if not an image watermark
            }
        };

        loadImages();

        return () => {
            isCancelled = true;
            if (mainImageBitmap) mainImageBitmap.close();
            if (watermarkImageBitmap) watermarkImageBitmap.close();
            setMainImageBitmap(null);
            setWatermarkImageBitmap(null);
        };
    }, [mainImageFile, watermarkImageFile, settings.watermarkType]);


    const draw = useCallback(() => {
        const canvas = previewCanvasRef.current;
        const mainImage = mainImageBitmap;
        if (!canvas || !mainImage) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const { 
            position, scale, opacity, margin, isRepeating, spacing, rotation, 
            watermarkType, text, fontFamily, fontSize, textColor,
            isStrokeEnabled, strokeColor, strokeWidth 
        } = settings;

        // Resize canvas to fit container while maintaining aspect ratio
        const parent = canvas.parentElement;
        if (parent) {
            const { clientWidth: parentWidth, clientHeight: parentHeight } = parent;
            const imgRatio = mainImage.width / mainImage.height;
            let canvasWidth = parentWidth;
            let canvasHeight = parentWidth / imgRatio;

            if (canvasHeight > parentHeight) {
                canvasHeight = parentHeight;
                canvasWidth = parentHeight * imgRatio;
            }
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
        }


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(mainImage, 0, 0, canvas.width / zoom, canvas.height / zoom);
        
        const effectiveCanvasWidth = canvas.width / zoom;
        const effectiveCanvasHeight = canvas.height / zoom;

        // --- Watermark Drawing Logic ---
        ctx.globalAlpha = opacity / 100;
        
        const drawTextWatermark = (x: number, y: number) => {
            const finalFontSize = effectiveCanvasHeight * (fontSize / 1000);
            ctx.font = `${finalFontSize}px ${fontFamily}`;
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
             if (watermarkType === 'image' && watermarkImageBitmap) {
                const wmWidth = effectiveCanvasWidth * (scale / 100);
                const wmHeight = (watermarkImageBitmap.height / watermarkImageBitmap.width) * wmWidth;
                return { wmWidth, wmHeight };
            }
            const finalFontSize = effectiveCanvasHeight * (fontSize / 1000);
            ctx.font = `${finalFontSize}px ${fontFamily}`;
            const metrics = ctx.measureText(text);
            const wmHeight = finalFontSize * 1.2;
            const wmWidth = metrics.width + (wmHeight * 0.2);
            return { wmWidth, wmHeight };
        };

        const { wmWidth, wmHeight } = getWatermarkDimensions();
        
        if (isRepeating) {
             const spaceBetween = effectiveCanvasWidth * (spacing / 100);
             ctx.save();
             ctx.translate(effectiveCanvasWidth / 2, effectiveCanvasHeight / 2);
             ctx.rotate(rotation * Math.PI / 180);
             ctx.translate(-effectiveCanvasWidth / 2, -effectiveCanvasHeight / 2);
            
            for (let y = -wmHeight; y < effectiveCanvasHeight + wmHeight; y += (wmHeight + spaceBetween)) {
                for (let x = -wmWidth; x < effectiveCanvasWidth + wmWidth; x += (wmWidth + spaceBetween)) {
                    if (watermarkType === 'image' && watermarkImageBitmap) {
                        ctx.drawImage(watermarkImageBitmap, x, y, wmWidth, wmHeight);
                    } else {
                        drawTextWatermark(x + wmWidth / 2, y + wmHeight / 2);
                    }
                }
            }
            ctx.restore();
        } else {
            const marginPx = effectiveCanvasWidth * (margin / 100);
            let x = 0, y = 0;
            const [vAlign, hAlign] = position.split('-');
            
            if (hAlign === 'left') x = marginPx;
            if (hAlign === 'center') x = (effectiveCanvasWidth - wmWidth) / 2;
            if (hAlign === 'right') x = effectiveCanvasWidth - wmWidth - marginPx;

            if (vAlign === 'top') y = marginPx;
            if (vAlign === 'center') y = (effectiveCanvasHeight - wmHeight) / 2;
            if (vAlign === 'bottom') y = effectiveCanvasHeight - wmHeight - marginPx;
            
            if (watermarkType === 'image' && watermarkImageBitmap) {
                ctx.drawImage(watermarkImageBitmap, x, y, wmWidth, wmHeight);
            } else {
                drawTextWatermark(x + wmWidth / 2, y + wmHeight / 2);
            }
        }
        ctx.globalAlpha = 1.0;
        ctx.restore(); // Restore from zoom/pan
    }, [mainImageBitmap, watermarkImageBitmap, settings, zoom, pan]);

    // Redraw whenever something changes
    useEffect(() => {
        draw();
    }, [draw]);


    const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = previewCanvasRef.current;
        if (!canvas) return;

        const scaleAmount = 1.1;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - pan.x) / zoom;
        const worldY = (mouseY - pan.y) / zoom;

        let newZoom = zoom;
        if (e.deltaY < 0) newZoom *= scaleAmount;
        else newZoom /= scaleAmount;
        newZoom = Math.max(0.1, Math.min(newZoom, 10));

        const newPanX = mouseX - worldX * newZoom;
        const newPanY = mouseY - worldY * newZoom;

        setZoom(newZoom);
        setPan({
            x: newPanX,
            y: newPanY
        });
    }, [zoom, pan]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMousePosition.current.x;
        const dy = e.clientY - lastMousePosition.current.y;
        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
    }, [isDragging]);

    const handleMouseUpOrLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const resetView = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    return (
        <div className="w-full bg-zinc-950/50 rounded-md flex items-center justify-center p-2 border border-zinc-800 min-h-[200px] relative">
            <canvas 
                ref={previewCanvasRef} 
                className="max-w-full max-h-[400px] h-auto w-auto object-contain rounded-sm cursor-grab active:cursor-grabbing" 
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                aria-label={t('watermarkPreviewImage')}
            />
            {zoom !== 1 || pan.x !== 0 || pan.y !== 0 ? (
                <button
                    onClick={resetView}
                    className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff0e00]"
                    aria-label={t('resetView')}
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            ) : null}
        </div>
    );
};

export default WatermarkPreview;