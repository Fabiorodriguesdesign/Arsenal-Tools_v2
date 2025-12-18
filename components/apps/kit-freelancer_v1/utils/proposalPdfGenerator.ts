

import type { jsPDF } from 'jspdf';
import { ProposalData, ProposalLanguage } from '../types/proposal';

// --- Translations ---
const getLabel = (lang: ProposalLanguage, key: string) => {
    const dict: Record<ProposalLanguage, Record<string, string>> = {
        pt: {
            proposal: 'ORÇAMENTO',
            preparedFor: 'PREPARADO PARA',
            date: 'Data',
            valid: 'Válido até',
            project: 'PROJETO',
            desc: 'DESCRIÇÃO',
            qty: 'QTD',
            price: 'UNIT.',
            subtotal: 'SUBTOTAL',
            total: 'TOTAL',
            terms: 'TERMOS E CONDIÇÕES',
            from: 'DE',
            to: 'PARA',
            issue: 'Emissão',
            validity: 'Validade',
            item: 'ITEM',
            provider: 'PRESTADOR',
            client: 'CLIENTE',
            commercialProposal: 'Proposta Comercial',
            estimatedTotal: 'Total Estimado'
        },
        en: {
            proposal: 'PROPOSAL',
            preparedFor: 'PREPARED FOR',
            date: 'Date',
            valid: 'Valid until',
            project: 'PROJECT',
            desc: 'DESCRIPTION',
            qty: 'QTY',
            price: 'UNIT PRICE',
            subtotal: 'SUBTOTAL',
            total: 'TOTAL',
            terms: 'TERMS AND CONDITIONS',
            from: 'FROM',
            to: 'TO',
            issue: 'Date',
            validity: 'Valid',
            item: 'ITEM',
            provider: 'PROVIDER',
            client: 'CLIENT',
            commercialProposal: 'Commercial Proposal',
            estimatedTotal: 'Estimated Total'
        },
        es: {
            proposal: 'PRESUPUESTO',
            preparedFor: 'PREPARADO PARA',
            date: 'Fecha',
            valid: 'Válido hasta',
            project: 'PROYECTO',
            desc: 'DESCRIPCIÓN',
            qty: 'CANT',
            price: 'UNITARIO',
            subtotal: 'SUBTOTAL',
            total: 'TOTAL',
            terms: 'TÉRMINOS Y CONDICIONES',
            from: 'DE',
            to: 'PARA',
            issue: 'Emisión',
            validity: 'Validez',
            item: 'ITEM',
            provider: 'PROVEEDOR',
            client: 'CLIENTE',
            commercialProposal: 'Propuesta Comercial',
            estimatedTotal: 'Total Estimado'
        }
    };
    return dict[lang]?.[key] || key;
};

const formatCurrency = (value: number, currency: string, lang: string) => {
    try {
        const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
        return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(value);
    } catch {
        return `${currency} ${value.toFixed(2)}`;
    }
};

const formatDate = (dateString: string, lang: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
    return new Intl.DateTimeFormat(locale).format(date);
};

export const generateProposalPDF = async (data: ProposalData) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    if (data.templateId === 'classic') {
        generateClassicPDF(doc, data);
    } else if (data.templateId === 'clean') {
        generateCleanPDF(doc, data);
    } else {
        generateModernPDF(doc, data);
    }

    const fileName = `orcamento-${data.clientName.replace(/\s+/g, '-').toLowerCase() || 'cliente'}.pdf`;
    doc.save(fileName);
};

