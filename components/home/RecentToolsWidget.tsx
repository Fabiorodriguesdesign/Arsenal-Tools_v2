
import React from 'react';
import { Tool } from '../../types';
import IconRenderer from '../IconRenderer';
import { Icon } from '../icons';

interface RecentToolsWidgetProps {
    tools: Tool[];
    onToolClick: (tool: Tool) => void;
    onClearHistory: () => void;
}

const RecentToolsWidget: React.FC<RecentToolsWidgetProps> = ({ tools, onToolClick, onClearHistory }) => {
    if (tools.length === 0) return null;

    return (
        <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <Icon name="refresh" className="w-4 h-4" /> Visto Recentemente
                </h3>
                <button onClick={onClearHistory} className="text-xs text-neutral-400 hover:text-red-500 transition-colors" title="Limpar histórico">
                    Limpar
                </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {tools.map(tool => (
                    <div 
                        key={tool.id} 
                        onClick={() => onToolClick(tool)}
                        className="flex-shrink-0 w-28 bg-white dark:bg-neutral-800 rounded-xl p-3 border border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary cursor-pointer transition-all hover:-translate-y-1 group"
                    >
                        <div className="w-8 h-8 mb-2 text-primary bg-primary/10 rounded-lg p-1.5 group-hover:scale-110 transition-transform">
                            <IconRenderer icon={tool.icon} className="w-full h-full" />
                        </div>
                        <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-tight">
                            {tool.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentToolsWidget;
