
export type BackgroundMode = 'color' | 'gradient' | 'pattern';

export interface GradientSettings {
    from: string;
    to: string;
    angle: number; // 0, 45, 90, 135
}

export interface PatternSettings {
    type: 'checkerboard' | 'stripes' | 'dots';
    color1: string;
    color2: string;
    scale: number;
}

export interface BackgroundSettings {
    mode: BackgroundMode;
    solidColor: string;
    gradient: GradientSettings;
    pattern: PatternSettings;
}
