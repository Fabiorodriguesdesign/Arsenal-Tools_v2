import React, { useRef } from 'react';
import { Position } from './types';

const POSITIONS: Position[] = ['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'];

interface PositionSelectorProps {
    position: Position;
    setPosition: (position: Position) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const PositionSelector: React.FC<PositionSelectorProps> = ({ position, setPosition, t }) => {
    const positionGridRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
        
        e.preventDefault();
        
        const currentIndex = POSITIONS.indexOf(position);
        let nextIndex = -1;
        
        switch (e.key) {
            case 'ArrowRight':
                nextIndex = (currentIndex + 1) % POSITIONS.length;
                break;
            case 'ArrowLeft':
                nextIndex = (currentIndex - 1 + POSITIONS.length) % POSITIONS.length;
                break;
            case 'ArrowDown':
                nextIndex = (currentIndex + 3) % POSITIONS.length;
                break;
            case 'ArrowUp':
                nextIndex = (currentIndex - 3 + POSITIONS.length) % POSITIONS.length;
                break;
        }

        if (nextIndex !== -1) {
            setPosition(POSITIONS[nextIndex]);
            const nextButton = positionGridRef.current?.children[nextIndex] as HTMLElement;
            nextButton?.focus();
        }
    };

    const getAlignmentClasses = (pos: Position) => {
        const [vAlign, hAlign] = pos.split('-');
        const hClasses: { [key: string]: string } = { 'left': 'justify-start', 'center': 'justify-center', 'right': 'justify-end' };
        const vClasses: { [key: string]: string } = { 'top': 'items-start', 'center': 'items-center', 'bottom': 'items-end' };
        return `${hClasses[hAlign]} ${vClasses[vAlign]}`;
    };

    return (
        <div>
            <label id="position-label" className="block text-sm font-medium text-zinc-300 mb-2">{t('position')}</label>
            <div
                ref={positionGridRef}
                onKeyDown={handleKeyDown}
                role="radiogroup"
                aria-labelledby="position-label"
                className="grid grid-cols-3 gap-1.5 p-1.5 bg-zinc-950/50 rounded-lg border border-zinc-800 focus:outline-none"
            >
                {POSITIONS.map(pos => (
                    <button
                        key={pos}
                        onClick={() => setPosition(pos)}
                        role="radio"
                        aria-checked={position === pos}
                        tabIndex={position === pos ? 0 : -1}
                        className={`w-full h-10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#ff0e00] flex p-1.5 ${position === pos ? 'bg-[#ff0e00]' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                        aria-label={`${t('position')} ${pos.replace('-', ' ')}`}
                    >
                        <div className={`w-full h-full flex ${getAlignmentClasses(pos)}`}>
                           <div className={`w-2 h-2 rounded-full ${position === pos ? 'bg-white' : 'bg-zinc-500'}`}></div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PositionSelector;
