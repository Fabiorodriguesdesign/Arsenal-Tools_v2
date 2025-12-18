

import React from 'react';
import { ResumeData } from '../../../types/resume';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import TechTemplate from './templates/TechTemplate';

interface ResumePreviewProps {
  data: ResumeData;
}

// Wrapper div to ensure full height within the A4 container
const TemplateContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-full h-full min-h-[297mm] bg-white text-black">
        {children}
    </div>
);

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
    if (data.templateId === 'classic') {
        return <TemplateContainer><ClassicTemplate data={data} /></TemplateContainer>;
    }
    if (data.templateId === 'tech') {
        return <TemplateContainer><TechTemplate data={data} /></TemplateContainer>;
    }
    return <TemplateContainer><ModernTemplate data={data} /></TemplateContainer>;
};

export default React.memo(ResumePreview);
