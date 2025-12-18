
import React from 'react';

export type Tab = 
  | 'background'
  | 'zipper'
  | 'renamer'
  | 'optimizer'
  | 'converter'
  | 'watermark'
  | 'palette'
  | 'psd-generator'
  | 'psd-layer-replacer' 
  // Fix: Added 'psd-script-master' to the Tab union type.
  | 'psd-script-master'
  | 'svg-to-code'
  | 'img-to-svg'
  | 'img-to-webp'
  | 'elementor-cropp'
  | 'audio-converter';

export interface TabItem {
  id: Tab;
  icon: string; // Changed from React.FC to string
}

export interface TabCategory {
  nameKey: string;
  items: TabItem[];
}

export type AspectRatio = '1:1' | '4:3' | '16:9' | '9:16' | 'Custom';

export type OutputFormat = 'png' | 'jpeg' | 'webp' | 'avif' | 'tiff' | 'zip';

export const ASPECT_RATIOS: { label: AspectRatio; width: number; height: number; custom?: boolean }[] = [
    { label: '1:1', width: 1080, height: 1080 },
    { label: '4:3', width: 1024, height: 768 },
    { label: '16:9', width: 1920, height: 1080 },
    { label: '9:16', width: 1080, height: 1920 },
    { label: 'Custom', width: 0, height: 0, custom: true },
];
