
import React from 'react';
import { Icon } from '@/components/icons';
import { TabItem } from '../../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ToolCardProps {
    tab: TabItem & { label: string, landingDescription: string };
    onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tab, onClick }) => {
    const { t } = useLanguage();
    return (
        <div 
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col items-start gap-4 transition-all duration-300 hover:border-[#ff0e00] hover:shadow-2xl hover:shadow-[#ff0e00]/10 hover:-translate-y-1 cursor-pointer"
            onClick={onClick}
        >
            <div className="bg-[#ff0e00]/10 p-3 rounded-lg">
                <Icon name={tab.icon} className="w-8 h-8 text-[#ff0e00]" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100">{tab.label}</h3>
            <p className="text-zinc-400 flex-grow">{tab.landingDescription}</p>
            <div
                className="flex items-center justify-center gap-2 mt-2 bg-[#ff0e00] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#e00c00] transition-all duration-300 transform w-full"
            >
                {t('accessTool')}
                <Icon name="arrow-right" className="w-5 h-5" />
            </div>
        </div>
    );
};

export default ToolCard;
