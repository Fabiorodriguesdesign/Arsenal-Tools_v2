
export const STOPWORDS = [
    // Artigos e Preposições PT
    'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas',
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
    'por', 'pelo', 'pela', 'para', 'pra', 'com', 'sem', 'sob', 'sobre',
    'e', 'ou', 'nem', 'mas', 'que', 'se',
    
    // Termos técnicos de arquivo irrelevantes para SEO
    'v1', 'v2', 'v3', 'final', 'copy', 'copia', 'teste', 'temp', 'draft', 
    'img', 'image', 'imagem', 'dsc', 'pic', 'screen', 'shot', 'screenshot',
    'whatsapp', 'image', 'unknown', 'untitled', 'sem', 'titulo'
];

// Dicionário de Sinônimos Local (Expansível)
const SYNONYMS: Record<string, string[]> = {
    'carro': ['automovel', 'veiculo', 'auto'],
    'casa': ['imovel', 'residencia', 'lar', 'home'],
    'mulher': ['feminino', 'woman', 'girl'],
    'homem': ['masculino', 'man', 'boy'],
    'crianca': ['infantil', 'kids', 'bebe'],
    'loja': ['store', 'comercio', 'varejo'],
    'promo': ['oferta', 'desconto', 'sale', 'off'],
    'tech': ['tecnologia', 'gadget', 'eletronico'],
    'fundo': ['background', 'bg', 'textura', 'wallpaper'],
    'logo': ['marca', 'identidade', 'brand', 'logotipo'],
    'design': ['arte', 'criativo', 'layout', 'visual'],
    'ebook': ['livro digital', 'pdf', 'guia'],
    'curso': ['treinamento', 'aula', 'workshop'],
    'marketing': ['mkt', 'propaganda', 'publicidade'],
    'natal': ['christmas', 'papai noel', 'feriado'],
    'doce': ['candy', 'sobremesa', 'acucar']
};

// Removidos 'HD', '4K', 'Premium' para evitar tags falsas em arquivos simples
export const COMMERCIAL_TERMS = ['Promoção', 'Oferta', 'Novidade', 'Exclusivo', 'Oficial', '2025', 'Melhor Preço', 'Limitado'];

// Helper para converter string para Title Case (Primeira Letra Maiúscula)
const toTitleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const cleanFileName = (fileName: string): string[] => {
    // 1. Remove extensão
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

    // 2. Normaliza (remove acentos)
    const normalized = nameWithoutExt
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    // 3. Substitui separadores comuns por espaço
    const withSpaces = normalized.replace(/[-_.]/g, ' ');

    // 4. Remove caracteres especiais e números isolados irrelevantes
    // Mantém letras e números, remove o resto
    const cleanString = withSpaces.replace(/[^a-zA-Z0-9\s]/g, '');

    // 5. Quebra em palavras
    const words = cleanString.split(/\s+/);

    // 6. Filtra stopwords, palavras curtas (< 2 chars) e aplica Title Case
    const tags = words
        .filter(word => word.length > 1 && !STOPWORDS.includes(word.toLowerCase()))
        .map(word => toTitleCase(word)); // Aplica Title Case em cada palavra

    // 7. Remove duplicatas
    return [...new Set(tags)];
};

export const expandTagsWithSynonyms = (tags: string[]): string[] => {
    let expandedTags = [...tags];
    
    tags.forEach(tag => {
        const lowerTag = tag.toLowerCase();
        if (SYNONYMS[lowerTag]) {
            // Adiciona sinônimos em Title Case
            const synonyms = SYNONYMS[lowerTag].map(s => toTitleCase(s));
            expandedTags = [...expandedTags, ...synonyms];
        }
    });

    return [...new Set(expandedTags)];
};

export const formatTags = (tags: string[], separator: string): string => {
    // Removido toLowerCase() para preservar o Title Case gerado por cleanFileName
    return tags.join(separator);
};

export const generateTitle = (tags: string[]): string => {
    return tags.join(' ');
};

export const generateSmartName = (fileName: string, separator: string): string => {
    const tags = cleanFileName(fileName);
    return tags.join(separator);
};

interface SeoReportOptions {
    includeCommercialTags: boolean;
    useSynonyms: boolean;
}

export const generateSeoReport = (
    files: File[], 
    filenameSeparator: string, // Separador do nome do arquivo (ex: hifen)
    options: SeoReportOptions = { includeCommercialTags: false, useSynonyms: false },
    tagSeparator: string = ', ' // Separador das tags no relatório (ex: virgula, ponto e virgula)
): Blob => {
    let reportContent = "RELATÓRIO DE OTIMIZAÇÃO DE ARQUIVOS - ARSENAL TOOLS\n";
    reportContent += "=================================================\n\n";

    files.forEach((file, index) => {
        let tags = cleanFileName(file.name);
        
        if (options.useSynonyms) {
            tags = expandTagsWithSynonyms(tags);
        }

        const newName = tags.join(filenameSeparator);
        const title = generateTitle(tags);
        
        // Prepare keywords list for the report
        let keywordsList = [...tags];
        if (options.includeCommercialTags) {
            keywordsList = [...keywordsList, ...COMMERCIAL_TERMS];
        }
        // Remove duplicates and format using the selected TAG SEPARATOR
        keywordsList = [...new Set(keywordsList)];
        const keywords = formatTags(keywordsList, tagSeparator);
        
        const extension = file.name.split('.').pop() || '';

        reportContent += `ARQUIVO #${index + 1}\n`;
        reportContent += `Original:  ${file.name}\n`;
        reportContent += `Novo Nome: ${newName}.${extension}\n`;
        reportContent += `Título:    ${title}\n`;
        reportContent += `Tags:      ${keywords}\n`;
        reportContent += "-------------------------------------------------\n\n";
    });

    return new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
};
