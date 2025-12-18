
import React from 'react';
import { Tool } from '../../types';
import { Icon } from '../icons';
import AnimatedSection from '../AnimatedSection';
import ToolCard from '../ToolCard';

interface FavoritesWidgetProps {
    tools: Tool[];
    onNavigate: (route: string) => void;
    onSelect: (tool: Tool) => void;
}

const FavoritesWidget: React.FC<FavoritesWidgetProps> = ({ tools, onNavigate, onSelect }) => {
    if (tools.length === 0) return null;

    return (
        <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <Icon name="star" className="w-4 h-4 text-yellow-500" /> Meus Favoritos
                </h3>
            </div>
             <AnimatedSection className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} onNavigate={onNavigate} onSelect={() => onSelect(tool)} />
                ))}
            </AnimatedSection>
        </div>
    );
};

export default FavoritesWidget;
