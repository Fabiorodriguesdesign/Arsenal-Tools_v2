export type Position = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type WatermarkType = 'image' | 'text';

export interface WatermarkSettings {
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
