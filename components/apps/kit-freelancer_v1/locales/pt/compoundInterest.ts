export default {
    title: 'Calculadora de Projeção de Crescimento Financeiro',
    step1: {
        title: 'Passo 1: Configuração',
    },
    step2: {
        title: 'Passo 2: Projeção',
    },
    projection: {
        title: 'Projeção de Crescimento',
    },
    initialAmount: {
        label: 'Valor Inicial (R$)',
    },
    monthlyContribution: {
        label: 'Aporte Mensal (R$)',
    },
    investmentType: {
        label: 'Tipo de Investimento',
        cdb: 'CDB / Outros (com IR)',
        lci_lca: 'LCI / LCA (Isento IR)',
        savings: 'Poupança (Isento IR)',
        generic: 'Genérico (sem impostos)',
    },
    desc: {
        cdb: 'O Imposto de Renda (IR) regressivo incide apenas sobre os juros (lucros), de 22,5% (até 6 meses) a 15% (acima de 2 anos).',
        lci_lca: 'LCI e LCA são investimentos isentos de Imposto de Renda para pessoas físicas.',
        savings: 'A poupança possui rendimento isento de Imposto de Renda para pessoas físicas.',
        generic: 'Este cálculo não considera a incidência de impostos sobre os rendimentos.',
    },
    interestRate: {
        label: 'Taxa de Juros Anual{{type}} (%)',
    },
    gross: ' (Bruta)',
    duration: {
        label: 'Duração do Investimento',
    },
    unit: {
        label: 'Unidade',
        years: 'Anos',
        months: 'Meses',
    },
    simulate: 'Simular Projeção',
    results: {
        totalInvested: 'Total Aportado',
        grossInterest: 'Juros (Bruto)',
        incomeTax: 'Imposto de Renda',
        netFinalAmount: 'Valor Final Líquido',
    },
    grossAmount: 'Valor Bruto',
    chart: {
        grossValue: 'Valor Bruto',
        netValue: 'Valor Líquido',
        totalInvested: 'Total Invested',
    }
};
