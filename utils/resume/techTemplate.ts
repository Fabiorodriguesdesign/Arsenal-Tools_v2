

import type { jsPDF } from 'jspdf';
import { ResumeData } from '../../types/resume';
import { getResumeLabel, translateLevel } from './resumeTranslations';

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    return `${month}/${year}`;
};

export const generateTechPDF = (doc: jsPDF, data: ResumeData) => {
    const primaryColor = data.primaryColor || '#1a1a1a';
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const lang = data.lang || 'pt';
    
    let currentY = 20;

    // --- Header ---
    // Gray Background for Header
    doc.setFillColor(248, 249, 250); // Very light gray
    doc.rect(0, 0, pageWidth, 55, 'F');

    // Photo
    let titleX = margin;
    if (data.personal.photo) {
        try {
            const imgX = margin;
            const imgY = 12;
            const imgSize = 30;
            
            // Switched to a simple square image with a border.
            // The previous rounded-rectangle clipping was unstable and broke text rendering.
            // This is a safer and more robust approach.
            doc.addImage(data.personal.photo, 'JPEG', imgX, imgY, imgSize, imgSize);
            
            // Add a clean border
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.rect(imgX, imgY, imgSize, imgSize);
            doc.stroke();
            
            titleX += (imgSize + 10);
        } catch (e) {
            console.error("Error adding image to tech template", e);
        }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(30, 30, 30);
    doc.text(data.personal.fullName.toUpperCase(), titleX, 25);

    doc.setFont('courier', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text(`<${data.personal.jobTitle} />`, titleX, 33);

    // Contact Info Line
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    
    const contactParts = [];
    if(data.personal.email) contactParts.push(data.personal.email);
    if(data.personal.phone) contactParts.push(data.personal.phone);
    if(data.personal.location) contactParts.push(data.personal.location);
    if(data.personal.linkedin) contactParts.push(data.personal.linkedin.replace(/^https?:\/\//, ''));
    if(data.personal.website) contactParts.push(data.personal.website.replace(/^https?:\/\//, ''));

    // Simple wrap for contact info if too long
    let contactX = titleX;
    let contactY = 40;
    contactParts.forEach((part, index) => {
        const text = index < contactParts.length - 1 ? `${part} | ` : part;
        const width = doc.getTextWidth(text);
        if (contactX + width > pageWidth - margin) {
            contactX = titleX;
            contactY += 4;
        }
        doc.text(text, contactX, contactY);
        contactX += width;
    });

    // Bottom border of header
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(1.5);
    doc.line(margin, 55, pageWidth - margin, 55);

    currentY = 70;

    // Columns Layout
    const colGap = 10;
    const leftColWidth = (pageWidth - (margin * 2) - colGap) * 0.65;
    const rightColWidth = (pageWidth - (margin * 2) - colGap) * 0.35;
    const rightColX = margin + leftColWidth + colGap;

    // --- Left Column Content ---
    
    const drawTechHeader = (title: string, x: number, y: number) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text(title.toUpperCase(), x + 6, y);
        
        doc.setFontSize(14);
        doc.setTextColor(primaryColor);
        doc.text("#", x, y); // Hashtag icon
        
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.line(x, y + 3, x + leftColWidth, y + 3);
        
        return y + 10;
    };

    let leftY = currentY;

    // Summary
    if (data.personal.summary) {
        leftY = drawTechHeader(getResumeLabel(lang, 'summary'), margin, leftY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const splitSummary = doc.splitTextToSize(data.personal.summary, leftColWidth);
        doc.text(splitSummary, margin, leftY);
        leftY += (splitSummary.length * 5) + 10;
    }

    // Experience
    if (data.experience.length > 0) {
        leftY = drawTechHeader(getResumeLabel(lang, 'experience'), margin, leftY);
        
        data.experience.forEach(exp => {
            if (leftY > pageHeight - 30) { doc.addPage(); leftY = 20; }
            
            // Left border line
            doc.setDrawColor(primaryColor);
            doc.setLineWidth(0.8);
            doc.line(margin, leftY, margin, leftY + 10); // Start of line

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text(exp.position, margin + 4, leftY + 3);

            // Date Tag (mimic tech tag)
            doc.setFont('courier', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(80, 80, 80);
            const dateStr = `[ ${formatDate(exp.startDate)} - ${exp.current ? getResumeLabel(lang, 'current') : formatDate(exp.endDate)} ]`;
            const dateWidth = doc.getTextWidth(dateStr);
            doc.text(dateStr, margin + leftColWidth - dateWidth, leftY + 3);

            leftY += 5;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text(exp.company, margin + 4, leftY);
            
            leftY += 5;
            if (exp.description) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(50, 50, 50);
                const splitDesc = doc.splitTextToSize(exp.description, leftColWidth - 6);
                doc.text(splitDesc, margin + 4, leftY);
                
                // Extend border line
                const descHeight = splitDesc.length * 5;
                doc.line(margin, leftY - 10, margin, leftY + descHeight - 2);
                
                leftY += descHeight + 8;
            } else {
                leftY += 8;
            }
        });
    }

    // Education (Main column)
    if (data.education.length > 0) {
        if (leftY > pageHeight - 40) { doc.addPage(); leftY = 20; }
        leftY = drawTechHeader(getResumeLabel(lang, 'education'), margin, leftY);

        data.education.forEach(edu => {
             if (leftY > pageHeight - 25) { doc.addPage(); leftY = 20; }
             
             // Card-like box
             doc.setDrawColor(230, 230, 230);
             doc.setFillColor(252, 252, 252);
             doc.rect(margin, leftY - 4, leftColWidth, 18, 'FD');

             doc.setFont('helvetica', 'bold');
             doc.setFontSize(10);
             doc.setTextColor(0, 0, 0);
             doc.text(edu.institution, margin + 3, leftY + 1);

             doc.setFont('courier', 'normal');
             doc.setFontSize(8);
             doc.setTextColor(80, 80, 80);
             const dateStr = `${formatDate(edu.startDate)} - ${edu.current ? getResumeLabel(lang, 'current') : formatDate(edu.endDate)}`;
             doc.text(dateStr, margin + leftColWidth - 3, leftY + 1, { align: 'right' });

             leftY += 5;
             doc.setFont('helvetica', 'normal');
             doc.setFontSize(9);
             doc.setTextColor(50, 50, 50);
             doc.text(`${edu.degree} - ${edu.fieldOfStudy}`, margin + 3, leftY + 2);
             
             leftY += 12;
        });
    }

    // --- Right Column Content ---
    let rightY = 70;

    // Skills
    if (data.skills.length > 0) {
        doc.setFont('courier', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`// ${getResumeLabel(lang, 'skills')}`, rightColX, rightY);
        rightY += 6;

        doc.setFont('courier', 'bold');
        doc.setFontSize(9);
        
        let xPos = rightColX;
        data.skills.forEach(skill => {
            const text = skill.name;
            const textWidth = doc.getTextWidth(text) + 6;
            
            // Wrap
            if (xPos + textWidth > pageWidth - margin) {
                xPos = rightColX;
                rightY += 8;
            }
            
            // Chip background
            doc.setFillColor(primaryColor); 
            doc.setDrawColor(primaryColor);
            doc.setLineWidth(0.2);
            doc.roundedRect(xPos, rightY - 3, textWidth, 6, 1, 1, 'S');
            
            doc.setTextColor(primaryColor);
            doc.text(text, xPos + 3, rightY + 1);
            
            xPos += textWidth + 3;
        });
        rightY += 15;
    }

    // Languages
    if (data.languages.length > 0) {
        doc.setFont('courier', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`// ${getResumeLabel(lang, 'languages')}`, rightColX, rightY);
        rightY += 8;

        data.languages.forEach(langItem => {
             doc.setFont('helvetica', 'bold');
             doc.setFontSize(10);
             doc.setTextColor(30, 30, 30);
             doc.text(langItem.name, rightColX, rightY);
             
             doc.setFont('courier', 'normal');
             doc.setFontSize(8);
             doc.setTextColor(100, 100, 100);
             const level = translateLevel(langItem.level, lang);
             doc.text(level.toLowerCase(), pageWidth - margin, rightY, { align: 'right' });
             
             rightY += 2;
             // Progress bar background
             doc.setFillColor(230, 230, 230);
             doc.rect(rightColX, rightY, rightColWidth, 1.5, 'F');
             
             // Progress bar fill
             let widthPercent = 0.25;
             if (langItem.level === 'intermediate') widthPercent = 0.5;
             if (langItem.level === 'advanced') widthPercent = 0.75;
             if (langItem.level === 'fluent') widthPercent = 0.9;
             if (langItem.level === 'native') widthPercent = 1;
             
             doc.setFillColor(primaryColor);
             doc.rect(rightColX, rightY, rightColWidth * widthPercent, 1.5, 'F');

             rightY += 8;
        });
    }
};