import type { jsPDF } from 'jspdf';
import { ResumeData } from '../../types/resume';
import { getResumeLabel, translateLevel } from './resumeTranslations';

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    return `${month}/${year}`;
};

export const generateClassicPDF = (doc: jsPDF, data: ResumeData) => {
    const primaryColor = data.primaryColor || '#1a1a1a';
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const lang = data.lang || 'pt';
    
    let currentY = 20;

    // --- Photo (Optional) ---
    if (data.personal.photo) {
        try {
            const imgSize = 30;
            const imgX = pageWidth / 2 - imgSize / 2;
            
            // --- Stable Square Image Rendering ---
            // The clip() function is unstable. Replaced with a simple square image
            // to ensure the PDF generates correctly without missing text.
            doc.addImage(data.personal.photo, 'JPEG', imgX, currentY, imgSize, imgSize);
            
            // Add a clean border with the primary color
            doc.setDrawColor(primaryColor);
            doc.setLineWidth(0.5);
            doc.rect(imgX, currentY, imgSize, imgSize);

            currentY += imgSize + 8;
        } catch (e) {
            console.error("Error adding image to classic template", e);
        }
    }

    // --- Header ---
    doc.setTextColor(primaryColor);
    doc.setFontSize(22);
    doc.setFont('times', 'bold');
    doc.text(data.personal.fullName.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 8;
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.setFont('times', 'bold');
    doc.text(data.personal.jobTitle.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 6;
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.setTextColor(0, 0, 0);
    
    // Contact Line
    const contactParts = [];
    if(data.personal.email) contactParts.push(data.personal.email);
    if(data.personal.phone) contactParts.push(data.personal.phone);
    if(data.personal.location) contactParts.push(data.personal.location);
    if(data.personal.linkedin) contactParts.push(data.personal.linkedin.replace(/^https?:\/\//, ''));
    
    const contactLine = contactParts.join('  •  ');
    doc.text(contactLine, pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 4;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    
    currentY += 10;

    // Helper for Section Header
    const drawClassicHeader = (title: string) => {
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(primaryColor);
        doc.text(title.toUpperCase(), margin, currentY);
        currentY += 2;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 6;
        doc.setTextColor(0, 0, 0);
    };

    // Summary
    if (data.personal.summary) {
        drawClassicHeader(getResumeLabel(lang, 'summary'));
        doc.setFont('times', 'normal');
        doc.setFontSize(11);
        const splitSummary = doc.splitTextToSize(data.personal.summary, contentWidth);
        doc.text(splitSummary, margin, currentY);
        currentY += (splitSummary.length * 5) + 6;
    }

    // Experience
    if (data.experience.length > 0) {
        if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
        drawClassicHeader(getResumeLabel(lang, 'experience'));

        data.experience.forEach(exp => {
            if (currentY > pageHeight - 30) { doc.addPage(); currentY = 20; }

            // Company & Dates line
            doc.setFont('times', 'bold');
            doc.setFontSize(12);
            doc.text(exp.company, margin, currentY);
            
            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            const dateStr = `${formatDate(exp.startDate)} - ${exp.current ? getResumeLabel(lang, 'current') : formatDate(exp.endDate)}`;
            const dateWidth = doc.getTextWidth(dateStr);
            doc.text(dateStr, pageWidth - margin - dateWidth, currentY);
            doc.setTextColor(0, 0, 0);

            currentY += 5;

            // Position
            doc.setFont('times', 'italic');
            doc.setFontSize(11);
            doc.text(exp.position, margin, currentY);
            currentY += 5;

            // Description
            if (exp.description) {
                doc.setFont('times', 'normal');
                doc.setFontSize(11);
                const splitDesc = doc.splitTextToSize(exp.description, contentWidth);
                doc.text(splitDesc, margin, currentY);
                currentY += (splitDesc.length * 5) + 6;
            } else {
                currentY += 6;
            }
        });
    }

    // Education
    if (data.education.length > 0) {
        if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
        drawClassicHeader(getResumeLabel(lang, 'education'));

        data.education.forEach(edu => {
             if (currentY > pageHeight - 20) { doc.addPage(); currentY = 20; }
            
             // Institution & Dates
            doc.setFont('times', 'bold');
            doc.setFontSize(12);
            doc.text(edu.institution, margin, currentY);

            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            const dateStr = `${formatDate(edu.startDate)} - ${edu.current ? getResumeLabel(lang, 'current') : formatDate(edu.endDate)}`;
            const dateWidth = doc.getTextWidth(dateStr);
            doc.text(dateStr, pageWidth - margin - dateWidth, currentY);
            doc.setTextColor(0, 0, 0);

            currentY += 5;

            // Degree
            doc.setFont('times', 'normal');
            doc.setFontSize(11);
            doc.text(`${edu.degree} - ${edu.fieldOfStudy}`, margin, currentY);
            currentY += 10;
        });
    }

    // Skills
    if (data.skills.length > 0) {
        if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
        drawClassicHeader(getResumeLabel(lang, 'skills'));
        doc.setFont('times', 'normal');
        doc.setFontSize(11);

        // Use two columns for skills to save space
        const midpoint = Math.ceil(data.skills.length / 2);
        const firstCol = data.skills.slice(0, midpoint);
        const secondCol = data.skills.slice(midpoint);
        const colY = currentY;

        firstCol.forEach((skill, index) => {
            if (colY + (index * 5) > pageHeight - 20) {
                doc.addPage();
                currentY = 20; // This simple reset isn't perfect for multi-page columns
            }
            doc.text(`• ${skill.name}`, margin, colY + (index * 5));
        });

        secondCol.forEach((skill, index) => {
            if (colY + (index * 5) > pageHeight - 20) {
                 // Logic gets complex for multi-page columns, this is a simplification
            }
            doc.text(`• ${skill.name}`, margin + contentWidth / 2, colY + (index * 5));
        });
        
        currentY = colY + (midpoint * 5) + 6;
    }

    // Languages
    if (data.languages.length > 0) {
        if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
        drawClassicHeader(getResumeLabel(lang, 'languages'));
        doc.setFont('times', 'normal');
        doc.setFontSize(11);

        data.languages.forEach(langItem => {
            if (currentY > pageHeight - 20) { doc.addPage(); currentY = 20; }
            const levelText = translateLevel(langItem.level, lang);
            const levelWidth = doc.getTextWidth(levelText);

            doc.text(langItem.name, margin, currentY);
            doc.setFont('times', 'italic');
            doc.setTextColor(80, 80, 80);
            doc.text(levelText, pageWidth - margin - levelWidth, currentY);
            doc.setTextColor(0, 0, 0);
            doc.setFont('times', 'normal');
            
            currentY += 6;
        });
        currentY += 4;
    }
};