// --- Modern Template ---
const generateModernPDF = (doc: jsPDF, data: ProposalData) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const lang = data.lang || 'pt';
    const l = (k: string) => getLabel(lang, k);
    
    let currentY = 20;

    // Header
    let providerY = currentY;
    if (data.providerLogo) {
        try {
            doc.addImage(data.providerLogo, 'JPEG', margin, currentY, 25, 25);
            providerY += 30;
        } catch (e) { console.error(e); }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(data.providerCompany || data.providerName, margin, providerY);
    providerY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    [data.providerDocument, data.providerEmail, data.providerPhone, data.providerAddress].filter(Boolean).forEach(info => {
        doc.text(info, margin, providerY);
        providerY += 4;
    });

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    const title = l('proposal');
    doc.text(title, pageWidth - margin - doc.getTextWidth(title), currentY + 8);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let dateY = currentY + 20;
    if (data.issueDate) {
        const text = `${l('date')}: ${formatDate(data.issueDate, lang)}`;
        doc.text(text, pageWidth - margin - doc.getTextWidth(text), dateY);
        dateY += 5;
    }
    if (data.validUntil) {
        const text = `${l('valid')}: ${formatDate(data.validUntil, lang)}`;
        doc.text(text, pageWidth - margin - doc.getTextWidth(text), dateY);
    }

    currentY = Math.max(providerY, dateY) + 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // Client
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(l('preparedFor'), margin, currentY);
    currentY += 5;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(data.clientCompany || data.clientName, margin, currentY);
    currentY += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    [data.clientName !== data.clientCompany ? `A/C: ${data.clientName}` : '', data.clientDocument, data.clientEmail, data.clientAddress].filter(Boolean).forEach(info => {
        doc.text(info, margin, currentY);
        currentY += 4;
    });
    currentY += 10;

    // Project
    if (data.projectTitle) {
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margin, currentY, contentWidth, 15, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(l('project'), margin + 3, currentY + 6);
        doc.setFont('helvetica', 'normal');
        doc.text(data.projectTitle, margin + 3, currentY + 11);
        currentY += 20;
    }

    if (data.introduction) {
        doc.setFontSize(10);
        const splitIntro = doc.splitTextToSize(data.introduction, contentWidth);
        doc.text(splitIntro, margin, currentY);
        currentY += (splitIntro.length * 5) + 10;
    }

    // Items Table
    const colQtyX = margin + contentWidth - 90; 
    const colPriceX = margin + contentWidth - 60;
    const colTotalX = margin + contentWidth - 30;

    doc.setFillColor(50, 50, 50);
    doc.rect(margin, currentY, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(l('desc'), margin + 2, currentY + 5);
    doc.text(l('qty'), colQtyX + 2, currentY + 5);
    doc.text(l('price'), colPriceX + 2, currentY + 5);
    doc.text(l('total'), colTotalX + 2, currentY + 5);
    currentY += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    let subtotal = 0;
    data.items.forEach((item, index) => {
        if (currentY > pageHeight - 30) { doc.addPage(); currentY = 20; }
        const itemTotal = item.quantity * item.unitPrice;
        subtotal += itemTotal;

        if (index % 2 === 0) doc.setFillColor(250, 250, 250);
        else doc.setFillColor(255, 255, 255);

        const descWidth = colQtyX - margin - 5;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        const splitName = doc.splitTextToSize(item.name, descWidth);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        const splitDesc = item.description ? doc.splitTextToSize(item.description, descWidth) : [];
        const rowHeight = Math.max((splitName.length * 5) + (splitDesc.length * 4) + 6, 10);

        doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(splitName, margin + 2, currentY + 5);
        
        if (splitDesc.length > 0) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            doc.text(splitDesc, margin + 2, currentY + 5 + (splitName.length * 5));
        }

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(item.quantity.toString(), colQtyX + 2, currentY + 5);
        doc.text(formatCurrency(item.unitPrice, data.currency, lang), colPriceX + 2, currentY + 5);
        doc.setFont('helvetica', 'bold');
        doc.text(formatCurrency(itemTotal, data.currency, lang), colTotalX + 2, currentY + 5);
        currentY += rowHeight;
    });

    currentY += 5;
    if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
    
    const totalBoxWidth = 80;
    const totalBoxX = pageWidth - margin - totalBoxWidth;
    doc.setFillColor(245, 245, 245);
    doc.rect(totalBoxX, currentY, totalBoxWidth, 12, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(l('total') + ":", totalBoxX + 5, currentY + 8);
    doc.setFontSize(14);
    const totalStr = formatCurrency(subtotal, data.currency, lang);
    doc.text(totalStr, pageWidth - margin - doc.getTextWidth(totalStr) - 2, currentY + 8);
    currentY += 25;

    if (data.terms) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(l('terms') + ":", margin, currentY);
        currentY += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(doc.splitTextToSize(data.terms, contentWidth), margin, currentY);
    }
};

