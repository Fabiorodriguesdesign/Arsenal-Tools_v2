
import React from 'react';
import { ResumeData } from '../../../types/resume';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import TechTemplate from './templates/TechTemplate';

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
    if (data.templateId === 'classic') {
        return <ClassicTemplate data={data} />;
    }
    if (data.templateId === 'tech') {
        return <TechTemplate data={data} />;
    }
    return <ModernTemplate data={data} />;
};

export default ResumePreview;
