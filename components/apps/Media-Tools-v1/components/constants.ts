import { TabCategory, TabItem } from '../types';

export const CATEGORIZED_TABS: TabCategory[] = [
    {
        nameKey: 'imageEditing',
        items: [
            { id: 'elementor-cropp', icon: 'elementor-cropp' },
            { id: 'background', icon: 'background-master' },
            { id: 'psd-generator', icon: 'psd-generator' },
            { id: 'converter', icon: 'converter' },
            { id: 'watermark', icon: 'bubbles' },
            { id: 'optimizer', icon: 'optimizer' },
            { id: 'palette', icon: 'palette-generator' },
        ]
    },
    {
        nameKey: 'fileTools',
        items: [
            { id: 'audio-converter', icon: 'audio-converter' },
            { id: 'zipper', icon: 'zipper' },
            { id: 'img-to-svg', icon: 'img-to-svg' },
            { id: 'img-to-webp', icon: 'img-to-webp' },
            { id: 'renamer', icon: 'renamer' },
            { id: 'svg-to-code', icon: 'code-bracket' },
        ]
    }
];

export const TABS: TabItem[] = CATEGORIZED_TABS.flatMap(category => category.items);