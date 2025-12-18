export default {
    title: 'Service Price Calculator',
    step1: {
        title: 'Step 1: Your Cost Structure',
    },
    step2: {
        title: 'Step 2: Project & Taxes',
    },
    step3: {
        title: 'Step 3: Result',
    },
    serviceName: {
        label: 'Service/Item Name (Optional)',
        placeholder: 'E.g., Landing Page Development'
    },
    createProposal: 'Create Quote with this Value',
    defaultItemName: 'Calculated Service',
    profession: {
        label: 'What is your profession?',
        select: 'Select a profession',
        designer: 'Designer',
        developer: 'Developer',
        contentCreator: 'Content Creator',
        marketingSpecialist: 'Marketing Specialist',
    },
    experienceLevel: {
        label: 'What is your experience level?',
        select: 'Select a level',
        junior: 'Junior',
        mid: 'Mid-level',
        senior: 'Senior',
    },
    monthlySalary: {
        label: 'Monthly Salary Goal ($)',
        placeholder: '5000',
    },
    fixedCosts: {
        label: 'Fixed Operational Costs ($)',
        placeholder: 'Rent, software, etc.',
    },
    workDays: {
        label: 'Working Days per Month',
    },
    hoursPerDay: {
        label: 'Effective Work Hours per Day',
    },
    totalHours: {
        label: 'Total Dedicated Hours/Month',
    },
    projectTime: {
        label: 'Estimated Project Time',
        ariaLabel: 'Project time',
    },
    hours: 'Hours',
    days: 'Days',
    profitMargin: {
        label: 'Additional Profit Margin (%)',
        placeholder: 'e.g., 20',
    },
    taxRegime: {
        label: 'Tax Regime',
        mei: 'Fixed Monthly Tax',
        simples: 'Percentage-based Tax',
    },
    meiDas: {
        label: 'Fixed Tax Amount ($)',
        description: 'This amount will be added to your monthly fixed costs.',
    },
    taxRate: {
        label: 'Average Effective Tax Rate (%)',
        placeholder: 'e.g., 6',
        description: 'Enter the tax rate that will apply to the project value.',
    },
    results: {
        title: 'Detailed Results',
        suggestedPrice: 'Suggested Project Price',
        netProjectRevenue: 'Net Project Revenue (After Tax)',
        netProfit: 'Your Net Profit',
        baseCost: 'Base Project Cost',
        estimatedProfit: 'Estimated Profit (Gross)',
        estimatedTax: 'Estimated Tax',
        baseRate: 'Your base rate (cost/hour) is',
        explanation: {
            title: 'Understand the Base Cost:',
            intro: 'Inside the Project Base Cost are already included:',
            salary: 'The portion of your <strong>desired monthly salary</strong> regarding the hours dedicated to the project.',
            fixedCosts: 'The portion of your <strong>monthly fixed costs</strong> (rent, software, etc.) regarding the hours dedicated to the project.',
            meiDas: 'The fixed <strong>MEI DAS amount</strong> ({{value}}), also prorated into the project hours.',
        }
    }
};