// --- Classic Template ---
const generateClassicPDF = (doc: jsPDF, data: ProposalData) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const lang = data.lang || 'pt';
    const l = (k: string) => getLabel(lang, k);
    
    let currentY = 20;

    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    const providerTitle = (data.providerCompany || data.providerName).toUpperCase();
    doc.text(providerTitle, pageWidth / 2, currentY, { align: 'center' });
    currentY += 8;

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    const contactLine = [data.providerEmail, data.providerPhone, data.providerDocument].filter(Boolean).join(' • ');
    doc.text(contactLine, pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // Info Block
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text(l('client') + ":", margin, currentY);
    doc.text(l('proposal') + ":", pageWidth - 60, currentY);
    currentY += 5;

    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.text(data.clientCompany || data.clientName, margin, currentY);
    if (data.issueDate) doc.text(`${l('issue')}: ${formatDate(data.issueDate, lang)}`, pageWidth - 60, currentY);
    currentY += 5;
    
    doc.text(data.clientEmail, margin, currentY);
    if (data.validUntil) doc.text(`${l('validity')}: ${formatDate(data.validUntil, lang)}`, pageWidth - 60, currentY);
    currentY += 15;

    if (data.projectTitle) {
        doc.setFont('times', 'bold');
        doc.setFontSize(14);
        doc.text(data.projectTitle.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
        currentY += 10;
    }

    if (data.introduction) {
        doc.setFont('times', 'normal');
        doc.setFontSize(11);
        doc.text(doc.splitTextToSize(data.introduction, contentWidth), margin, currentY);
        currentY += 20;
    }

    // Table
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    doc.line(margin, currentY, pageWidth - margin, currentY); // Top border
    currentY += 6;
    
    doc.setFont('times', 'bold');
    doc.text(l('item'), margin, currentY);
    doc.text(l('qty'), pageWidth - 70, currentY);
    doc.text(l('price'), pageWidth - 45, currentY);
    doc.text(l('total'), pageWidth - margin - 5, currentY, { align: 'right' });
    currentY += 3;
    doc.line(margin, currentY, pageWidth - margin, currentY); // Header bottom border
    currentY += 6;

    doc.setFont('times', 'normal');
    let total = 0;
    data.items.forEach(item => {
        const itemTotal = item.quantity * item.unitPrice;
        total += itemTotal;
        
        doc.text(item.name, margin, currentY);
        doc.text(item.quantity.toString(), pageWidth - 70, currentY);
        doc.text(formatCurrency(item.unitPrice, data.currency, lang), pageWidth - 45, currentY);
        doc.text(formatCurrency(itemTotal, data.currency, lang), pageWidth - margin - 5, currentY, { align: 'right' });
        
        if (item.description) {
            currentY += 5;
            doc.setFontSize(9);
            doc.setFont('times', 'italic');
            doc.text(doc.splitTextToSize(item.description, contentWidth - 80), margin, currentY);
            doc.setFontSize(11);
            doc.setFont('times', 'normal');
        }
        currentY += 8;
        doc.setDrawColor(230);
        doc.line(margin, currentY - 4, pageWidth - margin, currentY - 4); // Row separator
        doc.setDrawColor(0);
    });

    currentY += 5;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text(`${l('total')}: ${formatCurrency(total, data.currency, lang)}`, pageWidth - margin - 5, currentY, { align: 'right' });
};

// --- Clean/Minimal Template ---
const generateCleanPDF = (doc: jsPDF, data: ProposalData) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lang = data.lang || 'pt';
    const l = (k: string) => getLabel(lang, k);
    let currentY = 30;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(26);
    doc.setTextColor(50, 50, 50);
    doc.text(l('commercialProposal'), margin, currentY);
    
    if (data.providerLogo) {
        try { doc.addImage(data.providerLogo, 'JPEG', pageWidth - margin - 20, 20, 20, 20); } catch(e){}
    }
    currentY += 20;

    // 2 Columns info
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(l('from').toUpperCase(), margin, currentY);
    doc.text(l('to').toUpperCase(), pageWidth / 2, currentY);
    currentY += 5;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(data.providerCompany || data.providerName, margin, currentY);
    doc.text(data.clientCompany || data.clientName, pageWidth / 2, currentY);
    currentY += 5;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(data.providerEmail, margin, currentY);
    doc.text(data.clientEmail, pageWidth / 2, currentY);
    currentY += 20;

    if (data.projectTitle) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(data.projectTitle, margin, currentY);
        currentY += 8;
    }
    
    if (data.introduction) {
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const splitIntro = doc.splitTextToSize(data.introduction, pageWidth - (margin * 2));
        doc.text(splitIntro, margin, currentY);
        currentY += (splitIntro.length * 5) + 10;
    }

    // Minimalist List
    let total = 0;
    data.items.forEach(item => {
        const itemTotal = item.quantity * item.unitPrice;
        total += itemTotal;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(item.name, margin, currentY);
        doc.text(formatCurrency(itemTotal, data.currency, lang), pageWidth - margin, currentY, { align: 'right' });
        
        if (item.description) {
            currentY += 5;
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text(doc.splitTextToSize(item.description, pageWidth - (margin*2)), margin, currentY);
        }
        currentY += 5;
        doc.setDrawColor(240, 240, 240);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 10;
    });

    currentY += 10;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(l('estimatedTotal'), pageWidth - margin, currentY, { align: 'right' });
    currentY += 8;
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(formatCurrency(total, data.currency, lang), pageWidth - margin, currentY, { align: 'right' });
};