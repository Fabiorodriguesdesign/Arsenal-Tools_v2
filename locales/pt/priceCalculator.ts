export default {
    title: 'Calculadora de Preços de Serviço',
    step1: {
        title: 'Passo 1: Sua Estrutura de Custo',
    },
    step2: {
        title: 'Passo 2: Projeto e Impostos',
    },
    step3: {
        title: 'Passo 3: Resultado',
    },
    serviceName: {
        label: 'Nome do Serviço/Item (Opcional)',
        placeholder: 'Ex: Desenvolvimento de Landing Page'
    },
    createProposal: 'Criar Orçamento com este Valor',
    defaultItemName: 'Serviço Calculado',
    profession: {
        label: 'Qual sua profissão?',
        select: 'Selecione uma profissão',
        designer: 'Designer',
        developer: 'Desenvolvedor(a)',
        contentCreator: 'Criador(a) de Conteúdo',
        marketingSpecialist: 'Especialista em Marketing',
    },
    experienceLevel: {
        label: 'Qual seu nível de experiência?',
        select: 'Selecione um nível',
        junior: 'Júnior',
        mid: 'Pleno',
        senior: 'Sênior',
    },
    monthlySalary: {
        label: 'Meta de Salário por Mês (R$)',
        placeholder: '5000',
    },
    fixedCosts: {
        label: 'Custos Operacionais Fixos (R$)',
        placeholder: 'Aluguel, software, etc.',
    },
    workDays: {
        label: 'Dias de Trabalho por Mês',
    },
    hoursPerDay: {
        label: 'Horas de Trabalho Efetivo por Dia',
    },
    totalHours: {
        label: 'Total de Horas Dedicadas/Mês',
    },
    projectTime: {
        label: 'Estimativa de Tempo do Projeto',
        ariaLabel: 'Tempo do projeto',
    },
    hours: 'Horas',
    days: 'Dias',
    profitMargin: {
        label: 'Margem de Lucro Adicional (%)',
        placeholder: 'Ex: 20',
    },
    taxRegime: {
        label: 'Regime de Imposto',
        mei: 'MEI (Valor Fixo Mensal)',
        simples: 'Simples Nacional (Alíquota %)',
    },
    meiDas: {
        label: 'Valor Fixo do DAS (R$)',
        description: 'Este valor será somado aos seus custos fixos mensais.',
    },
    taxRate: {
        label: 'Alíquota Efetiva Média (%)',
        placeholder: 'Ex: 6',
        description: 'Insira a alíquota que incidirá sobre o valor do projeto.',
    },
    results: {
        title: 'Resultados Detalhados',
        suggestedPrice: 'Valor Sugerido para o Projeto',
        netProjectRevenue: 'Valor Líquido do Projeto (Pós-Impostos)',
        netProfit: 'Seu Lucro Líquido',
        baseCost: 'Custo Base do Projeto',
        estimatedProfit: 'Lucro Estimado (Bruto)',
        estimatedTax: 'Imposto Estimado',
        baseRate: 'Sua tarifa base (custo/hora) é',
        explanation: {
            title: 'Entenda o Custo Base:',
            intro: 'Dentro do Custo Base do Projeto já estão incluídos:',
            salary: 'A parcela do seu <strong>salário mensal desejado</strong> referente às horas dedicadas ao projeto.',
            fixedCosts: 'A parcela dos seus <strong>custos fixos mensais</strong> (aluguel, software, etc.) referente às horas dedicadas ao projeto.',
            meiDas: 'O valor fixo do <strong>DAS do MEI</strong> ({{value}}), também rateado nas horas do projeto.',
        }
    }
};