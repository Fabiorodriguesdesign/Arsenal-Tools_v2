// OBSOLETE: To be deleted. This functionality has been moved into the Kit Freelancer app.

import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { useTranslation } from '../../hooks/useTranslation';
import { CloseIcon } from './Icons';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBase64: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const CROP_SIZE = 300; // Size of the final square
  const VIEWPORT_SIZE = 280; // Display size in the modal

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
        setImage(img);
        // Initial scale to fit the image
        const minScale = VIEWPORT_SIZE / Math.min(img.width, img.height);
        setScale(minScale);
    };
  }, [imageSrc]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context for clipping
    ctx.save();
    
    // Draw mask (semi-transparent background)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create circular clipping path (for visualization only, actual crop is square for PDF compatibility)
    // However, for resume, square usually looks better or we can round it via CSS. 
    // Let's allow square crop but visualize the center clearly.
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Clear the center part to show "cutout" effect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.rect(centerX - VIEWPORT_SIZE / 2, centerY - VIEWPORT_SIZE / 2, VIEWPORT_SIZE, VIEWPORT_SIZE);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Draw image
    ctx.translate(centerX + offset.x, centerY + offset.y);
    ctx.scale(scale, scale);
    ctx.translate(-image.width / 2, -image.height / 2);
    ctx.drawImage(image, 0, 0);

    ctx.restore();

    // Draw border around crop area
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - VIEWPORT_SIZE / 2, centerY - VIEWPORT_SIZE / 2, VIEWPORT_SIZE, VIEWPORT_SIZE);

  }, [image, scale, offset]);


  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); 
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    if (!image || !canvasRef.current) return;

    // Create an off-screen canvas to extract the cropped image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = CROP_SIZE;
    outputCanvas.height = CROP_SIZE;
    const ctx = outputCanvas.getContext('2d');
    
    if (!ctx) return;

    // Calculate the source rectangle
    // We need to map the viewport coordinates back to the image coordinates
    // The center of the viewport aligns with (centerX + offset.x, centerY + offset.y)
    
    // Effectively: 
    // 1. Center the image
    // 2. Scale it
    // 3. Move it by offset
    
    // To crop, we do the reverse transformations or just draw the image transformed onto the small canvas
    
    // Draw white background first (for transparency safety, though we export JPEG)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CROP_SIZE, CROP_SIZE);

    const centerX = CROP_SIZE / 2;
    const centerY = CROP_SIZE / 2;

    // Logic must match the visualization canvas
    // Vis: CanvasCenter -> Translate(Offset) -> Scale -> Translate(-ImgCenter)
    // Here: CanvasCenter -> Translate(OffsetScaled) -> Scale -> Translate(-ImgCenter)
    
    // Since the output canvas is smaller/different than the preview canvas, we need to adjust the offset relative to scale
    // The preview offset is in screen pixels. 
    
    // Simple approach: Draw exactly as we did in preview but center it on the output canvas
    ctx.translate(centerX + (offset.x / VIEWPORT_SIZE * CROP_SIZE), centerY + (offset.y / VIEWPORT_SIZE * CROP_SIZE));
    // Adjust scale relative to the output size vs viewport size
    const effectiveScale = scale * (CROP_SIZE / VIEWPORT_SIZE);
    ctx.scale(effectiveScale, effectiveScale);
    ctx.translate(-image.width / 2, -image.height / 2);
    
    ctx.drawImage(image, 0, 0);

    // Export as JPEG to reduce size
    const base64 = outputCanvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(base64);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 animate-fadeIn">
      <div className="bg-light-card dark:bg-dark-card rounded-xl p-6 w-full max-w-md flex flex-col gap-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-light-border dark:border-dark-border pb-2">
            <h3 className="font-bold text-lg text-light-text dark:text-dark-text">{t('cropper.title')}</h3>
            <button 
                onClick={onCancel} 
                className="p-1 text-light-muted hover:text-danger rounded focus:outline-none focus:ring-2 focus:ring-danger"
                aria-label={t('common.close')}
            >
                <CloseIcon />
            </button>
        </div>

        <div className="relative w-full h-80 bg-gray-900 rounded-lg overflow-hidden cursor-move touch-none">
            <canvas 
                ref={canvasRef}
                width={400}
                height={320}
                className="w-full h-full object-contain"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            />
        </div>
        
        <div className="space-y-2">
            <label className="text-sm font-medium text-light-muted dark:text-dark-muted" htmlFor="zoom-slider">{t('cropper.zoom')}</label>
            <input 
                id="zoom-slider"
                type="range" 
                min={0.1} 
                max={3} 
                step={0.1} 
                value={scale} 
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                aria-label={t('cropper.zoom')}
            />
            <p className="text-xs text-center text-light-muted dark:text-dark-muted">{t('cropper.instruction')}</p>
        </div>

        <div className="flex gap-3 mt-2">
            <Button variant="secondary" onClick={onCancel} className="w-full">{t('common.cancel')}</Button>
            <Button onClick={handleCrop} className="w-full">{t('common.save')}</Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;