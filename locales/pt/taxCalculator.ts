export default {
    title: 'Calculadora de Impostos e Lucro',
    card: {
        title: 'Dados para Análise',
    },
    monthlyRevenue: {
        label: '1. Faturamento Bruto Estimado/Mês (R$)',
        placeholder: 'Ex: 7000',
    },
    taxRegime: {
        label: '2. Regime Tributário',
        mei: 'MEI (Imposto Fixo Mensal)',
        simples3: 'Simples Nacional - Anexo III',
        simples5: 'Simples Nacional - Anexo V',
    },
    meiDas: {
        label: 'Valor Fixo do DAS (R$)',
    },
    serviceValue: {
        label: '3. Valor Deste Serviço (R$)',
        placeholder: 'Ex: 2000',
    },
    calculate: {
        button: 'Calcular Impostos',
    },
    results: {
        title: 'Resultados da Análise',
    },
    effectiveRate: 'Alíquota Efetiva',
    meiRate: {
        note: '(Baseada no imposto fixo sobre o faturamento)',
    },
    monthlyResults: {
        title: 'Resultados Mensais',
    },
    monthlyTax: 'Imposto Estimado/Mês (DAS)',
    monthlyNet: 'Renda Líquida Estimada/Mês',
    serviceResults: {
        title: 'Resultados do Serviço',
    },
    serviceTax: 'Imposto sobre o Serviço',
    serviceNet: 'Valor Líquido do Serviço',
    warning: {
        meiLimit: 'O faturamento mensal de {{revenue}} ultrapassa o limite recomendado para MEI (R$ 6.750/mês). Considere o desenquadramento.',
        simplesLimit: 'O faturamento anual ultrapassa o limite do Simples Nacional (R$ 4.8 milhões).',
        factorR: 'Anexo V está sujeito ao "Fator R". Se os gastos com folha de pagamento forem ≥ 28% do faturamento, a tributação pode ser pelo Anexo III, que é mais vantajosa. Esta calculadora não considera o Fator R.',
    },
    fillData: 'Preencha os dados e clique em "Calcular Impostos" para ver a análise.',
    disclaimer: 'Esta é uma simulação simplificada. Os valores são estimativas e não substituem a orientação de um contador profissional.',
};
