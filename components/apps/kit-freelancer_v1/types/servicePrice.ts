
export interface FormData {
  monthlySalary: string;
  fixedCosts: string;
  workDaysPerMonth: string;
  hoursPerDay: string;
  projectTime: string;
  projectTimeUnit: 'hours' | 'days';
  profitMargin: string;
  taxRegime: 'mei' | 'simples';
  meiDasValue: string;
  effectiveTaxRate: string;
  profession: 'designer' | 'developer' | 'content-creator' | 'marketing-specialist' | '';
  experienceLevel: 'junior' | 'mid' | 'senior' | '';
  serviceName: string;
}

export interface ResultData {
  suggestedProjectPrice: number;
  baseProjectCost: number;
  estimatedTax: number;
  totalProfit: number;
  baseHourlyRate: number;
  netProjectRevenue: number;
}