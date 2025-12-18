
import React from 'react';
import { Tool } from '../../types';
import AnimatedSection from '../AnimatedSection';
import ToolCard from '../ToolCard';

interface HomeToolSectionProps {
    id: string;
    title: string;
    description: string;
    tools: Tool[];
    onNavigate: (route: string) => void;
    onSelect: (tool: Tool) => void;
    onTitleClick: () => void;
}

const HomeToolSection: React.FC<HomeToolSectionProps> = ({ id, title, description, tools, onNavigate, onSelect, onTitleClick }) => {
    if (tools.length === 0) return null;

    return (
        <section id={id} className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-16 animate-fade-in">
                <h2 
                    className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-4 cursor-pointer hover:text-primary transition-colors"
                    onClick={onTitleClick}
                >
                    {title}
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
                    {description}
                </p>
            </div>
            <AnimatedSection className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {tools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} onNavigate={onNavigate} onSelect={() => onSelect(tool)} />
                ))}
            </AnimatedSection>
        </section>
    );
};

export default HomeToolSection;
