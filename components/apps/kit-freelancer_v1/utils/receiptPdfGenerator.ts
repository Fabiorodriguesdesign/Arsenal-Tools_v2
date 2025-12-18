

import type { jsPDF } from 'jspdf';

export interface ReceiptData {
    payerName: string;
    payerDocument: string;
    receiverName: string;
    receiverDocument: string;
    value: string;
    date: string;
    city: string;
    service: string;
}

const formatCurrency = (value: string) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Helper to write text with line breaks
const writeWrappedText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const splitText = doc.splitTextToSize(text, maxWidth);
    doc.text(splitText, x, y);
    return splitText.length * lineHeight;
};

// Helper to create the PDF document instance
const createReceiptDoc = async (data: ReceiptData, t: (key: string) => string): Promise<jsPDF> => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    
    // Background pattern (subtle dots)
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, pageWidth, 297, 'F');

    // --- Receipt Box (Copy 1 - Payer) ---
    drawReceipt(doc, data, margin, 20, contentWidth, t, t('receiptGenerator.template.payerCopy'));

    // Dotted Line Separator
    doc.setDrawColor(200, 200, 200);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(margin, 148, pageWidth - margin, 148);
    doc.setLineDashPattern([], 0); // Reset

    // --- Receipt Box (Copy 2 - Receiver) ---
    drawReceipt(doc, data, margin, 160, contentWidth, t, t('receiptGenerator.template.receiverCopy'));

    return doc;
};

export const generateReceiptPDF = async (data: ReceiptData, t: (key: string) => string) => {
    const doc = await createReceiptDoc(data, t);
    const fileName = `recibo-${data.payerName.replace(/\s+/g, '-').toLowerCase() || 'pagamento'}.pdf`;
    doc.save(fileName);
};

export const getReceiptPdfBlob = async (data: ReceiptData, t: (key: string) => string): Promise<Blob> => {
    const doc = await createReceiptDoc(data, t);
    return doc.output('blob');
};

const drawReceipt = (doc: jsPDF, data: ReceiptData, x: number, y: number, width: number, t: (key: string) => string, type: string) => {
    const height = 110;
    const innerMargin = 10;
    const startX = x + innerMargin;
    let currentY = y + innerMargin;

    // Border
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.rect(x, y, width, height);
    
    // Decorative top bar
    doc.setFillColor(220, 220, 220);
    doc.rect(x, y, width, 15, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(t('receiptGenerator.template.receipt'), startX, currentY + 5);
    
    // "Copy" Type (Top Right)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const typeWidth = doc.getTextWidth(type);
    doc.text(type, x + width - innerMargin - typeWidth, currentY + 4);

    // Value Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(200, 200, 200);
    doc.rect(x + width - innerMargin - 50, y + 25, 50, 12, 'FD');
    
    doc.setFontSize(8);
    doc.text(t('receiptGenerator.template.value'), x + width - innerMargin - 48, y + 23);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const valueStr = formatCurrency(data.value);
    const valueWidth = doc.getTextWidth(valueStr);
    doc.text(valueStr, x + width - innerMargin - 2, y + 33, { align: 'right' });

    currentY += 35;

    // Main Text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const lineHeight = 7;
    const textWidth = width - (innerMargin * 2);

    // "Received from..."
    const line1 = `${t('receiptGenerator.template.receivedFrom')} ${data.payerName.toUpperCase()} (${data.payerDocument})`;
    currentY += writeWrappedText(doc, line1, startX, currentY, textWidth, lineHeight);

    // "The amount of..."
    // To make it look professional, typically we write amount in words, but for simplicity we use the formatted currency again clearly.
    const line2 = `${t('receiptGenerator.template.theAmount')} ${formatCurrency(data.value)}.`;
    doc.text(line2, startX, currentY);
    currentY += lineHeight;

    // "Regarding..."
    const line3 = `${t('receiptGenerator.template.regarding')} ${data.service}`;
    currentY += writeWrappedText(doc, line3, startX, currentY, textWidth, lineHeight);
    
    // "Date & City..."
    currentY += 5;
    const line4 = `${t('receiptGenerator.template.dateSignature')}`;
    doc.text(line4, startX, currentY);
    currentY += lineHeight * 1.5;

    const locationDate = `${data.city || '________________'}, ${data.date ? formatDate(data.date) : '___/___/____'}.`;
    doc.text(locationDate, x + width - innerMargin, currentY, { align: 'right' });

    // Signature Line
    currentY += 20;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    const centerX = x + (width / 2);
    doc.line(centerX - 40, currentY, centerX + 40, currentY);
    
    currentY += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(data.receiverName.toUpperCase(), centerX, currentY, { align: 'center' });
    
    currentY += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(data.receiverDocument, centerX, currentY, { align: 'center' });
};
