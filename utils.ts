import { LeadStatus, Lead } from './types';

export const getStatusClass = (status: LeadStatus): string => {
  switch (status) {
    case 'Novo':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Em contato':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'Assinante':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    default:
      return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
  }
};

export const getOptionClass = (status: LeadStatus): string => {
  switch (status) {
    case 'Novo': return 'text-blue-400';
    case 'Em contato': return 'text-yellow-400';
    case 'Assinante': return 'text-green-400';
    default: return 'text-neutral-400';
  }
};

export const getPlanClass = (plan?: 'freemium' | 'premium'): string => {
  switch (plan) {
    case 'premium':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'freemium':
      return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    default:
      return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
  }
};

/**
 * Escapes a single field for CSV format.
 * - Wraps the field in double quotes if it contains special characters.
 * - Escapes existing double quotes by doubling them.
 * This ensures fields with commas, quotes, or newlines are handled correctly.
 * @param field The data for the field.
 * @returns A CSV-safe string.
 */
export const escapeCSVField = (field: any): string => {
    if (field === null || field === undefined) {
        return '';
    }
    const stringField = String(field);
    const escapedField = stringField.replace(/"/g, '""');
    
    // Add quotes if the field contains commas, double quotes, or newlines
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n') || stringField.includes('\r')) {
        return `"${escapedField}"`;
    }
    
    return escapedField;
};


// Generic function to create and download a CSV file
const generateAndDownloadCSV = (data: Lead[], filename: string) => {
    const headers = ['id', 'name', 'email', 'whatsapp', 'toolOfInterest', 'date', 'status'];
    const csvContent = [
        headers.join(','),
        ...data.map(item => [
            item.id,
            escapeCSVField(item.name),
            escapeCSVField(item.email),
            escapeCSVField(item.whatsapp),
            escapeCSVField(item.toolOfInterest),
            escapeCSVField(item.date),
            escapeCSVField(item.status)
        ].join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Added BOM for Excel compatibility
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Specific function for downloading leads
export const handleDownloadLeadsCSV = (leads: Lead[]) => {
    generateAndDownloadCSV(leads, 'leads.csv');
};
