

import { ResumeData } from '../types/resume';
import { generateModernPDF } from './resume/modernTemplate';
import { generateClassicPDF } from './resume/classicTemplate';
import { generateTechPDF } from './resume/techTemplate';

export const generateResumePDF = async (data: ResumeData) => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  if (data.templateId === 'classic') {
    generateClassicPDF(doc, data);
  } else if (data.templateId === 'tech') {
    generateTechPDF(doc, data);
  } else {
    generateModernPDF(doc, data);
  }

  const fileName = `curriculo-${data.personal.fullName.replace(/\s+/g, '-').toLowerCase()}-${data.lang || 'pt'}.pdf`;
  doc.save(fileName);
};