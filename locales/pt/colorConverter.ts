
export default {
    title: 'Criador de Paleta de Cores',
    defaultPaletteName: 'Minha Paleta',
    step1: {
        nav: 'Controles',
        title: 'Passo 1: Controles da Paleta',
    },
    step2: {
        nav: 'Paleta',
        title: 'Passo 2: Minha Paleta',
    },
    step3: {
        nav: 'Exportar',
        title: 'Passo 3: Exportar',
    },
    paletteName: {
        label: 'Nome da Paleta',
    },
    addColor: {
        label: 'Adicionar Cor Manual',
        button: 'Adicionar à Paleta',
    },
    extractFromImage: {
        title: 'Extrair Cores de uma Imagem',
        urlLabel: 'URL da Imagem',
        urlPlaceholder: 'https://exemplo.com/imagem.png',
        button: 'Extrair Cores',
        orPaste: 'Ou cole uma imagem da área de transferência (Ctrl+V).',
        helper: 'Dica: Se o link não funcionar (bloqueio de segurança/CORS), copie a imagem em si e cole aqui (Ctrl+V).',
        extracting: 'Processando...',
    },
    emptyPalette: 'Sua paleta está vazia. Adicione uma cor ou extraia de uma imagem para começar!',
    export: {
        ase: 'ASE (Adobe)',
    },
    remove: {
        ariaLabel: 'Remover cor {{color}}',
    },
    errors: {
        cors: 'Erro de segurança (CORS): Não foi possível acessar a imagem via URL. Tente copiar a imagem e colar (Ctrl+V).',
        invalidImage: 'Imagem inválida ou formato não suportado.',
        noImageInClipboard: 'Nenhuma imagem encontrada na área de transferência.',
    }
};