
import React, { useRef, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ImageIcon } from './icons';
import { drawImageCover, drawImageContain, trimImage } from '../utils';
import { useLanguage } from '../contexts/LanguageContext';

interface PreviewProps {
  backgroundUrl: string | null;
  foregroundUrl: string | null;
  width: number;
  height: number;
  totalForegrounds: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  padding: number;
  trim?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ backgroundUrl, foregroundUrl, width, height, totalForegrounds, currentIndex, onNext, onPrev, padding, trim = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aspectRatio = width > 0 && height > 0 ? width / height : 1;
  const { t } = useLanguage();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    
    const bgColor = '#18181b'; // zinc-900

    const bgImage = new Image();
    const fgImage = new Image();

    let bgLoaded = !backgroundUrl;
    let fgLoaded = !foregroundUrl;

    const draw = () => {
        if (!bgLoaded || !fgLoaded) return;
        ctx.clearRect(0, 0, width, height);

        if (backgroundUrl) {
            drawImageCover(ctx, bgImage);
        } else {
            // Transparent background if no bg image is provided
        }

        if (foregroundUrl) {
            let imageSource: HTMLImageElement | HTMLCanvasElement = fgImage;
            if (trim) {
                // Apply Trim for preview only if enabled
                const trimmed = trimImage(fgImage);
                if (trimmed) imageSource = trimmed;
            }
            drawImageContain(ctx, imageSource, padding);
        }

        // --- Visualização da Margem (Zona Proibida) ---
        if (padding > 0) {
            ctx.fillStyle = 'rgba(255, 14, 0, 0.15)'; // #ff0e00 com opacidade, mais visível
            
            // Top rect
            ctx.fillRect(0, 0, width, padding);
            // Bottom rect
            ctx.fillRect(0, height - padding, width, padding);
            // Left rect (between top/bottom)
            ctx.fillRect(0, padding, padding, height - (padding * 2));
            // Right rect (between top/bottom)
            ctx.fillRect(width - padding, padding, padding, height - (padding * 2));

            // Dashed Border to separate safe zone from margin
            ctx.strokeStyle = 'rgba(255, 14, 0, 0.6)';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 10]);
            ctx.strokeRect(padding, padding, width - (padding * 2), height - (padding * 2));
            ctx.setLineDash([]); // Reset
        }
    };

    if (backgroundUrl) {
        bgImage.src = backgroundUrl;
        bgImage.onload = () => { bgLoaded = true; draw(); };
        bgImage.onerror = () => { // Handle image load error
            bgLoaded = true;
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
            draw();
        }
    }
    if (foregroundUrl) {
        fgImage.src = foregroundUrl;
        fgImage.onload = () => { fgLoaded = true; draw(); };
        fgImage.onerror = () => { fgLoaded = true; draw(); };
    }
    
    if(!backgroundUrl && !foregroundUrl) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
    } else {
        draw();
    }

  }, [backgroundUrl, foregroundUrl, width, height, padding, trim]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-center justify-center space-y-4 h-full">
      <h3 className="text-lg font-semibold text-zinc-100 self-start">{t('previewTitle')}</h3>
       <div className="w-full flex-grow flex items-center justify-center relative" style={{ aspectRatio: `${aspectRatio}`}}>
        {!foregroundUrl ? (
            <div className="w-full h-full bg-zinc-950/50 rounded-md flex flex-col items-center justify-center text-zinc-500 border border-zinc-800">
                <ImageIcon className="w-16 h-16" />
                <p className="mt-2 text-sm">{t('previewPlaceholder')}</p>
            </div>
        ) : (
             <canvas ref={canvasRef} className="max-w-full max-h-full h-auto w-auto object-contain rounded-md shadow-inner bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMjIyIiAvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMjIyIiAvPjwvc3ZnPg==')] bg-repeat" />
        )}
      </div>

      {totalForegrounds > 1 && (
        <div className="flex items-center justify-between w-full max-w-sm">
          <button onClick={onPrev} className="p-2 rounded-full bg-[#ff0e00] text-white hover:bg-[#e00c00] disabled:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff0e00] focus:ring-offset-2 focus:ring-offset-zinc-900" aria-label={t('previous')}>
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <span className="font-medium text-zinc-200 tabular-nums">{currentIndex + 1} / {totalForegrounds}</span>
          <button onClick={onNext} className="p-2 rounded-full bg-[#ff0e00] text-white hover:bg-[#e00c00] disabled:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff0e00] focus:ring-offset-2 focus:ring-offset-zinc-900" aria-label={t('next')}>
            <ArrowRightIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Preview;
