import type { jsPDF } from 'jspdf';
import { ResumeData } from '../../types/resume';
import { getResumeLabel, translateLevel } from './resumeTranslations';

// Helper to format date as MM/YYYY
const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    return `${month}/${year}`;
};

export const generateModernPDF = (doc: jsPDF, data: ResumeData) => {
    // A4 size: 210 x 297 mm
    const primaryColor = data.primaryColor || '#1a1a1a';
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const lang = data.lang || 'pt';

    // --- Sidebar ---
    const sidebarWidth = pageWidth * 0.35;
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, sidebarWidth, pageHeight, 'F');
    doc.setTextColor(255, 255, 255);

    let sidebarY = 25; // Increased top margin for better positioning

    // Photo
    if (data.personal.photo) {
        try {
            const imgData = data.personal.photo;
            const imgSize = 35;
            const imgX = (sidebarWidth / 2) - (imgSize / 2);
            
            // --- Stable Square Image Rendering ---
            // The clip() function in jsPDF is unstable. Switched to a simple square image
            // to guarantee PDF stability and prevent text rendering issues.
            doc.addImage(imgData, 'JPEG', imgX, sidebarY, imgSize, imgSize);
            // Add a clean white border for a finished look
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.5);
            doc.rect(imgX, sidebarY, imgSize, imgSize);
            
            sidebarY += imgSize + 8;
        } catch (e) {
            console.error("Error adding image to modern template", e);
        }
    }
    
    // Explicitly reset font and color after any image operation for safety
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);

    // Name & Title
    doc.setFontSize(16);
    const splitName = doc.splitTextToSize(data.personal.fullName, sidebarWidth - 10);
    doc.text(splitName, sidebarWidth / 2, sidebarY, { align: 'center' });
    sidebarY += (splitName.length * 6) + 2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(data.personal.jobTitle.toUpperCase(), sidebarWidth / 2, sidebarY, { align: 'center' });
    sidebarY += 15;

    // Helper for sidebar sections
    const drawSidebarSection = (title: string, items: string[], isList: boolean = true) => {
        if (items.length === 0) return;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(title.toUpperCase(), margin, sidebarY);
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.2);
        doc.line(margin, sidebarY + 2, sidebarWidth - margin, sidebarY + 2);
        sidebarY += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        items.forEach(item => {
            const splitItem = doc.splitTextToSize(item, sidebarWidth - (margin * 2));
            doc.text(splitItem, margin, sidebarY);
            sidebarY += (splitItem.length * 4) + (isList ? 2 : 0);
        });
        sidebarY += 8;
    };
    
    // Contact
    const contactItems = [
        data.personal.email,
        data.personal.phone,
        data.personal.location,
        data.personal.linkedin?.replace(/^https?:\/\//, ''),
        data.personal.website?.replace(/^https?:\/\//, '')
    ].filter(Boolean) as string[];
    drawSidebarSection(getResumeLabel(lang, 'contact'), contactItems);

    // Skills
    const skillItems = data.skills.map(s => s.name);
    if (skillItems.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(getResumeLabel(lang, 'skills').toUpperCase(), margin, sidebarY);
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.2);
        doc.line(margin, sidebarY + 2, sidebarWidth - margin, sidebarY + 2);
        sidebarY += 8;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        let currentX = margin;
        skillItems.forEach(skill => {
            const skillWidth = doc.getTextWidth(skill) + 8;
            if (currentX + skillWidth > sidebarWidth - margin) {
                currentX = margin;
                sidebarY += 7;
            }
            doc.setFillColor(255, 255, 255);
            doc.setTextColor(primaryColor);
            doc.roundedRect(currentX, sidebarY - 3, skillWidth, 5, 1, 1, 'F');
            doc.text(skill, currentX + 4, sidebarY);
            currentX += skillWidth + 3;
        });
        sidebarY += 15;
        doc.setTextColor(255, 255, 255);
    }
    
    // Languages
    const languageItems = data.languages.map(l => `${l.name} - ${translateLevel(l.level, lang)}`);
    drawSidebarSection(getResumeLabel(lang, 'languages'), languageItems);

    // --- Main Content ---
    const mainX = sidebarWidth + 10;
    const mainWidth = pageWidth - mainX - margin;
    let mainY = 25;
    doc.setTextColor(0, 0, 0);

    const drawMainHeader = (title: string) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(30, 30, 30);
        doc.text(title.toUpperCase(), mainX, mainY);
        mainY += 2;
        doc.setDrawColor(primaryColor);
        doc.setLineWidth(0.8);
        doc.line(mainX, mainY, mainX + 15, mainY);
        mainY += 8;
        doc.setTextColor(0, 0, 0);
    };

    // Summary
    if (data.personal.summary) {
        drawMainHeader(getResumeLabel(lang, 'summary'));
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const splitSummary = doc.splitTextToSize(data.personal.summary, mainWidth);
        doc.text(splitSummary, mainX, mainY);
        mainY += (splitSummary.length * 5) + 10;
    }

    // Experience
    if (data.experience.length > 0) {
        if (mainY > pageHeight - 40) { doc.addPage(); mainY = 25; }
        drawMainHeader(getResumeLabel(lang, 'experience'));
        
        data.experience.forEach(exp => {
            if (mainY > pageHeight - 30) { doc.addPage(); mainY = 25; }

            doc.setDrawColor(200, 200, 200);
            doc.line(mainX - 3, mainY, mainX - 3, mainY + 10);
            
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(primaryColor);
            doc.circle(mainX - 3, mainY + 2, 1.5, 'FD');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text(exp.position, mainX, mainY);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            const dateStr = `${formatDate(exp.startDate)} - ${exp.current ? getResumeLabel(lang, 'current') : formatDate(exp.endDate)}`;
            doc.text(dateStr, mainX + mainWidth, mainY, { align: 'right' });

            mainY += 5;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 50);
            doc.text(exp.company, mainX, mainY);

            mainY += 5;
            if (exp.description) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(80, 80, 80);
                const splitDesc = doc.splitTextToSize(exp.description, mainWidth);
                doc.text(splitDesc, mainX, mainY);
                mainY += (splitDesc.length * 5) + 8;
            } else {
                mainY += 8;
            }
        });
    }

    // Education
    if (data.education.length > 0) {
        if (mainY > pageHeight - 40) { doc.addPage(); mainY = 25; }
        drawMainHeader(getResumeLabel(lang, 'education'));
        
        data.education.forEach(edu => {
            if (mainY > pageHeight - 20) { doc.addPage(); mainY = 25; }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text(edu.institution, mainX, mainY);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            const dateStr = `${formatDate(edu.startDate)} - ${edu.current ? getResumeLabel(lang, 'current') : formatDate(edu.endDate)}`;
            doc.text(dateStr, mainX + mainWidth, mainY, { align: 'right' });
            
            mainY += 5;
            doc.setTextColor(50, 50, 50);
            doc.text(`${edu.degree} - ${edu.fieldOfStudy}`, mainX, mainY);
            mainY += 8;
        });
    }
};