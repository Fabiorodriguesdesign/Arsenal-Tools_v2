
// Utilitário para classes CSS condicionais
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// --- Formatadores ---

/**
 * Formata um número para moeda BRL (R$)
 */
export const formatCurrency = (value: number, currency = 'BRL', locale = 'pt-BR') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * Formata um número para moeda BRL de forma simplificada para gráficos (sem R$ e espaços extras se necessário)
 */
export const formatCurrencyForChart = (value: number) => {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

/**
 * Formata uma string de data ISO (YYYY-MM-DD) para formato local (DD/MM/YYYY)
 */
export const formatDate = (dateString: string, locale = 'pt-BR', options?: Intl.DateTimeFormatOptions) => {
    if (!dateString) return '';
    try {
        // Corrige problemas de fuso horário criando a data com componentes explícitos se for YYYY-MM-DD
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
             const [year, month, day] = dateString.split('-').map(Number);
             const date = new Date(year, month - 1, day);
             return new Intl.DateTimeFormat(locale, options).format(date);
        }
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(locale, options).format(date);
    } catch (e) {
        return dateString;
    }
};

// --- Validadores ---

export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

// --- Manipulação de Strings ---

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Separa acentos das letras
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, '-') // Substitui espaços por hifens
    .replace(/[^\w-]+/g, '') // Remove caracteres não alfanuméricos
    .replace(/--+/g, '-') // Substitui múltiplos hifens por um único
    .replace(/^-+/, '') // Remove hífens do início
    .replace(/-+$/, ''); // Remove hífens do final
};

// --- Utilitários de Arquivo ---

export const getFileBaseName = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex < 1) return fileName;
    return fileName.substring(0, lastDotIndex);
};
